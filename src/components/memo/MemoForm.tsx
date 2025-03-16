
import React, { useState } from 'react';
import { Link, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { useAppContext } from '@/context/AppContext';
import { isValidUrl } from '@/utils/urlUtils';

interface MemoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoForm: React.FC<MemoFormProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { addMemo, folders, activeFolderId } = useAppContext();

  // Set the active folder as default when opening the form
  React.useEffect(() => {
    if (isOpen && activeFolderId && activeFolderId !== 'uncategorized') {
      setSelectedFolder(activeFolderId);
    } else {
      setSelectedFolder(null);
    }
  }, [isOpen, activeFolderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Add http:// if missing
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Add memo
    addMemo(formattedUrl, selectedFolder);
    
    // Reset form and close modal
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-6 border border-border animate-scale-in">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl flex items-center">
            <Link className="w-5 h-5 mr-2 text-primary" />
            Add New Memo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <CustomInput
              label="URL"
              placeholder="Enter Twitter, Instagram, YouTube URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              error={error}
              autoFocus
              icon={<Link className="h-4 w-4" />}
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Folder
              </label>
              <Select 
                value={selectedFolder || ''} 
                onValueChange={(value) => setSelectedFolder(value === 'none' ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-6 gap-2 sm:justify-end">
            <DialogClose asChild>
              <CustomButton 
                type="button" 
                variant="outline" 
                size="sm"
                icon={<X className="h-4 w-4" />}
              >
                Cancel
              </CustomButton>
            </DialogClose>
            <CustomButton 
              type="submit" 
              size="sm"
              icon={<Plus className="h-4 w-4" />}
            >
              Add Memo
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
