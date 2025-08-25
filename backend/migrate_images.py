#!/usr/bin/env python3
"""
Image Migration Script for Curtis Williams Jr. Portfolio
Downloads images from existing website and uploads to new backend system
"""

import requests
import asyncio
import aiohttp
import aiofiles
import tempfile
import os
from pathlib import Path
import uuid
from PIL import Image
import io

# Backend API URL
API_BASE = "http://localhost:8001/api"

# Image categories and their URLs from Curtis Williams' website
IMAGE_COLLECTIONS = {
    "fashion": [
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_79a9dce6ff934c66a8d2de796ed8f55c_mv2.jpg",
            "title": "Fashion Portrait 1",
            "description": "Professional fashion photography showcasing modern elegance"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_b2e6fa263aa84653802e7046bbb15205_mv2-scaled.jpg",
            "title": "Fashion Portrait 2", 
            "description": "High-fashion editorial featuring contemporary styling"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_c8c278e0c3874065b9e3ec150d2f3ad3_mv2.jpg",
            "title": "Fashion Portrait 3",
            "description": "Artistic fashion photography with dramatic lighting"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_ff53e6e7d70948bb9d2f3d8e043bd1fe_mv2.jpg",
            "title": "Fashion Portrait 4",
            "description": "Professional model photography for fashion campaign"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_f539c2e0e7a54f8f816dd789b465ae6b_mv2-scaled.jpg",
            "title": "Fashion Portrait 5",
            "description": "Editorial fashion photography with sophisticated composition"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_4f6c0f546a504ad19cdd0adc856046af_mv2-scaled.jpg",
            "title": "Fashion Portrait 6",
            "description": "High-end fashion photography showcasing artistic vision"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_4fea0a073e324fd685b3c93445bc6e52_mv2.jpg",
            "title": "Fashion Portrait 7",
            "description": "Professional fashion shoot with dynamic composition"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_0d170db50c884de5a71d36dc94678526_mv2.jpg",
            "title": "Fashion Portrait 8",
            "description": "Contemporary fashion photography with artistic flair"
        }
    ],
    
    "covers": [
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_0a2fb3bc03394c1bba2eb0df46ba6f42_mv2.jpg",
            "title": "Magazine Cover 1",
            "description": "Professional magazine cover photography"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_432cfd16fb054352a40df084be763895_mv2-scaled.jpg",
            "title": "Magazine Cover 2",
            "description": "Editorial magazine cover with dramatic lighting"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_bedb6ba5a9814de4b9f8a65306599cd5_mv2-scaled.jpg",
            "title": "Magazine Cover 3", 
            "description": "High-fashion magazine cover photography"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_7408675d88a64a02b0da032191adace1_mv2-scaled.jpg",
            "title": "Magazine Cover 4",
            "description": "Professional editorial cover photography"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_e5d066cd3020481c9f649036821f5a82_mv2-scaled.jpg",
            "title": "Magazine Cover 5",
            "description": "Artistic magazine cover with sophisticated styling"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_f9925dc0d0f04b2a8f965004b7ef9025_mv2-scaled.jpg",
            "title": "Magazine Cover 6",
            "description": "Editorial magazine photography for major publication"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_682ff56bed7e4b02bd77cdb743c38c79_mv2-scaled.jpg",
            "title": "Magazine Cover 7",
            "description": "Professional magazine cover with artistic composition"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_8e5f653c72dc4a879d94651f8513711e_mv2.jpg",
            "title": "Magazine Cover 8",
            "description": "Contemporary magazine cover photography"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/d3c016_1de30a1cb1d74e8cb95f5793098bbe47_mv2.jpg",
            "title": "Magazine Cover 9",
            "description": "Editorial cover photography with modern styling"
        }
    ],
    
    "stillLife": [
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_e6c4a31ddd97497e8829f8c8dad92616_mv2-scaled.jpg",
            "title": "Still Life 1",
            "description": "Artistic still life photography with sophisticated lighting"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_f4aedde7cda5465daf55d7580693cd69_mv2-scaled.jpg",
            "title": "Still Life 2",
            "description": "Commercial still life photography for advertising"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_10da7f0aa1e04e30b29138e9c93b3c3d_mv2.jpg",
            "title": "Still Life 3",
            "description": "Professional product photography with artistic flair"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_0577c17abc7f4a18b4795e888ed60c46_mv2.jpg",
            "title": "Still Life 4",
            "description": "Fine art still life with dramatic composition"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_bc14667897c74ad48566f60e3f2ea6b0_mv2-scaled.jpg",
            "title": "Still Life 5",
            "description": "Sophisticated still life photography for commercial use"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_6a54c64cc020496e898acc7a3f893010_mv2.jpg",
            "title": "Still Life 6",
            "description": "Artistic still life with masterful lighting techniques"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_869f1f427c52418da9dd2d9406515066_mv2-scaled.jpg",
            "title": "Still Life 7",
            "description": "Professional still life for advertising campaign"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_a332cf5792be43d69fa2f226250466ac_mv2-scaled.jpg",
            "title": "Still Life 8",
            "description": "Contemporary still life with sophisticated styling"
        }
    ],
    
    "artPhotoPainting": [
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_c1214a3bf8ad456faf99267186b28fa0_mv2-scaled.jpg",
            "title": "Art Photo Painting 1",
            "description": "Revolutionary photo-painting technique blending photography with fine art"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_7b737f7c07554524ab36ef8c992b542f_mv2-scaled.jpg",
            "title": "Art Photo Painting 2",
            "description": "Artistic photography with painterly effects and masterful composition"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_08342f67f01a4e59a13d0cf24daea04b_mv2-scaled.jpg",
            "title": "Art Photo Painting 3",
            "description": "Fine art photography using innovative darkroom techniques"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_f7d4097017fc4bb88b344381ede1488b_mv2-1-scaled.jpg",
            "title": "Art Photo Painting 4",
            "description": "Experimental photo-painting combining classical art with modern photography"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_b605d61a3b494a608fcf07106ef2358f_mv2-scaled.jpg",
            "title": "Art Photo Painting 5",
            "description": "Artistic photography with techniques compared to 17th-century masters"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_c1214a3bf8ad456faf99267186b28fa0_mv2-1-scaled.jpg",
            "title": "Art Photo Painting 6",
            "description": "Innovative photo-painting showcasing artistic vision and technical mastery"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_6e90d0f414d0472db87bfa2ce563e8ec_mv2-scaled.jpg",
            "title": "Art Photo Painting 7",
            "description": "Fine art photography with revolutionary darkroom effects"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/05/d3c016_0739b3eb8c4c4e16b86580075e190083_mv2-scaled.jpg",
            "title": "Art Photo Painting 8",
            "description": "Masterful photo-painting technique blending artistic vision with photography"
        }
    ],
    
    "editorial": [
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Damernas-Varld-4-Pages-1-1.jpg",
            "title": "Damernas Varld 4 Pages",
            "description": "Editorial spread for prestigious Swedish magazine Damernas Varld"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Damernas-Varld-Fanny-Sach-Pages-1-1.jpg",
            "title": "Damernas Varld Fanny Sach Feature",
            "description": "Fashion editorial featuring model Fanny Sach for Damernas Varld magazine"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Damernas-Varld-Magazine-Pages-1-1.jpg",
            "title": "Damernas Varld Magazine Spread",
            "description": "Multi-page editorial feature for leading Swedish fashion publication"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Damernas-Varld-Magazine-1-Pages-1-1.jpg",
            "title": "Damernas Varld Editorial 1",
            "description": "Professional editorial photography for international fashion magazine"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Damernas-Varld-Miss-Sweden-Pages-1-1.jpg",
            "title": "Damernas Varld Miss Sweden Feature",
            "description": "Exclusive Miss Sweden photo shoot for Damernas Varld magazine"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Gala-1-Magazine-Pages-1-2.jpg",
            "title": "Gala Magazine Feature 1",
            "description": "Editorial photography for prestigious Gala magazine publication"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Gala-Magazine-Pages-1-2.jpg",
            "title": "Gala Magazine Editorial",
            "description": "High-fashion editorial spread for Gala magazine"
        },
        {
            "url": "https://curtiswilliamsphotograph.com/wp-content/uploads/2021/06/Grace-Jones-Pages-1-2.jpg",
            "title": "Grace Jones Editorial Feature",
            "description": "Iconic editorial photography session with legendary Grace Jones"
        }
    ]
}

