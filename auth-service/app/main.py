from fastapi import FastAPI
import os

app = FastAPI()

DB_HOST = os.getenv("DB_HOST", "not-set")
DB_USER = os.getenv("DB_USER", "not-set")


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "auth-service",
        "db_host": DB_HOST,
        "db_user": DB_USER
    }


@app.post("/login")
def login():
    return {
        "message": "Login Successful"
    }


@app.post("/register")
def register():
    return {
        "message": "User Registered"
    }