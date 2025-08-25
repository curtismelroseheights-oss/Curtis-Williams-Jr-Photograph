#!/usr/bin/env python3
"""
Fix broken images and clean up database
"""

import asyncio
import os
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def check_and_fix_images():
    """Check all images and fix broken ones"""
    
    print("🔍 Checking all images in database...")
    
    images = await db.portfolio_images.find().to_list(1000)
    print(f"Found {len(images)} images in database")
    
    broken_images = []
    working_images = []
    
    for image in images:
        image_path = image['image_url'].replace('/api/uploads/', '/app/backend/uploads/')
        
        if os.path.exists(image_path):
            file_size = os.path.getsize(image_path)
            if file_size > 1000:  # At least 1KB
                working_images.append(image)
            else:
                broken_images.append(image)
                print(f"❌ Small/broken file: {image['title']} ({file_size} bytes)")
        else:
            broken_images.append(image)
            print(f"❌ Missing file: {image['title']}")
    
    print(f"✅ Working images: {len(working_images)}")
    print(f"❌ Broken images: {len(broken_images)}")
    
    # Remove broken images from database
    for broken_image in broken_images:
        await db.portfolio_images.delete_one({"_id": broken_image["_id"]})
    
    print(f"🧹 Cleaned up {len(broken_images)} broken images from database")
    
    # Report remaining images by category
    categories = {}
    for image in working_images:
        cat = image['category']
        if cat not in categories:
            categories[cat] = 0
        categories[cat] += 1
    
    print("\n📊 Working images by category:")
    for cat, count in categories.items():
        print(f"   {cat}: {count} images")
    
    return len(working_images)

async def main():
    """Main function"""
    working_count = await check_and_fix_images()
    client.close()
    print(f"\n🎉 Database cleanup complete! {working_count} working images remain.")

if __name__ == "__main__":
    asyncio.run(main())