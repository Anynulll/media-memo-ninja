
/**
 * Utility functions for embedding social media content
 */

import { useEffect, useRef } from 'react';
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
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!url) return;
    
    const normalizedUrl = normalizeTwitterUrl(url);
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';
    hasLoaded.current = false;

    const load = async () => {
      await loadTwitterWidgets();
      
      if (hasLoaded.current) return;
      hasLoaded.current = true;
      
      try {
        const tweetId = normalizedUrl.split('/').pop()?.split('?')[0] || '';
        
        if ((window as any).twttr && (window as any).twttr.widgets) {
          (window as any).twttr.widgets.createTweet(
            tweetId,
            container,
            {
              theme: 'light',
              width: '100%',
              align: 'center'
            }
          ).then(() => {
            console.log(`Tweet ${tweetId} loaded successfully`);
          }).catch((error: any) => {
            console.error('Error creating tweet embed:', error);
            // Fallback for failing embeds
            container.innerHTML = `
              <div class="p-4 text-center">
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  View on Twitter
                </a>
              </div>
            `;
          });
        }
      } catch (e) {
        console.error('Error creating tweet embed:', e);
        // Fallback
        container.innerHTML = `
          <div class="p-4 text-center">
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
              View on Twitter
            </a>
          </div>
        `;
      }
    };

    load();

    return () => {
      hasLoaded.current = false;
    };
  }, [containerId, url]);
};

// Custom hook for Instagram embeds
export const useInstagramEmbed = (containerId: string, url: string | null) => {
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!url) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';
    hasLoaded.current = false;

    // Create blockquote for Instagram
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', url);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.margin = '0';
    blockquote.style.width = '100%';
    container.appendChild(blockquote);

    // Process the embed
    const load = async () => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;
      
      await loadInstagramEmbed();
      if ((window as any).instgrm && (window as any).instgrm.Embeds) {
        (window as any).instgrm.Embeds.process();
      }
    };

    load();
    
    // Try to process again after a delay (sometimes Instagram needs this)
    const timer = setTimeout(() => {
      if ((window as any).instgrm && (window as any).instgrm.Embeds) {
        (window as any).instgrm.Embeds.process();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      hasLoaded.current = false;
    };
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
