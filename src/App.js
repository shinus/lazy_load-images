import React, { useState, useEffect } from 'react';
import './LazyLoadingComponent.css';

const LazyLoadingComponent = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [page, setPage] = useState(1);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/?client_id=-50KJngv9RQu4-Tvrwgm5bBsOxRfnNC47kHQb1pclnY&page=${page}&per_page=6&hash=${generateUniqueHash()}`);
      const newPhotos = await response.json();

      if (Array.isArray(newPhotos)) {
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error('Invalid response format:', newPhotos);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 9 && !isLoading) {
      setIsLoading(true); // Set loading to true before fetching new data
      fetchPhotos();
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [photos, isLoading]); 

  function generateUniqueHash() {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString(36).substring(2, 15);
    const hash = timestamp + '-' + random;
    return hash;
  }
  return (
    <div className="photo-container">
      {photos.map((photo) => (
        <div className="photo-card" key={photo.id}>
          <img src={photo.urls.small} alt={photo.alt_description} />
        </div>
      ))}
      {isLoading && (
        <div className="loading-overlay">
          <p className="loading-text">Hang on Loading...</p>
        </div>
      )}
    </div>
  );
};

export default LazyLoadingComponent;
