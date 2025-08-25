from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import our custom modules
from database import init_default_data, close_db_connection
from portfolio_routes import router as portfolio_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Curtis Williams Jr. Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Original test endpoints
@api_router.get("/")
async def root():
    return {"message": "Curtis Williams Jr. Portfolio API is running!"}

# Include portfolio routes
api_router.include_router(portfolio_router, tags=["portfolio"])

# Include the router in the main app
app.include_router(api_router)

# Serve uploaded files
uploads_dir = Path("/app/backend/uploads")
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    logger.info("Starting Curtis Williams Jr. Portfolio API...")
    await init_default_data()
    logger.info("Database initialized successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection"""
    await close_db_connection()
    logger.info("Database connection closed")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Curtis Williams Jr. Portfolio API is running",
        "timestamp": datetime.utcnow().isoformat()
    }
