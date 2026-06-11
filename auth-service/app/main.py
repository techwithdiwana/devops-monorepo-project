from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "auth-service"
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