# Curtis Williams Jr. Portfolio - Backend API Contracts

## Overview
Full-stack portfolio management system with photo/video uploads, content management, and admin panel.

## Database Models

### 1. Personal Information
```javascript
PersonalInfo {
  id: ObjectId,
  name: String,
  title: String, 
  tagline: String,
  subtitle: String,
  email: String,
  phone: String,
  location: String,
  bio: String,
  quote: String,
  book: String,
  created_at: Date,
  updated_at: Date
}
```

### 2. Social Links
```javascript
SocialLinks {
  id: ObjectId,
  website: String,
  magazine: String,
  facebook: String,
  linkedin: String,
  instagram: String,
  twitter: String,
  created_at: Date,
  updated_at: Date
}
```

### 3. Skills
```javascript
Skill {
  id: ObjectId,
  name: String,
  level: Number, // 0-100
  years: String,
  category: String,
  order: Number,
  created_at: Date,
  updated_at: Date
}
```

### 4. Experience
```javascript
Experience {
  id: ObjectId,
  title: String,
  company: String,
  location: String,
  period: String,
  type: String,
  description: String,
  highlights: [String],
  order: Number,
  created_at: Date,
  updated_at: Date
}
```

### 5. Projects
```javascript
Project {
  id: ObjectId,
  title: String,
  category: String,
  year: String,
  description: String,
  image: String, // URL to uploaded image
  tags: [String],
  featured: Boolean,
  order: Number,
  created_at: Date,
  updated_at: Date
}
```

### 6. Portfolio Images
```javascript
PortfolioImage {
  id: ObjectId,
  title: String,
  description: String,
  category: String, // fashion, covers, stillLife, artPhotoPainting, editorial
  image_url: String,
  thumbnail_url: String,
  order: Number,
  featured: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### 7. Videos
```javascript
Video {
  id: ObjectId,
  title: String,
  description: String,
  category: String, // tv-show, interview, behind-scenes, art-direction
  video_url: String,
  thumbnail_url: String,
  duration: Number,
  order: Number,
  featured: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### 8. Awards
```javascript
Award {
  id: ObjectId,
  title: String,
  organization: String,
  year: String,
  description: String,
  order: Number,
  created_at: Date,
  updated_at: Date
}
```

## API Endpoints

### Personal Information
- `GET /api/personal` - Get personal information
- `PUT /api/personal` - Update personal information

### Social Links
- `GET /api/social` - Get social links
- `PUT /api/social` - Update social links

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Experience
- `GET /api/experience` - Get all experience
- `POST /api/experience` - Create new experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Portfolio Images
- `GET /api/images` - Get all images (with category filter)
- `POST /api/images/upload` - Upload new image(s)
- `PUT /api/images/:id` - Update image info
- `DELETE /api/images/:id` - Delete image
- `PUT /api/images/reorder` - Reorder images

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos/upload` - Upload new video
- `PUT /api/videos/:id` - Update video info
- `DELETE /api/videos/:id` - Delete video

### Awards
- `GET /api/awards` - Get all awards
- `POST /api/awards` - Create new award
- `PUT /api/awards/:id` - Update award
- `DELETE /api/awards/:id` - Delete award

### File Management
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/video` - Upload video file
- `DELETE /api/upload/:filename` - Delete uploaded file

## File Storage Structure
```
/uploads/
  /images/
    /portfolio/
      /fashion/
      /covers/
      /still-life/
      /art-photo-painting/
      /editorial/
    /projects/
    /thumbnails/
  /videos/
    /tv-shows/
    /interviews/
    /behind-scenes/
    /thumbnails/
```

## Frontend Integration Points

### Mock Data Replacement
- Replace `/src/mock.js` data with API calls
- Add loading states and error handling
- Implement real-time updates

### New Features to Add
- Admin panel for content management
- Image upload with drag-and-drop
- Video upload with progress tracking
- Content editor with live preview
- Portfolio reorganization interface

### Admin Panel Routes
- `/admin` - Dashboard overview
- `/admin/personal` - Edit personal info
- `/admin/portfolio` - Manage images
- `/admin/videos` - Manage videos
- `/admin/experience` - Manage experience
- `/admin/skills` - Manage skills
- `/admin/projects` - Manage projects

## Security & Performance
- File upload validation (size, type)
- Image optimization and thumbnail generation
- Video compression and streaming optimization
- Rate limiting on upload endpoints
- Input validation and sanitization
- Error handling and logging