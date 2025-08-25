import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={`nav-portfolio ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-portfolio">
        <div className="nav-content">
          <a href="#home" className="nav-logo" onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}>
            Curtis Williams
          </a>
          
          <ul className="nav-links">
            <li>
              <a 
                href="#about" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('skills');
                }}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#experience" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('experience');
                }}
              >
                Experience
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('projects');
                }}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a 
                href="#book" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('book');
                }}
              >
                Book
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;