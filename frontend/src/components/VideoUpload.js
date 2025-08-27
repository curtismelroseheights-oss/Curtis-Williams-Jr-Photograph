import React, { useState, useCallback } from 'react';

const VideoUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('tv-show');

  const videoCategories = [
    { value: 'tv-show', label: '📺 TV Show Episodes' },
    { value: 'interview', label: '🎤 Celebrity Interviews' },
    { value: 'behind-scenes', label: '🎬 Behind the Scenes' },
    { value: 'workshop', label: '📸 Photography Workshops' },
    { value: 'art-direction', label: '🎨 Art Direction Process' },
    { value: 'melrose-heights', label: '🏢 Melrose Heights Content' }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    const newVideos = videoFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      title: file.name.split('.')[0].replace(/[_-]/g, ' '),
      description: `Curtis Williams Jr.'s ${selectedCategory} content`,
      status: 'ready',
      category: selectedCategory
    }));
    
    setVideos(prev => [...prev, ...newVideos]);
  };

  const updateVideo = (id, field, value) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, [field]: value } : video
    ));
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const uploadVideo = async (video) => {
    const formData = new FormData();
    formData.append('file', video.file);
    formData.append('title', video.title);
    formData.append('description', video.description);
    formData.append('category', video.category);
    formData.append('featured', 'false');

    try {
      const response = await fetch('http://localhost:8001/api/videos/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        updateVideo(video.id, 'status', 'success');
        return await response.json();
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      updateVideo(video.id, 'status', 'error');
      updateVideo(video.id, 'error', error.message);
      throw error;
    }
  };

  const uploadAll = async () => {
    setUploading(true);
    const readyVideos = videos.filter(v => v.status === 'ready');
    
    for (const video of readyVideos) {
      try {
        updateVideo(video.id, 'status', 'uploading');
        await uploadVideo(video);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🎬 Curtis Williams Jr.
          </h1>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Video Upload Center
          </h2>
          <div style={{
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid #4CAF50',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#4CAF50', margin: '0 0 0.5rem 0' }}>
              ✅ Video Size Limit Increased!
            </h3>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              <strong>New Limit: 1GB (1000MB)</strong> - Upload your full Melrose Heights TV episodes!
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>
            Select Video Category:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {videoCategories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: selectedCategory === category.value ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: `2px solid ${selectedCategory === category.value ? '#4CAF50' : '#666'}`,
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Upload Area */}
        <div
          style={{
            border: `3px dashed ${dragActive ? '#4CAF50' : '#666'}`,
            borderRadius: '15px',
            padding: '4rem 2rem',
            textAlign: 'center',
            background: dragActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('video-upload').click()}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {dragActive ? '🎯' : '🎬'}
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem', 
            color: dragActive ? '#4CAF50' : '#fff' 
          }}>
            {dragActive ? 'Drop Your Videos Here!' : 'Drag & Drop Videos Here'}
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '2rem', 
            color: '#ccc' 
          }}>
            or click to select video files from your computer
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: '#4CAF50', 
            fontWeight: 'bold' 
          }}>
            📁 Supports: MP4, MOV, AVI, WMV, FLV, WEBM<br />
            💾 Max Size: 1GB per video
          </p>
          
          <input
            type="file"
            id="video-upload"
            multiple
            accept="video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <button
            style={{
              marginTop: '1rem',
              padding: '1rem 2rem',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#45a049'}
            onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
          >
            📂 Choose Video Files
          </button>
        </div>

        {/* Video Queue */}
        {videos.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#fff' }}>
                🎥 Video Queue ({videos.length} videos)
              </h3>
              {videos.some(v => v.status === 'ready') && (
                <button
                  onClick={uploadAll}
                  disabled={uploading}
                  style={{
                    padding: '1rem 2rem',
                    background: uploading ? '#666' : '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {uploading ? '⏳ Uploading...' : '🚀 Upload All Videos'}
                </button>
              )}
            </div>

            {videos.map(video => (
              <div
                key={video.id}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  border: video.status === 'error' ? '2px solid #f44336' : 
                         video.status === 'success' ? '2px solid #4CAF50' : 
                         video.status === 'uploading' ? '2px solid #ff9800' : '2px solid #666'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr auto auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  
                  {/* File Info */}
                  <div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      color: '#fff'
                    }}>
                      🎬 {video.file.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                      📊 Size: {formatFileSize(video.file.size)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                      📂 Category: {videoCategories.find(c => c.value === video.category)?.label}
                    </div>
                  </div>

                  {/* Edit Fields */}
                  <div>
                    <input
                      type="text"
                      placeholder="Video title..."
                      value={video.title}
                      onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #666',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                    <textarea
                      placeholder="Video description..."
                      value={video.description}
                      onChange={(e) => updateVideo(video.id, 'description', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #666',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    {video.status === 'ready' && <span style={{ color: '#ccc' }}>📋 Ready</span>}
                    {video.status === 'uploading' && (
                      <div style={{ color: '#ff9800' }}>
                        <div style={{
                          width: '30px',
                          height: '30px',
                          border: '3px solid #333',
                          borderTop: '3px solid #ff9800',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 0.5rem'
                        }}></div>
                        Uploading...
                      </div>
                    )}
                    {video.status === 'success' && <span style={{ color: '#4CAF50' }}>✅ Success!</span>}
                    {video.status === 'error' && (
                      <div style={{ color: '#f44336' }}>
                        <div>❌ Failed</div>
                        {video.error && (
                          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            {video.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeVideo(video.id)}
                    style={{
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            
            {videos.some(v => v.status === 'success') && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                padding: '1.5rem',
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>
                  🎉 Videos Uploaded Successfully!
                </h4>
                <p style={{ color: '#fff', margin: 0 }}>
                  Your videos will appear on your portfolio immediately.<br />
                  Visit <a href="/" style={{ color: '#4CAF50' }}>your main portfolio</a> to see them!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>
            📋 How to Upload Your Melrose Heights TV Videos:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: '#4CAF50', marginBottom: '1rem' }}>
                🎬 Step 1: Select Category
              </h4>
              <ul style={{ color: '#ccc', lineHeight: '1.6' }}>
                <li>📺 TV Show Episodes</li>
                <li>🎤 Celebrity Interviews</li>
                <li>🎬 Behind the Scenes</li>
                <li>📸 Photography Workshops</li>
                <li>🏢 Melrose Heights Content</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#4CAF50', marginBottom: '1rem' }}>
                📁 Step 2: Add Videos
              </h4>
              <ul style={{ color: '#ccc', lineHeight: '1.6' }}>
                <li>Drag & drop video files</li>
                <li>Or click "Choose Video Files"</li>
                <li>Up to 1GB per video</li>
                <li>Multiple videos at once</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#4CAF50', marginBottom: '1rem' }}>
                ✏️ Step 3: Edit & Upload
              </h4>
              <ul style={{ color: '#ccc', lineHeight: '1.6' }}>
                <li>Add video titles</li>
                <li>Write descriptions</li>
                <li>Click "Upload All"</li>
                <li>Watch real-time progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VideoUpload;