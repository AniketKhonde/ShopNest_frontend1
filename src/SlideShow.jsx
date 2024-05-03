import React, { useState, useEffect } from 'react';

const SlideShow = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slideshow absolute md:top-0 md:left-0  top-0 left-16" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
    {images.map((image, index) => (
      <img
        key={index}
        src={image.src}
        alt={image.alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: index === currentSlide ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
      />
    ))}
  </div>
  );
};

export default SlideShow;
