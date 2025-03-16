
/**
 * Utility functions for embedding social media content
 */

import { useEffect } from 'react';
import { normalizeTwitterUrl, formatYoutubeUrl } from './urlUtils';

// Load Twitter/X widget script
const loadTwitterWidgets = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).twttr && (window as any).twttr.widgets) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

// Load Instagram embed script
const loadInstagramEmbed = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).instgrm && (window as any).instgrm.Embeds) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.instagram.com/embed.js');
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

// Process Twitter embeds
export const processTwitterEmbeds = async (containerId: string): Promise<void> => {
  await loadTwitterWidgets();
  if ((window as any).twttr && (window as any).twttr.widgets) {
    (window as any).twttr.widgets.load(document.getElementById(containerId));
  }
};

// Process Instagram embeds
export const processInstagramEmbeds = async (): Promise<void> => {
  await loadInstagramEmbed();
  if ((window as any).instgrm && (window as any).instgrm.Embeds) {
    (window as any).instgrm.Embeds.process();
  }
};

// Custom hook for Twitter embeds
export const useTwitterEmbed = (containerId: string, url: string | null) => {
  useEffect(() => {
    if (!url) return;
    
    const normalizedUrl = normalizeTwitterUrl(url);
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    const load = async () => {
      await loadTwitterWidgets();
      try {
        if ((window as any).twttr && (window as any).twttr.widgets) {
          (window as any).twttr.widgets.createTweet(
            normalizedUrl.split('/').pop()?.split('?')[0] || '',
            container,
            {
              theme: 'light',
              width: '100%',
              align: 'center'
            }
          );
        }
      } catch (e) {
        console.error('Error creating tweet embed:', e);
      }
    };

    load();
  }, [containerId, url]);
};

// Custom hook for Instagram embeds
export const useInstagramEmbed = (containerId: string, url: string | null) => {
  useEffect(() => {
    if (!url) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create blockquote for Instagram
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', url);
    blockquote.setAttribute('data-instgrm-version', '14');
    container.appendChild(blockquote);

    // Process the embed
    const load = async () => {
      await loadInstagramEmbed();
      if ((window as any).instgrm && (window as any).instgrm.Embeds) {
        (window as any).instgrm.Embeds.process();
      }
    };

    load();
  }, [containerId, url]);
};

// Custom hook for YouTube embeds
export const useYoutubeEmbed = (containerId: string, url: string | null) => {
  useEffect(() => {
    if (!url) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Format YouTube URL for embedding
    const embedUrl = formatYoutubeUrl(url);
    
    // Create iframe for YouTube
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.width = '100%';
    iframe.height = '315';
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    container.appendChild(iframe);
  }, [containerId, url]);
};
