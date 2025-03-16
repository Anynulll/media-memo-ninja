
import React from 'react';
import { Folder, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

interface FolderItemProps {
  id: string;
  name: string;
  count: number;
  isActive: boolean;
  onSelect: () => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({ 
  id, 
  name, 
  count, 
  isActive, 
  onSelect 
}) => {
  const { removeFolder } = useAppContext();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <div 
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group",
          isActive ? "folderItem-active" : "hover:bg-accent"
        )}
        onClick={onSelect}
      >
        <div className="flex items-center space-x-2">
          <Folder className="h-4 w-4" />
          <span className="text-sm font-medium truncate">{name}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium px-2 py-0.5 bg-background rounded-full">
            {count}
          </span>
          
          {id !== 'all' && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              aria-label={`Delete folder ${name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the folder "{name}"? Memos in this folder will be moved to "All Memos".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 rounded-lg"
              onClick={() => removeFolder(id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
