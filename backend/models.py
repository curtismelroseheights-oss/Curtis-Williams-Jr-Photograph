from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid objectid")

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

# Personal Information Models
class PersonalInfoBase(BaseModel):
    name: str
    title: str
    tagline: str
    subtitle: str
    email: str
    phone: str
    location: str
    bio: str
    quote: str
    book: str

class PersonalInfoCreate(PersonalInfoBase):
    pass

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    subtitle: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    quote: Optional[str] = None
    book: Optional[str] = None

class PersonalInfo(PersonalInfoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Social Links Models
class SocialLinksBase(BaseModel):
    website: str
    magazine: str
    facebook: str
    linkedin: str
    instagram: str
    twitter: str

class SocialLinksCreate(SocialLinksBase):
    pass

class SocialLinksUpdate(BaseModel):
    website: Optional[str] = None
    magazine: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None

class SocialLinks(SocialLinksBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Skills Models
class SkillBase(BaseModel):
    name: str
    level: int = Field(..., ge=0, le=100)
    years: str
    category: str = "Photography"
    order: int = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = Field(None, ge=0, le=100)
    years: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None

class Skill(SkillBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Experience Models
class ExperienceBase(BaseModel):
    title: str
    company: str
    location: str
    period: str
    type: str
    description: str
    highlights: List[str] = []
    order: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    period: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    order: Optional[int] = None

class Experience(ExperienceBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Projects Models
class ProjectBase(BaseModel):
    title: str
    category: str
    year: str
    description: str
    image: str
    tags: List[str] = []
    featured: bool = False
    order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    order: Optional[int] = None

class Project(ProjectBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Portfolio Images Models
class PortfolioImageBase(BaseModel):
    title: str
    description: str = ""
    category: str  # fashion, covers, stillLife, artPhotoPainting, editorial
    image_url: str
    thumbnail_url: str = ""
    order: int = 0
    featured: bool = False

class PortfolioImageCreate(PortfolioImageBase):
    pass

class PortfolioImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    order: Optional[int] = None
    featured: Optional[bool] = None

class PortfolioImage(PortfolioImageBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Videos Models
class VideoBase(BaseModel):
    title: str
    description: str = ""
    category: str  # tv-show, interview, behind-scenes, art-direction
    video_url: str
    thumbnail_url: str = ""
    duration: int = 0  # in seconds
    order: int = 0
    featured: bool = False

class VideoCreate(VideoBase):
    pass

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    order: Optional[int] = None
    featured: Optional[bool] = None

class Video(VideoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Awards Models
class AwardBase(BaseModel):
    title: str
    organization: str
    year: str
    description: str
    order: int = 0

class AwardCreate(AwardBase):
    pass

class AwardUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None

class Award(AwardBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# File Upload Models
class UploadResponse(BaseModel):
    filename: str
    url: str
    size: int
    content_type: str

class BulkUploadResponse(BaseModel):
    uploaded_files: List[UploadResponse]
    failed_files: List[str] = []