async def download_image(session, url, filename):
    """Download image from URL"""
    try:
        async with session.get(url) as response:
            if response.status == 200:
                content = await response.read()
                return content
            else:
                print(f"❌ Failed to download {url}: Status {response.status}")
                return None
    except Exception as e:
        print(f"❌ Error downloading {url}: {str(e)}")
        return None

async def upload_image_to_backend(image_content, title, description, category):
    """Upload image to backend API"""
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
            temp_file.write(image_content)
            temp_file_path = temp_file.name
        
        # Prepare form data
        with open(temp_file_path, 'rb') as f:
            files = {'file': ('image.jpg', f, 'image/jpeg')}
            data = {
                'title': title,
                'description': description,
                'category': category,
                'featured': 'false'
            }
            
            # Upload to backend
            response = requests.post(f"{API_BASE}/images/upload", files=files, data=data)
            
        # Clean up temp file
        os.unlink(temp_file_path)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Upload failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error uploading image: {str(e)}")
        return None

async def migrate_images():
    """Main migration function"""
    print("🚀 Starting Curtis Williams Jr. Image Migration...")
    print("📸 Downloading and uploading all images from your website...")
    
    total_images = sum(len(images) for images in IMAGE_COLLECTIONS.values())
    current_count = 0
    successful_uploads = 0
    
    async with aiohttp.ClientSession() as session:
        for category, images in IMAGE_COLLECTIONS.items():
            print(f"\n📂 Processing {category.upper()} category ({len(images)} images)...")
            
            for image_info in images:
                current_count += 1
                print(f"   [{current_count}/{total_images}] {image_info['title']}...")
                
                # Download image
                image_content = await download_image(session, image_info['url'], image_info['title'])
                
                if image_content:
                    # Upload to backend
                    result = await upload_image_to_backend(
                        image_content,
                        image_info['title'],
                        image_info['description'],
                        category
                    )
                    
                    if result:
                        print(f"   ✅ Successfully uploaded: {image_info['title']}")
                        successful_uploads += 1
                    else:
                        print(f"   ❌ Failed to upload: {image_info['title']}")
                else:
                    print(f"   ❌ Failed to download: {image_info['title']}")
    
    print(f"\n🎉 Migration Complete!")
    print(f"   ✅ Successfully uploaded: {successful_uploads}/{total_images} images")
    print(f"   📂 Categories populated: {', '.join(IMAGE_COLLECTIONS.keys())}")
    print(f"   🌐 All images from curtiswilliamsphotograph.com are now in your new portfolio!")

if __name__ == "__main__":
    asyncio.run(migrate_images())