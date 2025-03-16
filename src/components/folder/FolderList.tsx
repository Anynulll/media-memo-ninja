
import React, { useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { FolderItem } from './FolderItem';
import { useAppContext } from '@/context/AppContext';

export const FolderList: React.FC = () => {
  const { folders, memos, activeFolderId, setActiveFolderId, selectedTypes } = useAppContext();
  
  // Calculate memo counts for each folder, taking into account any type filters
  const folderCounts = useMemo(() => {
    // Filter memos by type if there are selected types
    let filteredMemos = memos;
    if (selectedTypes.length > 0) {
      filteredMemos = memos.filter(memo => selectedTypes.includes(memo.type));
    }
    
    const counts: Record<string, number> = { all: filteredMemos.length };
    
    folders.forEach(folder => {
      counts[folder.id] = filteredMemos.filter(memo => memo.folderId === folder.id).length;
    });
    
    // Count memos without a folder
    counts.uncategorized = filteredMemos.filter(memo => memo.folderId === null).length;
    
    return counts;
  }, [folders, memos, selectedTypes]);
  
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
