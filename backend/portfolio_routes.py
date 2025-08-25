from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.responses import FileResponse
from typing import List, Optional
import os
from bson import ObjectId
from datetime import datetime

from .database import (
    personal_info_collection, social_links_collection, skills_collection,
    experience_collection, projects_collection, portfolio_images_collection,
    videos_collection, awards_collection
)
from .models import (
    PersonalInfo, PersonalInfoUpdate, SocialLinks, SocialLinksUpdate,
    Skill, SkillCreate, SkillUpdate, Experience, ExperienceCreate, ExperienceUpdate,
    Project, ProjectCreate, ProjectUpdate, PortfolioImage, PortfolioImageCreate, PortfolioImageUpdate,
    Video, VideoCreate, VideoUpdate, Award, AwardCreate, AwardUpdate,
    UploadResponse, BulkUploadResponse
)
from .file_upload import save_image, save_video, delete_file, get_file_url, get_file_info

router = APIRouter()

# Personal Information Endpoints
@router.get("/personal", response_model=PersonalInfo)
async def get_personal_info():
    """Get personal information"""
    personal = await personal_info_collection.find_one()
    if not personal:
        raise HTTPException(status_code=404, detail="Personal information not found")
    return personal

@router.put("/personal", response_model=PersonalInfo)
async def update_personal_info(personal_update: PersonalInfoUpdate):
    """Update personal information"""
    update_data = {k: v for k, v in personal_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await personal_info_collection.find_one_and_update(
        {},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Personal information not found")
    return result

# Social Links Endpoints
@router.get("/social", response_model=SocialLinks)
async def get_social_links():
    """Get social links"""
    social = await social_links_collection.find_one()
    if not social:
        raise HTTPException(status_code=404, detail="Social links not found")
    return social

@router.put("/social", response_model=SocialLinks)
async def update_social_links(social_update: SocialLinksUpdate):
    """Update social links"""
    update_data = {k: v for k, v in social_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await social_links_collection.find_one_and_update(
        {},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Social links not found")
    return result

# Skills Endpoints
@router.get("/skills", response_model=List[Skill])
async def get_skills():
    """Get all skills"""
    skills = await skills_collection.find().sort("order", 1).to_list(1000)
    return skills

@router.post("/skills", response_model=Skill)
async def create_skill(skill: SkillCreate):
    """Create new skill"""
    skill_dict = skill.dict()
    skill_dict["created_at"] = datetime.utcnow()
    skill_dict["updated_at"] = datetime.utcnow()
    
    result = await skills_collection.insert_one(skill_dict)
    created_skill = await skills_collection.find_one({"_id": result.inserted_id})
    return created_skill

@router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(skill_id: str, skill_update: SkillUpdate):
    """Update skill"""
    if not ObjectId.is_valid(skill_id):
        raise HTTPException(status_code=400, detail="Invalid skill ID")
    
    update_data = {k: v for k, v in skill_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await skills_collection.find_one_and_update(
        {"_id": ObjectId(skill_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Skill not found")
    return result

@router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str):
    """Delete skill"""
    if not ObjectId.is_valid(skill_id):
        raise HTTPException(status_code=400, detail="Invalid skill ID")
    
    result = await skills_collection.delete_one({"_id": ObjectId(skill_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill deleted successfully"}

# Experience Endpoints
@router.get("/experience", response_model=List[Experience])
async def get_experience():
    """Get all experience"""
    experience = await experience_collection.find().sort("order", 1).to_list(1000)
    return experience

@router.post("/experience", response_model=Experience)
async def create_experience(experience: ExperienceCreate):
    """Create new experience"""
    exp_dict = experience.dict()
    exp_dict["created_at"] = datetime.utcnow()
    exp_dict["updated_at"] = datetime.utcnow()
    
    result = await experience_collection.insert_one(exp_dict)
    created_exp = await experience_collection.find_one({"_id": result.inserted_id})
    return created_exp

@router.put("/experience/{exp_id}", response_model=Experience)
async def update_experience(exp_id: str, exp_update: ExperienceUpdate):
    """Update experience"""
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")
    
    update_data = {k: v for k, v in exp_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await experience_collection.find_one_and_update(
        {"_id": ObjectId(exp_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Experience not found")
    return result

@router.delete("/experience/{exp_id}")
async def delete_experience(exp_id: str):
    """Delete experience"""
    if not ObjectId.is_valid(exp_id):
        raise HTTPException(status_code=400, detail="Invalid experience ID")
    
    result = await experience_collection.delete_one({"_id": ObjectId(exp_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    return {"message": "Experience deleted successfully"}

# Projects Endpoints
@router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all projects"""
    projects = await projects_collection.find().sort("order", 1).to_list(1000)
    return projects

@router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create new project"""
    project_dict = project.dict()
    project_dict["created_at"] = datetime.utcnow()
    project_dict["updated_at"] = datetime.utcnow()
    
    result = await projects_collection.insert_one(project_dict)
    created_project = await projects_collection.find_one({"_id": result.inserted_id})
    return created_project

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_update: ProjectUpdate):
    """Update project"""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    update_data = {k: v for k, v in project_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await projects_collection.find_one_and_update(
        {"_id": ObjectId(project_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return result

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete project"""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
    
    result = await projects_collection.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}

# Portfolio Images Endpoints
@router.get("/images", response_model=List[PortfolioImage])
async def get_portfolio_images(category: Optional[str] = None):
    """Get portfolio images, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    images = await portfolio_images_collection.find(query).sort("order", 1).to_list(1000)
    return images

@router.post("/images/upload", response_model=PortfolioImage)
async def upload_portfolio_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form(...),
    featured: bool = Form(False)
):
    """Upload new portfolio image"""
    try:
        # Save image and create thumbnail
        image_path, thumbnail_path = await save_image(file, category)
        
        # Create database entry
        image_data = {
            "title": title,
            "description": description,
            "category": category,
            "image_url": get_file_url(image_path),
            "thumbnail_url": get_file_url(thumbnail_path),
            "featured": featured,
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await portfolio_images_collection.insert_one(image_data)
        created_image = await portfolio_images_collection.find_one({"_id": result.inserted_id})
        return created_image
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.put("/images/{image_id}", response_model=PortfolioImage)
async def update_portfolio_image(image_id: str, image_update: PortfolioImageUpdate):
    """Update portfolio image"""
    if not ObjectId.is_valid(image_id):
        raise HTTPException(status_code=400, detail="Invalid image ID")
    
    update_data = {k: v for k, v in image_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await portfolio_images_collection.find_one_and_update(
        {"_id": ObjectId(image_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Image not found")
    return result

@router.delete("/images/{image_id}")
async def delete_portfolio_image(image_id: str):
    """Delete portfolio image"""
    if not ObjectId.is_valid(image_id):
        raise HTTPException(status_code=400, detail="Invalid image ID")
    
    # Get image info before deleting
    image = await portfolio_images_collection.find_one({"_id": ObjectId(image_id)})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete files
    if image.get("image_url"):
        await delete_file(image["image_url"].replace("/api/uploads/", "/app/backend/uploads/"))
    if image.get("thumbnail_url"):
        await delete_file(image["thumbnail_url"].replace("/api/uploads/", "/app/backend/uploads/"))
    
    # Delete database entry
    result = await portfolio_images_collection.delete_one({"_id": ObjectId(image_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {"message": "Image deleted successfully"}

# Videos Endpoints
@router.get("/videos", response_model=List[Video])
async def get_videos(category: Optional[str] = None):
    """Get videos, optionally filtered by category"""
    query = {}
    if category:
        query["category"] = category
    
    videos = await videos_collection.find(query).sort("order", 1).to_list(1000)
    return videos

@router.post("/videos/upload", response_model=Video)
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form(...),
    featured: bool = Form(False)
):
    """Upload new video"""
    try:
        # Save video
        video_path = await save_video(file, category)
        
        # Create database entry
        video_data = {
            "title": title,
            "description": description,
            "category": category,
            "video_url": get_file_url(video_path),
            "thumbnail_url": "",  # Will be generated later
            "duration": 0,  # Will be calculated later
            "featured": featured,
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await videos_collection.insert_one(video_data)
        created_video = await videos_collection.find_one({"_id": result.inserted_id})
        return created_video
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.put("/videos/{video_id}", response_model=Video)
async def update_video(video_id: str, video_update: VideoUpdate):
    """Update video"""
    if not ObjectId.is_valid(video_id):
        raise HTTPException(status_code=400, detail="Invalid video ID")
    
    update_data = {k: v for k, v in video_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await videos_collection.find_one_and_update(
        {"_id": ObjectId(video_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Video not found")
    return result

@router.delete("/videos/{video_id}")
async def delete_video(video_id: str):
    """Delete video"""
    if not ObjectId.is_valid(video_id):
        raise HTTPException(status_code=400, detail="Invalid video ID")
    
    # Get video info before deleting
    video = await videos_collection.find_one({"_id": ObjectId(video_id)})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Delete files
    if video.get("video_url"):
        await delete_file(video["video_url"].replace("/api/uploads/", "/app/backend/uploads/"))
    if video.get("thumbnail_url"):
        await delete_file(video["thumbnail_url"].replace("/api/uploads/", "/app/backend/uploads/"))
    
    # Delete database entry
    result = await videos_collection.delete_one({"_id": ObjectId(video_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {"message": "Video deleted successfully"}

# Awards Endpoints
@router.get("/awards", response_model=List[Award])
async def get_awards():
    """Get all awards"""
    awards = await awards_collection.find().sort("order", 1).to_list(1000)
    return awards

@router.post("/awards", response_model=Award)
async def create_award(award: AwardCreate):
    """Create new award"""
    award_dict = award.dict()
    award_dict["created_at"] = datetime.utcnow()
    award_dict["updated_at"] = datetime.utcnow()
    
    result = await awards_collection.insert_one(award_dict)
    created_award = await awards_collection.find_one({"_id": result.inserted_id})
    return created_award

@router.put("/awards/{award_id}", response_model=Award)
async def update_award(award_id: str, award_update: AwardUpdate):
    """Update award"""
    if not ObjectId.is_valid(award_id):
        raise HTTPException(status_code=400, detail="Invalid award ID")
    
    update_data = {k: v for k, v in award_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await awards_collection.find_one_and_update(
        {"_id": ObjectId(award_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Award not found")
    return result

@router.delete("/awards/{award_id}")
async def delete_award(award_id: str):
    """Delete award"""
    if not ObjectId.is_valid(award_id):
        raise HTTPException(status_code=400, detail="Invalid award ID")
    
    result = await awards_collection.delete_one({"_id": ObjectId(award_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Award not found")
    
    return {"message": "Award deleted successfully"}

# File serving endpoint
@router.get("/uploads/{file_path:path}")
async def serve_uploaded_file(file_path: str):
    """Serve uploaded files"""
    full_path = f"/app/backend/uploads/{file_path}"
    if os.path.exists(full_path):
        return FileResponse(full_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")