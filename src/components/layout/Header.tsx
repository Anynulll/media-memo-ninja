
import React from 'react';
import { Search, Folder, FolderPlus } from 'lucide-react';
import { CustomInput } from '@/components/ui/CustomInput';
import { useAppContext } from '@/context/AppContext';
import { CustomButton } from '@/components/ui/CustomButton';

interface HeaderProps {
  onOpenFolderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFolderModal }) => {
  const { searchTerm, setSearchTerm } = useAppContext();
  
  return (
    <header className="sticky top-0 z-10 w-full px-6 py-4 backdrop-blur-md bg-background/80 border-b border-border transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Media Memo
            </h1>
            <div className="ml-2 px-2 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
              Ninja
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <CustomInput
              placeholder="Search memos..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-60 lg:w-72"
            />
            
            <CustomButton
              variant="subtle"
              size="sm"
              icon={<FolderPlus className="h-4 w-4" />}
              onClick={onOpenFolderModal}
              className="whitespace-nowrap"
            >
              New Folder
            </CustomButton>
          </div>
        </div>
      </div>
    </header>
  );
};
