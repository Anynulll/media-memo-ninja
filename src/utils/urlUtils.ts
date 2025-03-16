
/**
 * Utility functions for working with URLs
 */

// Convert Twitter/X URLs to original image URLs
export const getTwitterOriginalImageUrl = (url: string): string => {
  if (!url.includes('pbs.twimg.com')) {
    return url;
  }
  
  // Replace the image formatting parameters with 'orig'
  return url.replace(/\.(jpg|png)(:[a-z]+)?$/, '.$1:orig');
};

// Get domain name from URL
export const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Normalize Twitter/X URLs (handle both twitter.com and x.com)
export const normalizeTwitterUrl = (url: string): string => {
  if (url.includes('twitter.com')) {
    return url;
  }
  if (url.includes('x.com')) {
    return url.replace('x.com', 'twitter.com');
  }
  return url;
};

// Format YouTube URL for embedding
export const formatYoutubeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be short URLs
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle normal youtube URLs
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url;
  } catch (e) {
    return url;
  }
};
