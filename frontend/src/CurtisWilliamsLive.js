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