import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchData } from './VirtualizedFeed_action';
import './VirtualizedFeed.css';


const VirtualizedFeed = () => {
  const PAGE_SIZE = 10;
  const THRESHOLD = 300;

  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight); // fallback

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Set actual container height after mount
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Fetch more images
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const result = await fetchData(page, PAGE_SIZE);
      const newImages = result.photos || [];

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        setImages(prev => [...prev, ...newImages]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    }

    setLoading(false);
  }, [page, hasMore, loading]);

  useEffect(() => {
    loadMore();
  }, []);

    // Scroll handler
    const onScroll = () => {
      const node = containerRef.current;
    if (!node) return;
    const { scrollTop, scrollHeight, clientHeight } = node;

      // If near the bottom, load more
      if (scrollHeight - scrollTop - clientHeight < THRESHOLD) {
        loadMore();
      }
  };

  useEffect(() => {
  const node = containerRef.current;
  if (!node) return;

  node.addEventListener('scroll', onScroll);
  return () => node.removeEventListener('scroll', onScroll);
}, [images, loading, hasMore]);


const handleDownload = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Download failed:', err);
  }
};

  return (
    <div ref={containerRef} className="feed-container">
        <div className="feed-grid">
          {images.map((image, index) => (
            <div key={`${image.id}-${index}`} className="image-card">
              <img
                src={image.src.medium}
                alt={image.alt || 'Galaxy wallpaper'}
              />
              <p className="image-caption">📸 {image.photographer}</p>

            <button
              onClick={() => handleDownload(image.src.original, `pexels-${image.id}.jpg`)}
              className="download-button"
            >
              ⬇ Download
            </button>

            </div>
            ))}
        </div>
            
       {loading && (
          <div className="loader">Loading…</div>
        )}
        </div>
    );
};

export default VirtualizedFeed;