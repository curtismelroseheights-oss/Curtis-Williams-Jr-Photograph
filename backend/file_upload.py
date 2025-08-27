import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from PIL import Image
import mimetypes
from typing import List, Tuple
from pathlib import Path

# Create upload directories
UPLOAD_DIR = Path("/app/backend/uploads")
IMAGES_DIR = UPLOAD_DIR / "images"
VIDEOS_DIR = UPLOAD_DIR / "videos"
THUMBNAILS_DIR = UPLOAD_DIR / "thumbnails"

# Create directories if they don't exist
for directory in [UPLOAD_DIR, IMAGES_DIR, VIDEOS_DIR, THUMBNAILS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Allowed file types
ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
}

ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm"
}

MAX_IMAGE_SIZE = 50 * 1024 * 1024  # 50MB
MAX_VIDEO_SIZE = 1000 * 1024 * 1024  # 1000MB (1GB)

def validate_file(file: UploadFile, file_type: str = "image") -> bool:
    """Validate uploaded file"""
    if file_type == "image":
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid image type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
            )
        if file.size and file.size > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"Image too large. Maximum size: {MAX_IMAGE_SIZE // (1024*1024)}MB"
            )
    elif file_type == "video":
        if file.content_type not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid video type. Allowed types: {', '.join(ALLOWED_VIDEO_TYPES)}"
            )
        if file.size and file.size > MAX_VIDEO_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"Video too large. Maximum size: {MAX_VIDEO_SIZE // (1024*1024)}MB"
            )
    
    return True

def generate_filename(original_filename: str) -> str:
    """Generate unique filename"""
    file_extension = Path(original_filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    return unique_filename

async def save_image(file: UploadFile, category: str = "general") -> Tuple[str, str]:
    """Save uploaded image and create thumbnail"""
    validate_file(file, "image")
    
    # Generate unique filename
    filename = generate_filename(file.filename)
    
    # Create category directory
    category_dir = IMAGES_DIR / category
    category_dir.mkdir(parents=True, exist_ok=True)
    
    # Save original image
    image_path = category_dir / filename
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create thumbnail
    thumbnail_filename = f"thumb_{filename}"
    thumbnail_path = THUMBNAILS_DIR / thumbnail_filename
    
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Create thumbnail (max 300x300, maintain aspect ratio)
            img.thumbnail((300, 300), Image.Resampling.LANCZOS)
            img.save(thumbnail_path, "JPEG", quality=85)
    except Exception as e:
        # If thumbnail creation fails, use original image
        thumbnail_path = image_path
        thumbnail_filename = filename
    
    return str(image_path), str(thumbnail_path)

async def save_video(file: UploadFile, category: str = "general") -> str:
    """Save uploaded video"""
    validate_file(file, "video")
    
    # Generate unique filename
    filename = generate_filename(file.filename)
    
    # Create category directory
    category_dir = VIDEOS_DIR / category
    category_dir.mkdir(parents=True, exist_ok=True)
    
    # Save video
    video_path = category_dir / filename
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return str(video_path)

async def delete_file(file_path: str) -> bool:
    """Delete uploaded file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception:
        return False

def get_file_url(file_path: str) -> str:
    """Convert file path to URL"""
    # Convert absolute path to relative URL
    relative_path = str(Path(file_path).relative_to(UPLOAD_DIR))
    return f"/api/uploads/{relative_path}"

def get_file_info(file_path: str) -> dict:
    """Get file information"""
    if not os.path.exists(file_path):
        return None
    
    stat = os.stat(file_path)
    content_type, _ = mimetypes.guess_type(file_path)
    
    return {
        "size": stat.st_size,
        "content_type": content_type or "application/octet-stream",
        "created_at": stat.st_ctime,
        "modified_at": stat.st_mtime
    }

def optimize_image(image_path: str, max_width: int = 1920, quality: int = 85) -> str:
    """Optimize image for web"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized version
            optimized_path = image_path.replace(Path(image_path).suffix, f"_optimized{Path(image_path).suffix}")
            img.save(optimized_path, "JPEG", quality=quality)
            
            # Replace original with optimized
            shutil.move(optimized_path, image_path)
            
        return image_path
    except Exception as e:
        # If optimization fails, return original
        return image_path