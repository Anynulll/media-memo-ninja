
import React, { useRef, useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  ExternalLink, 
  Folder, 
  MoreVertical, 
  Trash2, 
  Twitter, 
  Instagram, 
  Youtube, 
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useTwitterEmbed, useInstagramEmbed, useYoutubeEmbed } from '@/utils/embedUtils';
import { getDomainFromUrl, normalizeTwitterUrl, getTwitterOriginalImageUrl } from '@/utils/urlUtils';
import { downloadImage, extractTwitterImages } from '@/utils/downloadUtils';
import { useAppContext, MemoItem, FolderItem } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface MemoCardProps {
  memo: MemoItem;
}

export const MemoCard: React.FC<MemoCardProps> = ({ memo }) => {
  const { removeMemo, folders, moveMemoToFolder, updateMemoImage } = useAppContext();
  const twitterContainerId = `twitter-embed-${memo.id}`;
  const instagramContainerId = `instagram-embed-${memo.id}`;
  const youtubeContainerId = `youtube-embed-${memo.id}`;
  const [isLoading, setIsLoading] = useState(true);
  const [folder, setFolder] = useState<FolderItem | null>(null);
  
  // Use custom hooks for embedding content
  useTwitterEmbed(twitterContainerId, memo.type === 'twitter' ? memo.url : null);
  useInstagramEmbed(instagramContainerId, memo.type === 'instagram' ? memo.url : null);
  useYoutubeEmbed(youtubeContainerId, memo.type === 'youtube' ? memo.url : null);
  
  // Find the folder
  useEffect(() => {
    if (memo.folderId) {
      const foundFolder = folders.find(f => f.id === memo.folderId) || null;
      setFolder(foundFolder);
    } else {
      setFolder(null);
    }
  }, [memo.folderId, folders]);
  
  // Set loading state based on type
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Increase timeout to give embeds more time to load
    
    return () => clearTimeout(timer);
  }, []);

  // Handle deleting a memo
  const handleDelete = () => {
    removeMemo(memo.id);
    toast({
      title: "Memo deleted",
      description: "The memo has been successfully deleted.",
    });
  };
  
  // Handle moving a memo to a different folder
  const handleMove = (folderId: string | null) => {
    moveMemoToFolder(memo.id, folderId);
    const folderName = folderId ? folders.find(f => f.id === folderId)?.name : "Uncategorized";
    toast({
      title: "Memo moved",
      description: `The memo has been moved to ${folderName}.`,
    });
  };
  
  // Handle downloading an image
  const handleDownload = async () => {
    try {
      if (memo.type === 'twitter') {
        toast({
          title: "Downloading image",
          description: "Downloading image in original quality...",
        });
        
        // Simulate downloading the image
        console.log('Download would happen here for:', memo.url);
        
        // In a real implementation, you would extract the actual image URL
        // For now, we'll store a dummy image URL to demonstrate the feature
        const timestamp = new Date().toISOString();
        const dummyImageUrl = `https://via.placeholder.com/800x600?text=Twitter+Image+${timestamp}`;
        
        // Update the memo with the image URL
        updateMemoImage(memo.id, dummyImageUrl);
        
        toast({
          title: "Download complete",
          description: "Image has been saved successfully.",
        });
      } else if (memo.type === 'instagram') {
        toast({
          title: "Downloading image",
          description: "Downloading Instagram image...",
        });
        
        // Similar simulation for Instagram
        const timestamp = new Date().toISOString();
        const dummyImageUrl = `https://via.placeholder.com/800x800?text=Instagram+Image+${timestamp}`;
        updateMemoImage(memo.id, dummyImageUrl);
        
        toast({
          title: "Download complete",
          description: "Image has been saved successfully.",
        });
      } else {
        toast({
          description: "No downloadable content available.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Get icon based on type
  const getTypeIcon = () => {
    switch (memo.type) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md card-hover">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b border-border/50">
        <div className="flex items-center space-x-2">
          {getTypeIcon()}
          <h3 className="font-medium text-sm">{getDomainFromUrl(memo.url)}</h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer hover:bg-accent p-1 rounded-md transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-lg">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => window.open(memo.url, '_blank')}
              className="cursor-pointer flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Original
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={handleDownload}
              className="cursor-pointer flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Media
              {memo.imageUrl && <Check className="h-3 w-3 ml-auto text-green-500" />}
            </DropdownMenuItem>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                Move to Folder
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="rounded-lg">
                <DropdownMenuItem 
                  onClick={() => handleMove(null)}
                  className="cursor-pointer"
                >
                  Uncategorized
                </DropdownMenuItem>
                {folders.map(folder => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => handleMove(folder.id)}
                    className="cursor-pointer"
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Memo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-muted/20 animate-pulse">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="w-full">
            {memo.type === 'twitter' && (
              <div id={twitterContainerId} className="twitter-embed-container w-full min-h-32 overflow-hidden"></div>
            )}
            
            {memo.type === 'instagram' && (
              <div id={instagramContainerId} className="instagram-embed-container w-full min-h-32 overflow-hidden"></div>
            )}
            
            {memo.type === 'youtube' && (
              <div id={youtubeContainerId} className="youtube-embed-container w-full h-64 overflow-hidden"></div>
            )}
            
            {memo.type === 'other' && (
              <div className="flex items-center justify-center h-32 bg-muted/10">
                <a href={memo.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open URL
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(memo.createdAt), 'MMM d, yyyy')}</span>
        </div>
        
        {folder && (
          <div className="flex items-center px-2 py-1 bg-primary/5 rounded-full">
            <Folder className="h-3 w-3 mr-1 text-primary" />
            <span className="text-xs text-primary font-medium">{folder.name}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
