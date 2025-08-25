import React, { useEffect, useState } from 'react';
import { mockData } from '../mock';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="hero-background"></div>
      <div className="container-portfolio">
        <div className={`hero-content ${isVisible ? 'fade-in-up' : ''}`}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ 
              fontSize: '1.2rem',
              fontWeight: '300',
              color: 'var(--color-gray-600)',
              margin: '0',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              {mockData.personal.tagline}
            </p>
          </div>
          
          <h1 className="hero-title">
            {mockData.personal.name}
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
            {mockData.personal.title}
          </p>
          
          <p className="hero-subtitle" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
            {mockData.personal.subtitle}
          </p>
          
          <div style={{ 
            marginTop: '3rem', 
            padding: '2rem 0',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <p className="quote-text">
              {mockData.personal.quote}
            </p>
          </div>

          <div style={{ 
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button 
              className="cta-button primary"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '1rem 2rem',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              View Portfolio
            </button>
            
            <button 
              className="cta-button secondary"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '1rem 2rem',
                background: 'transparent',
                color: 'var(--color-primary)',
                border: '2px solid var(--color-primary)',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--color-primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--color-primary)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;