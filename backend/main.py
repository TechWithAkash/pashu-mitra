from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}


@app.get("/welcome")
def welcome():
    return {"message": "Welcome to the Pashumitra API!"}