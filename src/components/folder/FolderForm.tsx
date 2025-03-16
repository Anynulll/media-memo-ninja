
import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { useAppContext } from '@/context/AppContext';

interface FolderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FolderForm: React.FC<FolderFormProps> = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');
  const { addFolder, folders } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate folder name
    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }
    
    // Check if folder name already exists
    if (folders.some(folder => folder.name.toLowerCase() === folderName.trim().toLowerCase())) {
      setError('A folder with this name already exists');
      return;
    }
    
    // Add folder
    addFolder(folderName.trim());
    
    // Reset form and close modal
    setFolderName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-6 border border-border animate-scale-in">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl flex items-center">
            <Folder className="w-5 h-5 mr-2 text-primary" />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <CustomInput
              label="Folder Name"
              placeholder="Enter folder name..."
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError('');
              }}
              error={error}
              autoFocus
            />
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
              icon={<Folder className="h-4 w-4" />}
            >
              Create Folder
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
