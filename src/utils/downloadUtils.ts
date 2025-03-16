
/**
 * Utility functions for downloading media
 */
import { getTwitterOriginalImageUrl } from './urlUtils';

// Function to download an image from a URL
export const downloadImage = async (url: string, filename?: string): Promise<void> => {
  try {
    // For Twitter/X images, convert to original quality
    const imageUrl = url.includes('pbs.twimg.com') 
      ? getTwitterOriginalImageUrl(url)
      : url;
    
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create an object URL for the blob
    const objectUrl = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = objectUrl;
    
    // Set download attribute with filename
    const downloadName = filename || `image-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
    link.download = downloadName;
    
    // Append to the document, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
};

// Function to extract image URLs from a Twitter post
export const extractTwitterImages = async (tweetUrl: string): Promise<string[]> => {
  // This is just a placeholder. In a real implementation, you would need
  // to use Twitter's API or parse the HTML of the tweet.
  // For demonstration purposes, we'll return an empty array
  console.log('Extracting images from:', tweetUrl);
  return [];
};

// Function to download a video (when possible)
export const downloadVideo = async (videoUrl: string, filename?: string): Promise<void> => {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    
    const downloadName = filename || `video-${Date.now()}.mp4`;
    link.download = downloadName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
};
