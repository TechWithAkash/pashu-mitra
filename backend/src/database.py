from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from src.config import settings
from src.logger import logger

_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongodb():
    """Initialize Motor client. Called during FastAPI startup."""
    global _client, _database
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    _database = _client[settings.DATABASE_NAME]
    # Verify connectivity
    await _client.admin.command("ping")
    logger.info(f"Connected to MongoDB database: {settings.DATABASE_NAME}")


async def close_mongodb_connection():
    """Close Motor client. Called during FastAPI shutdown."""
    global _client, _database
    if _client is not None:
        _client.close()
        logger.info("MongoDB connection closed")
    _client = None
    _database = None


def get_database() -> AsyncIOMotorDatabase:
    """Return the database instance."""
    if _database is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongodb() first.")
    return _database
