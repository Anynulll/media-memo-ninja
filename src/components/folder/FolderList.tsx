
import React, { useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { FolderItem } from './FolderItem';
import { useAppContext } from '@/context/AppContext';

export const FolderList: React.FC = () => {
  const { folders, memos, activeFolderId, setActiveFolderId } = useAppContext();
  
  // Calculate memo counts for each folder
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: memos.length };
    
    folders.forEach(folder => {
      counts[folder.id] = memos.filter(memo => memo.folderId === folder.id).length;
    });
    
    // Count memos without a folder
    counts.uncategorized = memos.filter(memo => memo.folderId === null).length;
    
    return counts;
  }, [folders, memos]);
  
  return (
    <div className="space-y-1 animate-fade-in">
      <FolderItem
        id="all"
        name="All Memos"
        count={folderCounts.all}
        isActive={activeFolderId === null}
        onSelect={() => setActiveFolderId(null)}
      />
      
      {folders.map(folder => (
        <FolderItem
          key={folder.id}
          id={folder.id}
          name={folder.name}
          count={folderCounts[folder.id] || 0}
          isActive={activeFolderId === folder.id}
          onSelect={() => setActiveFolderId(folder.id)}
        />
      ))}
      
      <FolderItem
        id="uncategorized"
        name="Uncategorized"
        count={folderCounts.uncategorized || 0}
        isActive={activeFolderId === 'uncategorized'}
        onSelect={() => setActiveFolderId('uncategorized')}
      />
    </div>
  );
};
