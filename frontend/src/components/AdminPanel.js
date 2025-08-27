import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image, Video, Loader } from 'lucide-react';
import { imagesApi, videosApi, handleApiError } from '../api/portfolioApi';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('fashion');

  // Photo categories
  const photoCategories = [
    { value: 'fashion', label: 'Fashion Photography', color: 'red' },
    { value: 'covers', label: 'Magazine Covers', color: 'green' },
    { value: 'stillLife', label: 'Still Life Photography', color: 'brown' },
    { value: 'artPhotoPainting', label: 'Art Photo Painting', color: 'red' },
    { value: 'editorial', label: 'Editorial Photography', color: 'green' }
  ];

  // Video categories
  const videoCategories = [
    { value: 'tv-show', label: 'TV Show Episodes', color: 'red' },
    { value: 'interview', label: 'Celebrity Interviews', color: 'green' },
    { value: 'behind-scenes', label: 'Behind the Scenes', color: 'brown' },
    { value: 'workshop', label: 'Photography Workshops', color: 'red' },
    { value: 'art-direction', label: 'Art Direction Process', color: 'green' }
  ];

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process selected files
  const handleFiles = (files) => {
    const newUploads = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      title: file.name.split('.')[0],
      description: '',
      status: 'pending',
      progress: 0,
      category: selectedCategory
    }));

    setUploads(prev => [...prev, ...newUploads]);
  };

  // Upload single file
  const uploadFile = async (upload) => {
    try {
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'uploading', progress: 50 } : u
      ));

      let result;
      if (activeTab === 'photos') {
        result = await imagesApi.upload(
          upload.file,
          upload.title,
          upload.description,
          upload.category,
          false
        );
      } else {
        result = await videosApi.upload(
          upload.file,
          upload.title,
          upload.description,
          upload.category,
          false
        );
      }

      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'success', progress: 100, result } : u
      ));

      return result;
    } catch (error) {
      const errorMsg = handleApiError(error);
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'error', error: errorMsg } : u
      ));
      throw error;
    }
  };

  // Upload all pending files
  const uploadAll = async () => {
    const pendingUploads = uploads.filter(u => u.status === 'pending');
    
    for (const upload of pendingUploads) {
      try {
        await uploadFile(upload);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between uploads
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  // Remove upload
  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  // Update upload details
  const updateUpload = (id, field, value) => {
    setUploads(prev => prev.map(u => 
      u.id === id ? { ...u, [field]: value } : u
    ));
  };

  const currentCategories = activeTab === 'photos' ? photoCategories : videoCategories;
  const pendingCount = uploads.filter(u => u.status === 'pending').length;
  const successCount = uploads.filter(u => u.status === 'success').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-black)',
      color: 'var(--color-white)',
      padding: '2rem'
    }}>
      <div className="container-portfolio">
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '3rem',
          color: 'var(--color-white)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Curtis Williams Jr. - Content Manager
        </h1>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '3rem',
          gap: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('photos')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'photos' ? 'var(--color-red)' : 'transparent',
              color: 'white',
              border: `2px solid var(--color-red)`,
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Image size={20} />
            Upload Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'videos' ? 'var(--color-green)' : 'transparent',
              color: 'white',
              border: `2px solid var(--color-green)`,
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Video size={20} />
            Upload Videos
          </button>
        </div>

        {/* Category Selection */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-300)' }}>
            Select Category for {activeTab === 'photos' ? 'Photos' : 'Videos'}:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            {currentCategories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: selectedCategory === category.value ? 
                    `var(--color-${category.color})` : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: `1px solid var(--color-${category.color})`,
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div
          style={{
            border: `2px dashed ${dragActive ? 'var(--color-white)' : 'var(--color-gray-600)'}`,
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            background: dragActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            marginBottom: '2rem',
            transition: 'all 0.25s ease'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.7 }} />
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-white)' }}>
            Drag & Drop {activeTab === 'photos' ? 'Photos' : 'Videos'} Here
          </h3>
          <p style={{ marginBottom: '2rem', color: 'var(--color-gray-400)' }}>
            or click to select files from your computer
          </p>
          <input
            type="file"
            multiple
            accept={activeTab === 'photos' ? 'image/*' : 'video/*'}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: activeTab === 'photos' ? 'var(--color-red)' : 'var(--color-green)',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              fontWeight: '600'
            }}
          >
            Choose Files
          </label>
        </div>

        {/* Upload Queue */}
        {uploads.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: 'var(--color-white)' }}>
                Upload Queue ({uploads.length} files)
              </h3>
              {pendingCount > 0 && (
                <button
                  onClick={uploadAll}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--color-green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Upload size={16} />
                  Upload All ({pendingCount})
                </button>
              )}
            </div>

            {uploads.map(upload => (
              <div
                key={upload.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: upload.status === 'error' ? '1px solid var(--color-red)' : 
                         upload.status === 'success' ? '1px solid var(--color-green)' : 
                         '1px solid transparent'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600' }}>{upload.file.name}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
                      {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Enter title..."
                      value={upload.title}
                      onChange={(e) => updateUpload(upload.id, 'title', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--color-gray-600)',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        marginBottom: '0.5rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter description..."
                      value={upload.description}
                      onChange={(e) => updateUpload(upload.id, 'description', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid var(--color-gray-600)',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {upload.status === 'pending' && <span style={{ color: 'var(--color-gray-400)' }}>Ready</span>}
                    {upload.status === 'uploading' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-blue)' }}>
                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Uploading...
                      </div>
                    )}
                    {upload.status === 'success' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green)' }}>
                        <CheckCircle size={16} />
                        Success!
                      </div>
                    )}
                    {upload.status === 'error' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-red)' }}>
                        <AlertCircle size={16} />
                        Failed
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeUpload(upload.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-gray-400)',
                      cursor: 'pointer',
                      padding: '0.5rem'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {upload.status === 'error' && (
                  <p style={{ color: 'var(--color-red)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Error: {upload.error}
                  </p>
                )}
              </div>
            ))}

            {successCount > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--color-green)',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: 'var(--color-green)', fontWeight: '600' }}>
                  🎉 {successCount} file(s) uploaded successfully! 
                  They will appear on your portfolio immediately.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
            How to Use This Upload System:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: 'var(--color-red)', marginBottom: '0.5rem' }}>
                📸 For Photos:
              </h4>
              <ul style={{ color: 'var(--color-gray-300)', paddingLeft: '1rem' }}>
                <li>Select category (Fashion, Covers, Still Life, etc.)</li>
                <li>Drag photos or click "Choose Files"</li>
                <li>Add titles and descriptions</li>
                <li>Click "Upload All" to publish</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-green)', marginBottom: '0.5rem' }}>
                🎬 For Videos:
              </h4>
              <ul style={{ color: 'var(--color-gray-300)', paddingLeft: '1rem' }}>
                <li>Select category (TV Shows, Interviews, etc.)</li>
                <li>Upload your Melrose Heights TV content</li>
                <li>Add episode titles and descriptions</li>
                <li>Videos will appear in your portfolio</li>
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

export default AdminPanel;