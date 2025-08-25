#!/usr/bin/env python3
"""
Update all Curtis Williams references to Curtis Williams Jr. in the database
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def update_personal_info():
    """Update personal information to use Curtis Williams Jr."""
    
    # Update bio text
    updated_bio = """Curtis Williams Jr. has worked as an advertising photographer, film producer and director. However, his true love is design and photography, a field in which he has accumulated more than thirty years of experience.

Curtis Williams Jr. was born one of nine children, the son of a black army master sergeant. His father was stationed in Germany following WW2, where six-year-old Curtis got his first impressions of Europe and made his happiest childhood memories.

By age seventeen, Curtis Williams Jr. had become obsessed with getting out of the hood and landed an apprenticeship at Peterson Productions in Hollywood. He thrived in this artistic environment, working up to sixteen hours a day without pay, drawing on the expertise of top directors and advertising executives.

With the help of his godfather Richard Rucker, Curtis Williams Jr. obtained a scholarship at the prestigious Art Center College of Design, Los Angeles. He graduated with honors and at twenty-two, won a Junior Academy Award.

In March 1976, VIVA magazine said: "Twenty-seven year-old Curtis Williams Jr. is very much an artist of our time: his camera is the latest in photographic technology and his subjects are modern, liberated women. Yet, the special effects Curtis Williams Jr. perfected invite comparison with the oil paintings of the very greatest seventeenth-century masters."""""

    result = await db.personal_info.update_one(
        {},
        {"$set": {
            "name": "Curtis Williams Jr.",
            "bio": updated_bio,
            "quote": "Light is the essence of life, and through my lens, I capture the soul that lives within every frame. - Curtis Williams Jr."
        }}
    )
    
    print(f"✅ Updated personal info: {result.modified_count} document(s) modified")

async def update_experience():
    """Update experience entries to reference Curtis Williams Jr."""
    
    # Get all experience entries
    experiences = await db.experience.find().to_list(1000)
    
    for exp in experiences:
        updated_description = exp['description'].replace("Curtis Williams", "Curtis Williams Jr.")
        
        # Update highlights to include Jr.
        updated_highlights = []
        for highlight in exp.get('highlights', []):
            updated_highlights.append(highlight.replace("Curtis Williams", "Curtis Williams Jr."))
        
        await db.experience.update_one(
            {"_id": exp["_id"]},
            {"$set": {
                "description": updated_description,
                "highlights": updated_highlights
            }}
        )
    
    print(f"✅ Updated {len(experiences)} experience entries")

async def update_projects():
    """Update project descriptions to reference Curtis Williams Jr."""
    
    projects = await db.projects.find().to_list(1000)
    
    for project in projects:
        updated_description = project['description'].replace("Curtis Williams", "Curtis Williams Jr.")
        
        await db.projects.update_one(
            {"_id": project["_id"]},
            {"$set": {"description": updated_description}}
        )
    
    print(f"✅ Updated {len(projects)} project entries")

async def update_image_descriptions():
    """Update image descriptions to reference Curtis Williams Jr."""
    
    images = await db.portfolio_images.find().to_list(1000)
    
    for image in images:
        updated_description = image['description'].replace("Curtis Williams", "Curtis Williams Jr.")
        updated_title = image['title'].replace("Curtis Williams", "Curtis Williams Jr.")
        
        await db.portfolio_images.update_one(
            {"_id": image["_id"]},
            {"$set": {
                "description": updated_description,
                "title": updated_title
            }}
        )
    
    print(f"✅ Updated {len(images)} image descriptions")

async def main():
    """Main function to update all references"""
    print("🔄 Updating all Curtis Williams references to Curtis Williams Jr...")
    
    await update_personal_info()
    await update_experience()
    await update_projects()
    await update_image_descriptions()
    
    client.close()
    print("🎉 All updates complete! Curtis Williams Jr. is now properly referenced throughout the database.")

if __name__ == "__main__":
    asyncio.run(main())