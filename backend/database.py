from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
personal_info_collection = db.personal_info
social_links_collection = db.social_links
skills_collection = db.skills
experience_collection = db.experience
projects_collection = db.projects
portfolio_images_collection = db.portfolio_images
videos_collection = db.videos
awards_collection = db.awards

async def init_default_data():
    """Initialize database with default data if empty"""
    
    # Check if personal info exists
    personal_count = await personal_info_collection.count_documents({})
    if personal_count == 0:
        default_personal = {
            "name": "Curtis Williams Jr.",
            "title": "FOTOGRAF",
            "tagline": "LET IT BE AMAZING",
            "subtitle": "Advertising Photographer, Film Producer & Director",
            "email": "melroseheights@me.com",
            "phone": "310-880-2341",
            "location": "Los Angeles, CA",
            "bio": """Curtis Williams has worked as an advertising photographer, film producer and director. However, his true love is design and photography, a field in which he has accumulated more than thirty years of experience.

Curtis Williams was born one of nine children, the son of a black army master sergeant. His father was stationed in Germany following WW2, where six-year-old Curtis got his first impressions of Europe and made his happiest childhood memories.

By age seventeen, Curtis had become obsessed with getting out of the hood and landed an apprenticeship at Peterson Productions in Hollywood. He thrived in this artistic environment, working up to sixteen hours a day without pay, drawing on the expertise of top directors and advertising executives.

With the help of his godfather Richard Rucker, Curtis obtained a scholarship at the prestigious Art Center College of Design, Los Angeles. He graduated with honors and at twenty-two, won a Junior Academy Award.

In March 1976, VIVA magazine said: "Twenty-seven year-old Curtis Williams is very much an artist of our time: his camera is the latest in photographic technology and his subjects are modern, liberated women. Yet, the special effects Williams perfected invite comparison with the oil paintings of the very greatest seventeenth-century masters.\"""",
            "quote": "Light is the essence of life, and through my lens, I capture the soul that lives within every frame.",
            "book": "Light The Essence Of Life"
        }
        await personal_info_collection.insert_one(default_personal)

    # Check if social links exist
    social_count = await social_links_collection.count_documents({})
    if social_count == 0:
        default_social = {
            "website": "curtiswilliamsphotograph.com",
            "magazine": "www.melroseheightsmagazinetv.com",
            "facebook": "https://www.facebook.com/curtiswilliamsphotographyla",
            "linkedin": "https://linkedin.com/in/curtis-williams-a5262",
            "instagram": "https://www.instagram.com/",
            "twitter": "https://twitter.com/"
        }
        await social_links_collection.insert_one(default_social)

    # Initialize default skills
    skills_count = await skills_collection.count_documents({})
    if skills_count == 0:
        default_skills = [
            {"name": "Fine Art Photography", "level": 95, "years": "50+ years", "category": "Photography", "order": 1},
            {"name": "Fashion Photography", "level": 98, "years": "50+ years", "category": "Photography", "order": 2},
            {"name": "Commercial Photography", "level": 92, "years": "45+ years", "category": "Photography", "order": 3},
            {"name": "Film Direction", "level": 88, "years": "30+ years", "category": "Film", "order": 4},
            {"name": "Film Production", "level": 90, "years": "35+ years", "category": "Film", "order": 5},
            {"name": "Digital Post-Production", "level": 85, "years": "25+ years", "category": "Digital", "order": 6},
            {"name": "Darkroom Techniques", "level": 95, "years": "50+ years", "category": "Photography", "order": 7},
            {"name": "Fashion Styling", "level": 87, "years": "40+ years", "category": "Creative", "order": 8}
        ]
        await skills_collection.insert_many(default_skills)

    # Initialize default awards
    awards_count = await awards_collection.count_documents({})
    if awards_count == 0:
        default_awards = [
            {
                "title": "Junior Academy Award",
                "organization": "Academy of Motion Picture Arts and Sciences",
                "year": "1976",
                "description": "Recognized for excellence in film and photography at age 22",
                "order": 1
            },
            {
                "title": "VIVA Magazine Feature",
                "organization": "VIVA Magazine",
                "year": "1976",
                "description": "Featured as 'an artist of our time' with techniques compared to 'seventeenth-century masters'",
                "order": 2
            }
        ]
        await awards_collection.insert_many(default_awards)

async def close_db_connection():
    """Close database connection"""
    client.close()