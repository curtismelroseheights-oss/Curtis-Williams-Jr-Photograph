import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import PortfolioGallery from './components/PortfolioGallery';
import VideoGallery from './components/VideoGallery';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Facebook } from 'lucide-react';
import './styles/curtis-enhanced.css';
import './styles/video-gallery.css';

// Import API functions
import {
  personalApi, socialApi, skillsApi, experienceApi, 
  projectsApi, imagesApi, videosApi, awardsApi, handleApiError
} from './api/portfolioApi';

const CurtisWilliamsLive = () => {
  // State management for all data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({});
  const [socialLinks, setSocialLinks] = useState({});
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [awards, setAwards] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState({
    fashion: [],
    covers: [],
    stillLife: [],
    artPhotoPainting: [],
    editorial: []
  });
  const [videos, setVideos] = useState([]);

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        personalData,
        socialData,
        skillsData,
        experienceData,
        projectsData,
        awardsData,
        fashionImages,
        coversImages,
        stillLifeImages,
        artPhotoImages,
        editorialImages,
        videosData
      ] = await Promise.all([
        personalApi.get().catch(() => ({})),
        socialApi.get().catch(() => ({})),
        skillsApi.getAll().catch(() => []),
        experienceApi.getAll().catch(() => []),
        projectsApi.getAll().catch(() => []),
        awardsApi.getAll().catch(() => []),
        imagesApi.getAll('fashion').catch(() => []),
        imagesApi.getAll('covers').catch(() => []),
        imagesApi.getAll('stillLife').catch(() => []),
        imagesApi.getAll('artPhotoPainting').catch(() => []),
        imagesApi.getAll('editorial').catch(() => []),
        videosApi.getAll().catch(() => [])
      ]);

      // Set state with loaded data
      setPersonalInfo(personalData);
      setSocialLinks(socialData);
      setSkills(skillsData);
      setExperience(experienceData);
      setProjects(projectsData);
      setAwards(awardsData);
      setPortfolioImages({
        fashion: fashionImages,
        covers: coversImages,
        stillLife: stillLifeImages,
        artPhotoPainting: artPhotoImages,
        editorial: editorialImages
      });
      setVideos(videosData);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Animate elements on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillLevel = entry.target.dataset.level;
          entry.target.style.width = `${skillLevel}%`;
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    return () => {
      observer.disconnect();
      skillObserver.disconnect();
    };
  }, [skills]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-black)',
        color: 'var(--color-white)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--color-gray-600)',
            borderTop: '3px solid var(--color-white)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ fontSize: '1.2rem' }}>Loading Curtis Williams Jr. Portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-black)',
        color: 'var(--color-white)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ color: 'var(--color-red-light)', marginBottom: '1rem' }}>
            Error Loading Portfolio
          </h2>
          <p style={{ marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={loadAllData}
            style={{
              padding: '1rem 2rem',
              background: 'var(--color-white)',
              color: 'var(--color-black)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-app">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background"></div>
        <div className="container-portfolio">
          <div className="hero-content fade-in-up">
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ 
                fontSize: '1.2rem',
                fontWeight: '300',
                color: 'var(--color-gray-600)',
                margin: '0',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                {personalInfo.tagline || 'LET IT BE AMAZING'}
              </p>
            </div>
            
            <h1 className="hero-title">
              {personalInfo.name || 'Curtis Williams Jr.'}
            </h1>
            
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: '400',
              color: 'var(--color-gray-700)',
              margin: '1rem 0 0 0',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              {personalInfo.title || 'FOTOGRAF'}
            </p>
            
            <p className="hero-subtitle" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              {personalInfo.subtitle || 'Advertising Photographer, Film Producer & Director'}
            </p>
            
            <div style={{ 
              marginTop: '3rem', 
              padding: '2rem 0',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <p className="quote-text">
                {personalInfo.quote || 'Light is the essence of life, and through my lens, I capture the soul that lives within every frame.'}
              </p>
            </div>

            <div style={{ 
              marginTop: '2rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, var(--color-red), var(--color-red-dark))',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
                }}
              >
                View Portfolio
              </button>
              
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  color: 'var(--color-white)',
                  border: '2px solid var(--color-white)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-spacing section-black">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title">About Me</h2>
          </div>
          
          <div className="contact-grid">
            <div className="animate-on-scroll">
              <div className="body-text">
                {personalInfo.bio ? personalInfo.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1.5rem' }}>
                    {paragraph}
                  </p>
                )) : (
                  <p>Loading biography...</p>
                )}
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <div style={{ 
                padding: '2rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 className="subsection-title">Awards & Recognition</h3>
                {awards.length > 0 ? awards.map((award, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-white)'
                    }}>
                      {award.title}
                    </h4>
                    <p className="caption-text" style={{ margin: '0 0 0.5rem 0' }}>
                      {award.organization} • {award.year}
                    </p>
                    <p className="caption-text" style={{ margin: 0 }}>
                      {award.description}
                    </p>
                  </div>
                )) : (
                  <p className="caption-text">Loading awards...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-spacing section-red">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title section-title-red">Skills & Expertise</h2>
          </div>
          
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={skill.id || index} className="skill-item animate-on-scroll">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-years">{skill.years}</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    data-level={skill.level}
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Galleries - Show all categories */}
      {portfolioImages.fashion.length > 0 && (
        <PortfolioGallery 
          section="Fashion Photography"
          images={portfolioImages.fashion.map(img => ({ 
            url: `${process.env.REACT_APP_BACKEND_URL}${img.image_url}`, 
            title: img.title 
          }))}
          color="red"
        />
      )}

      {portfolioImages.covers.length > 0 && (
        <PortfolioGallery 
          section="Magazine Covers"
          images={portfolioImages.covers.map(img => ({ 
            url: `${process.env.REACT_APP_BACKEND_URL}${img.image_url}`, 
            title: img.title 
          }))}
          color="green"
        />
      )}

      {portfolioImages.stillLife.length > 0 && (
        <PortfolioGallery 
          section="Still Life Photography"
          images={portfolioImages.stillLife.map(img => ({ 
            url: `${process.env.REACT_APP_BACKEND_URL}${img.image_url}`, 
            title: img.title 
          }))}
          color="brown"
        />
      )}

      {portfolioImages.artPhotoPainting.length > 0 && (
        <PortfolioGallery 
          section="Art Photo Painting"
          images={portfolioImages.artPhotoPainting.map(img => ({ 
            url: `${process.env.REACT_APP_BACKEND_URL}${img.image_url}`, 
            title: img.title 
          }))}
          color="red"
        />
      )}

      {portfolioImages.editorial.length > 0 && (
        <PortfolioGallery 
          section="Editorial Photography"
          images={portfolioImages.editorial.map(img => ({ 
            url: `${process.env.REACT_APP_BACKEND_URL}${img.image_url}`, 
            title: img.title 
          }))}
          color="green"
        />
      )}

      {/* Melrose Heights Magazine & TV Video Section */}
      <section className="section-spacing section-red">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title section-title-red">Melrose Heights Magazine & TV</h2>
            <p className="body-text" style={{ 
              textAlign: 'center', 
              maxWidth: '800px', 
              margin: '0 auto 3rem auto',
              fontSize: '1.125rem'
            }}>
              Television production work, interviews, and behind-the-scenes content from Curtis Williams Jr.'s 
              Melrose Heights Magazine & TV show. Experience the creative process of a legendary photographer 
              turned producer and director.
            </p>
          </div>
          
          <div className="portfolio-gallery">
            {/* Video placeholders - will be populated when you upload actual videos */}
            {[
              {
                title: "Melrose Heights TV Show - Fashion Episode",
                description: "Curtis Williams Jr. directing a high-fashion photo shoot with behind-the-scenes insights"
              },
              {
                title: "Celebrity Interview Series",
                description: "Exclusive interviews with fashion and entertainment personalities by Curtis Williams Jr."
              },
              {
                title: "Art Direction Master Class",
                description: "Curtis Williams Jr. demonstrates his legendary art direction techniques"
              },
              {
                title: "Photography Workshop",
                description: "Learn from 50+ years of experience with Curtis Williams Jr.'s photography masterclass"
              },
              {
                title: "Melrose Heights Magazine Production",
                description: "Behind-the-scenes look at Curtis Williams Jr.'s magazine production process"
              },
              {
                title: "Darkroom Techniques Revealed",
                description: "Curtis Williams Jr. shares his revolutionary darkroom techniques compared to 17th-century masters"
              }
            ].map((video, index) => (
              <div key={index} className="video-card animate-on-scroll">
                <div className="video-placeholder">
                  <div className="video-icon-container">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(220, 38, 38, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--color-red-light)'
                    }}>
                      <span style={{ fontSize: '2rem' }}>▶</span>
                    </div>
                  </div>
                  <div className="video-overlay">
                    <p style={{ color: 'white', fontSize: '0.875rem', opacity: 0.9 }}>
                      Ready for your video uploads from Melroseheightsmagazinetv.com
                    </p>
                  </div>
                </div>
                <div className="video-content">
                  <h3 className="video-title" style={{ color: 'var(--color-red-light)' }}>
                    {video.title}
                  </h3>
                  <p className="caption-text">
                    {video.description}
                  </p>
                  <div className="video-tag" style={{ 
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'var(--color-red-light)',
                    color: 'var(--color-red-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid',
                    marginTop: '1rem'
                  }}>
                    🎬 Melrose Heights TV
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
                color: 'var(--color-red-light)', 
                marginBottom: '1rem',
                fontFamily: 'var(--font-serif)'
              }}>
                Upload Your Melrose Heights TV Content!
              </h3>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Curtis Williams Jr.'s complete video management system is ready for all your 
                Melroseheightsmagazinetv.com content including:
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                color: 'var(--color-gray-300)',
                textAlign: 'left',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <li style={{ marginBottom: '0.5rem' }}>📺 TV Show Episodes</li>
                <li style={{ marginBottom: '0.5rem' }}>🎤 Celebrity Interviews</li>
                <li style={{ marginBottom: '0.5rem' }}>📸 Photography Workshops</li>
                <li style={{ marginBottom: '0.5rem' }}>🎬 Behind-the-scenes Content</li>
                <li style={{ marginBottom: '0.5rem' }}>🎨 Art Direction Tutorials</li>
                <li style={{ marginBottom: '0.5rem' }}>📰 Magazine Production</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section id="projects" className="section-spacing section-green">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title section-title-green">Featured Projects</h2>
          </div>
          
          <div className="portfolio-gallery">
            {projects.map((project, index) => (
              <div key={project.id || index} className="project-card animate-on-scroll">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="project-image"
                />
                <div className="project-content">
                  <div className="project-meta">
                    <span className="project-category">{project.category}</span>
                    <span className="project-year">{project.year}</span>
                  </div>
                  
                  <h3 className="project-title">{project.title}</h3>
                  <p className="caption-text">{project.description}</p>
                  
                  <div className="project-tags">
                    {project.tags?.map((tag, i) => (
                      <span key={i} className="project-tag project-tag-green">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Admin Section - Direct Access */}
      <section id="upload" className="section-spacing section-black" style={{
        borderTop: '3px solid var(--color-red)',
        background: 'linear-gradient(135deg, #1a0000 0%, var(--color-black) 50%, #1a0000 100%)'
      }}>
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title" style={{ color: 'var(--color-red-light)' }}>
              🎯 Upload Your Content Here
            </h2>
            <p className="body-text" style={{ 
              textAlign: 'center', 
              maxWidth: '800px', 
              margin: '0 auto 3rem auto',
              fontSize: '1.125rem'
            }}>
              Curtis Williams Jr.'s easy upload system - Add your photos and videos directly to your portfolio
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            border: '2px solid var(--color-red)'
          }}>
            <h3 style={{ color: 'var(--color-white)', marginBottom: '2rem', fontSize: '2rem' }}>
              📱 Three Easy Ways to Upload Your Content:
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              
              {/* Method 1: Backend API */}
              <div style={{
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid var(--color-red)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: 'var(--color-red-light)', marginBottom: '1rem' }}>
                  🔧 Method 1: Backend API Upload
                </h4>
                <p style={{ color: 'var(--color-gray-300)', marginBottom: '1rem' }}>
                  Use curl commands to upload directly to your backend API:
                </p>
                <div style={{
                  background: '#000',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}># Upload a photo:</div>
                  <div>curl -X POST -F "file=@photo.jpg" \\</div>
                  <div>  -F "title=My Photo" \\</div>
                  <div>  -F "category=fashion" \\</div>
                  <div>  -F "description=Amazing shot" \\</div>
                  <div>  http://localhost:8001/api/images/upload</div>
                </div>
              </div>

              {/* Method 2: File Manager */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid var(--color-green)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: 'var(--color-green-light)', marginBottom: '1rem' }}>
                  📁 Method 2: Direct File Upload
                </h4>
                <p style={{ color: 'var(--color-gray-300)', marginBottom: '1rem' }}>
                  Upload files directly to the server uploads folder:
                </p>
                <div style={{
                  background: '#000',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}>
                  <div># Upload to server folder:</div>
                  <div>/app/backend/uploads/images/</div>
                  <div>  /fashion/</div>
                  <div>  /covers/</div>
                  <div>  /stillLife/</div>
                  <div>  /artPhotoPainting/</div>
                  <div>  /editorial/</div>
                </div>
              </div>

              {/* Method 3: Database Entry */}
              <div style={{
                background: 'rgba(217, 119, 6, 0.2)',
                border: '2px solid var(--color-brown)',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <h4 style={{ color: 'var(--color-brown-light)', marginBottom: '1rem' }}>
                  💾 Method 3: Database Entry
                </h4>
                <p style={{ color: 'var(--color-gray-300)', marginBottom: '1rem' }}>
                  Add entries directly to your MongoDB database:
                </p>
                <div style={{
                  background: '#000',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}>
                  <div># MongoDB collections:</div>
                  <div>portfolio_images</div>
                  <div>videos</div>
                  <div>projects</div>
                  <div>experience</div>
                  <div>skills</div>
                </div>
              </div>
            </div>

            {/* Simple File Upload Form */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
                📤 Quick Upload (JavaScript)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <select 
                  id="upload-category"
                  style={{
                    padding: '1rem',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #666',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="fashion">Fashion Photography</option>
                  <option value="covers">Magazine Covers</option>
                  <option value="stillLife">Still Life Photography</option>
                  <option value="artPhotoPainting">Art Photo Painting</option>
                  <option value="editorial">Editorial Photography</option>
                </select>
                
                <input
                  type="file"
                  id="upload-file"
                  multiple
                  accept="image/*"
                  style={{
                    padding: '1rem',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #666',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <button
                onClick={() => {
                  const fileInput = document.getElementById('upload-file');
                  const category = document.getElementById('upload-category').value;
                  const files = fileInput.files;
                  
                  if (files.length === 0) {
                    alert('Please select files to upload');
                    return;
                  }
                  
                  Array.from(files).forEach(async (file, index) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('title', file.name.split('.')[0]);
                    formData.append('description', `Curtis Williams Jr.'s ${category} photography`);
                    formData.append('category', category);
                    formData.append('featured', 'false');
                    
                    try {
                      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/images/upload`, {
                        method: 'POST',
                        body: formData
                      });
                      
                      if (response.ok) {
                        alert(`✅ Successfully uploaded: ${file.name}`);
                      } else {
                        alert(`❌ Failed to upload: ${file.name}`);
                      }
                    } catch (error) {
                      alert(`❌ Error uploading ${file.name}: ${error.message}`);
                    }
                  });
                  
                  // Clear the input
                  fileInput.value = '';
                }}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--color-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                🚀 Upload Selected Files
              </button>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid var(--color-green)',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h4 style={{ color: 'var(--color-green-light)', marginBottom: '0.5rem' }}>
                ✅ Upload Status
              </h4>
              <p style={{ color: 'var(--color-gray-300)', margin: 0 }}>
                Your backend API is running at: <strong>{process.env.REACT_APP_BACKEND_URL || 'Backend URL'}</strong><br />
                Files uploaded here will appear immediately in your portfolio galleries above!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section section-spacing">
        <div className="container-portfolio">
          <div className="contact-grid">
            <div className="animate-on-scroll">
              <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
                Let's Create Together
              </h2>
              <p className="body-text" style={{ fontSize: '1.125rem' }}>
                Ready to bring your vision to life? With over five decades of experience in fashion, 
                fine art, and commercial photography, I'm here to capture the extraordinary in every frame.
              </p>
            </div>
            
            <div className="animate-on-scroll">
              <div className="contact-info">
                <div className="contact-item">
                  <Mail />
                  <a href={`mailto:${personalInfo.email || 'melroseheights@me.com'}`} className="contact-link">
                    {personalInfo.email || 'melroseheights@me.com'}
                  </a>
                </div>
                
                <div className="contact-item">
                  <Phone />
                  <a href={`tel:${personalInfo.phone || '310-880-2341'}`} className="contact-link">
                    {personalInfo.phone || '310-880-2341'}
                  </a>
                </div>
                
                <div className="contact-item">
                  <MapPin />
                  <span>{personalInfo.location || 'Los Angeles, CA'}</span>
                </div>
                
                <div className="contact-item">
                  <Globe />
                  <a href={`https://${socialLinks.website || 'curtiswilliamsphotograph.com'}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                    {socialLinks.website || 'curtiswilliamsphotograph.com'}
                  </a>
                </div>
                
                <div className="contact-item">
                  <Linkedin />
                  <a href={socialLinks.linkedin || '#'} className="contact-link" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-portfolio">
        <div className="container-portfolio">
          <p className="caption-text" style={{ color: 'var(--color-gray-400)', margin: 0 }}>
            © 2025 Curtis Williams Jr. Photography. All rights reserved. | 
            Master of Light & Shadow | Five Decades of Artistic Excellence
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CurtisWilliamsLive;