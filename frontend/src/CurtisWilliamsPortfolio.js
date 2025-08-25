import React, { useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import { mockData } from './mock';
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter, Facebook } from 'lucide-react';
import './styles/curtis-portfolio.css';

const CurtisWilliamsPortfolio = () => {
  
  useEffect(() => {
    // Animate elements on scroll
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
  }, []);

  return (
    <div className="portfolio-app">
      <Navigation />
      <HeroSection />

      {/* About Section */}
      <section id="about" className="section-spacing">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title">About Me</h2>
          </div>
          
          <div className="grid-2-col">
            <div className="animate-on-scroll">
              <div className="body-text">
                {mockData.personal.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1.5rem' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <div style={{ padding: '2rem', background: 'var(--color-gray-100)', borderRadius: '8px' }}>
                <h3 className="subsection-title">Awards & Recognition</h3>
                {mockData.awards.map((award, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-primary)'
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-spacing" style={{ background: 'var(--color-gray-100)' }}>
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title">Skills & Expertise</h2>
          </div>
          
          <div className="skills-grid">
            {mockData.skills.map((skill, index) => (
              <div key={index} className="skill-item animate-on-scroll">
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

      {/* Experience Section */}
      <section id="experience" className="section-spacing">
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title">Professional Experience</h2>
          </div>
          
          <div style={{ maxWidth: '800px' }}>
            {mockData.experience.map((exp, index) => (
              <div key={index} className="experience-item animate-on-scroll">
                <div className="experience-header">
                  <h3 className="experience-title">{exp.title}</h3>
                  <p className="experience-company">{exp.company} • {exp.location}</p>
                  <p className="experience-period">{exp.period} • {exp.type}</p>
                </div>
                
                <div className="body-text" style={{ marginBottom: '1rem' }}>
                  {exp.description}
                </div>
                
                <ul className="experience-highlights">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-spacing" style={{ background: 'var(--color-gray-100)' }}>
        <div className="container-portfolio">
          <div className="animate-on-scroll">
            <h2 className="section-title">Featured Projects</h2>
          </div>
          
          <div className="grid-3-col">
            {mockData.projects.map((project, index) => (
              <div key={index} className="project-card animate-on-scroll">
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
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
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
              <p className="body-text" style={{ color: 'var(--color-gray-300)', fontSize: '1.125rem' }}>
                Ready to bring your vision to life? With over five decades of experience in fashion, 
                fine art, and commercial photography, I'm here to capture the extraordinary in every frame.
              </p>
            </div>
            
            <div className="animate-on-scroll">
              <div className="contact-info">
                <div className="contact-item">
                  <Mail />
                  <a href={`mailto:${mockData.personal.email}`} className="contact-link">
                    {mockData.personal.email}
                  </a>
                </div>
                
                <div className="contact-item">
                  <Phone />
                  <a href={`tel:${mockData.personal.phone}`} className="contact-link">
                    {mockData.personal.phone}
                  </a>
                </div>
                
                <div className="contact-item">
                  <MapPin />
                  <span>{mockData.personal.location}</span>
                </div>
                
                <div className="contact-item">
                  <Globe />
                  <a href={`https://${mockData.social.website}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                    {mockData.social.website}
                  </a>
                </div>
                
                <div className="contact-item">
                  <Linkedin />
                  <a href={`https://${mockData.social.linkedin}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
                
                <div className="contact-item" style={{ marginTop: '2rem' }}>
                  <h4 style={{ 
                    color: 'var(--color-white)', 
                    margin: '0 0 1rem 0',
                    fontFamily: 'var(--font-serif)'
                  }}>
                    Also Find Me At:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href={`https://${mockData.social.magazine}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                      Melrose Heights Magazine
                    </a>
                    <a href={mockData.social.facebook} className="contact-link" target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                    <a href={`https://twitter.com/${mockData.social.twitter.replace('@', '')}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                      Twitter {mockData.social.twitter}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-portfolio">
        <div className="container-portfolio">
          <p className="caption-text" style={{ color: 'var(--color-gray-300)', margin: 0 }}>
            © 2025 Curtis Williams Photography. All rights reserved. | 
            Master of Light & Shadow | Five Decades of Artistic Excellence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CurtisWilliamsPortfolio;