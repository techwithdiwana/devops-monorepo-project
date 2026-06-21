from app.routes.auth import router as auth_router
from fastapi import FastAPI
from app.database import Base, engine
from app.models.user import User
import os
import pymysql

app = FastAPI()
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
Base.metadata.create_all(bind=engine)

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

@app.get("/health")
def health():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        conn.close()

        return {
            "status": "UP",
            "service": "auth-service",
            "database": "CONNECTED"
        }

    except Exception as e:
        return {
            "status": "DOWN",
            "service": "auth-service",
            "database": "FAILED",
            "error": str(e)
        }


@app.get("/users")
def users():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        cursor = conn.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100)
        )
        """)

        conn.commit()

        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]

        conn.close()

        return {
            "users_count": count
        }

    except Exception as e:
        return {
            "error": str(e)
        }