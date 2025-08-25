import React from 'react';
import { Play, Film, Video } from 'lucide-react';

const VideoGallery = ({ section, videos, color, description }) => {
  const getColorClass = (color) => {
    switch(color) {
      case 'red': return 'section-title-red';
      case 'green': return 'section-title-green';
      case 'brown': return 'section-title-brown';
      default: return '';
    }
  };

  const getSectionClass = (color) => {
    switch(color) {
      case 'red': return 'section-red';
      case 'green': return 'section-green';
      case 'brown': return 'section-brown';
      default: return 'section-black';
    }
  };

  const getAccentColor = (color) => {
    switch(color) {
      case 'red': return 'var(--color-red-light)';
      case 'green': return 'var(--color-green-light)';
      case 'brown': return 'var(--color-brown-light)';
      default: return 'var(--color-white)';
    }
  };

  return (
    <section className={`section-spacing ${getSectionClass(color)}`}>
      <div className="container-portfolio">
        <div className="animate-on-scroll">
          <h2 className={`section-title ${getColorClass(color)}`}>
            {section}
          </h2>
          {description && (
            <p className="body-text" style={{ 
              textAlign: 'center', 
              maxWidth: '800px', 
              margin: '0 auto 3rem auto',
              fontSize: '1.125rem'
            }}>
              {description}
            </p>
          )}
        </div>
        
        <div className="portfolio-gallery">
          {videos.map((video, index) => (
            <div key={index} className="video-card animate-on-scroll">
              <div className="video-placeholder">
                <div className="video-icon-container">
                  <Video size={48} color={getAccentColor(color)} />
                  <Play size={24} color="white" style={{ marginLeft: '4px' }} />
                </div>
                <div className="video-overlay">
                  <p style={{ color: 'white', fontSize: '0.875rem', opacity: 0.8 }}>
                    Video content will be available when backend is complete
                  </p>
                </div>
              </div>
              <div className="video-content">
                <h3 className="video-title" style={{ color: getAccentColor(color) }}>
                  {video.title}
                </h3>
                <p className="caption-text">
                  {video.description}
                </p>
                <div className="video-tag" style={{ 
                  background: `rgba(${color === 'red' ? '239, 68, 68' : color === 'green' ? '16, 185, 129' : '217, 119, 6'}, 0.2)`,
                  borderColor: getAccentColor(color),
                  color: getAccentColor(color)
                }}>
                  <Film size={14} style={{ marginRight: '0.5rem' }} />
                  Melrose Heights TV
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="animate-on-scroll" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h3 style={{ 
              color: getAccentColor(color), 
              marginBottom: '1rem',
              fontFamily: 'var(--font-serif)'
            }}>
              Ready to Add Your Videos?
            </h3>
            <p className="body-text" style={{ marginBottom: '1.5rem' }}>
              Once the backend is complete, you'll be able to upload and manage all your 
              Melrose Heights Magazine & TV content, including:
            </p>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              color: 'var(--color-gray-300)',
              textAlign: 'left',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>• TV Show Episodes</li>
              <li style={{ marginBottom: '0.5rem' }}>• Behind-the-scenes Content</li>
              <li style={{ marginBottom: '0.5rem' }}>• Fashion Photography Videos</li>
              <li style={{ marginBottom: '0.5rem' }}>• Celebrity Interviews</li>
              <li style={{ marginBottom: '0.5rem' }}>• Art Direction Process</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;