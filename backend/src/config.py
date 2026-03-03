from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: str
    DATABASE_NAME: str = "pashu-mitra"

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # App
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
