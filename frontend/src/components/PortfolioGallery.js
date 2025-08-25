import React from 'react';

const PortfolioGallery = ({ section, images, color }) => {
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

  return (
    <section className={`section-spacing ${getSectionClass(color)}`}>
      <div className="container-portfolio">
        <div className="animate-on-scroll">
          <h2 className={`section-title ${getColorClass(color)}`}>
            {section}
          </h2>
        </div>
        
        <div className="portfolio-gallery">
          {images.map((image, index) => (
            <div key={index} className="gallery-item animate-on-scroll">
              <img 
                src={image.url} 
                alt={image.title}
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <h3 className="gallery-title">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;