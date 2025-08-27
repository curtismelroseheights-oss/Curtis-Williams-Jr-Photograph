import React, { useState } from 'react';
import { imagesApi, videosApi, handleApiError } from '../api/portfolioApi';

const WorkingAdmin = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Categories
  const photoCategories = [
    { value: 'fashion', label: 'Fashion Photography' },
    { value: 'covers', label: 'Magazine Covers' },
    { value: 'stillLife', label: 'Still Life Photography' },
    { value: 'artPhotoPainting', label: 'Art Photo Painting' },
    { value: 'editorial', label: 'Editorial Photography' }
  ];

  const videoCategories = [
    { value: 'tv-show', label: 'TV Show Episodes' },
    { value: 'interview', label: 'Celebrity Interviews' },
    { value: 'behind-scenes', label: 'Behind the Scenes' },
    { value: 'workshop', label: 'Photography Workshops' },
    { value: 'art-direction', label: 'Art Direction Process' }
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newUploads = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      title: file.name.split('.')[0].replace(/[_-]/g, ' '),
      description: `Curtis Williams Jr.'s ${activeTab === 'photos' ? 'photography' : 'video'} work`,
      status: 'ready'
    }));
    setUploads([...uploads, ...newUploads]);
  };

  const updateUpload = (id, field, value) => {
    setUploads(uploads.map(upload => 
      upload.id === id ? { ...upload, [field]: value } : upload
    ));
  };

  const removeUpload = (id) => {
    setUploads(uploads.filter(upload => upload.id !== id));
  };

  const uploadAll = async () => {
    setUploading(true);
    
    for (const upload of uploads) {
      if (upload.status === 'ready') {
        try {
          updateUpload(upload.id, 'status', 'uploading');
          
          if (activeTab === 'photos') {
            await imagesApi.upload(
              upload.file,
              upload.title,
              upload.description,
              selectedCategory,
              false
            );
          } else {
            await videosApi.upload(
              upload.file,
              upload.title,
              upload.description,
              selectedCategory,
              false
            );
          }
          
          updateUpload(upload.id, 'status', 'success');
        } catch (error) {
          updateUpload(upload.id, 'status', 'error');
          console.error('Upload failed:', error);
        }
      }
    }
    
    setUploading(false);
  };

  const currentCategories = activeTab === 'photos' ? photoCategories : videoCategories;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#fff'
        }}>
          Curtis Williams Jr. - Upload Center
        </h1>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('photos')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'photos' ? '#dc2626' : 'transparent',
              color: '#fff',
              border: '2px solid #dc2626',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            📸 Upload Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'videos' ? '#059669' : 'transparent',
              color: '#fff',
              border: '2px solid #059669',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            🎬 Upload Videos
          </button>
        </div>

        {/* Category Selection */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>
            Select Category for {activeTab === 'photos' ? 'Photos' : 'Videos'}:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {currentCategories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedCategory === category.value ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: selectedCategory === category.value ? '#000' : '#fff',
                  border: '1px solid #fff',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div style={{
          border: '2px dashed #666',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>
            📁 Choose {activeTab === 'photos' ? 'Photos' : 'Videos'} to Upload
          </h3>
          <input
            type="file"
            multiple
            accept={activeTab === 'photos' ? 'image/*' : 'video/*'}
            onChange={handleFileSelect}
            style={{
              display: 'block',
              margin: '0 auto',
              padding: '1rem',
              fontSize: '1rem',
              background: '#333',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <p style={{ marginTop: '1rem', color: '#ccc' }}>
            Selected category: <strong>{currentCategories.find(c => c.value === selectedCategory)?.label}</strong>
          </p>
        </div>

        {/* Upload Queue */}
        {uploads.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3>Upload Queue ({uploads.length} files)</h3>
              <button
                onClick={uploadAll}
                disabled={uploading}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                {uploading ? '⏳ Uploading...' : '🚀 Upload All'}
              </button>
            </div>

            {uploads.map(upload => (
              <div
                key={upload.id}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: upload.status === 'error' ? '1px solid #dc2626' : 
                         upload.status === 'success' ? '1px solid #059669' : '1px solid #666'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{upload.file.name}</strong>
                    <br />
                    <small>{(upload.file.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Title..."
                      value={upload.title}
                      onChange={(e) => updateUpload(upload.id, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '0.5rem',
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #666',
                        borderRadius: '4px'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description..."
                      value={upload.description}
                      onChange={(e) => updateUpload(upload.id, 'description', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #666',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {upload.status === 'ready' && <span style={{ color: '#ccc' }}>Ready ✓</span>}
                    {upload.status === 'uploading' && <span style={{ color: '#059669' }}>Uploading...</span>}
                    {upload.status === 'success' && <span style={{ color: '#059669' }}>Success! ✅</span>}
                    {upload.status === 'error' && <span style={{ color: '#dc2626' }}>Failed ❌</span>}
                  </div>

                  <button
                    onClick={() => removeUpload(upload.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 How to Use:</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                📸 For Photos:
              </h4>
              <ol style={{ color: '#ccc' }}>
                <li>Click "Upload Photos" tab</li>
                <li>Select category (Fashion, Covers, etc.)</li>
                <li>Choose photo files from your computer</li>
                <li>Edit titles and descriptions</li>
                <li>Click "Upload All" to publish</li>
              </ol>
            </div>
            <div>
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🎬 For Videos:
              </h4>
              <ol style={{ color: '#ccc' }}>
                <li>Click "Upload Videos" tab</li>
                <li>Select category (TV Shows, Interviews, etc.)</li>
                <li>Choose video files from your computer</li>
                <li>Add episode titles and descriptions</li>
                <li>Click "Upload All" to publish</li>
              </ol>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'rgba(5, 150, 105, 0.2)', 
            borderRadius: '6px',
            border: '1px solid #059669'
          }}>
            <p style={{ margin: 0, color: '#fff' }}>
              🎉 <strong>Your content will appear immediately on your portfolio!</strong><br />
              Visit <a href="/" style={{ color: '#059669' }}>your main portfolio</a> to see uploaded content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingAdmin;