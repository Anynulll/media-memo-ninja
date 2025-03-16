
import React, { useMemo } from 'react';
import { MemoCard } from './MemoCard';
import { useAppContext } from '@/context/AppContext';

export const MemoList: React.FC = () => {
  const { memos, activeFolderId, searchTerm, selectedTypes } = useAppContext();
  
  // Filter memos based on active folder, search term, and selected types
  const filteredMemos = useMemo(() => {
    let filtered = memos;
    
    // Filter by folder
    if (activeFolderId === 'uncategorized') {
      filtered = filtered.filter(memo => memo.folderId === null);
    } else if (activeFolderId) {
      filtered = filtered.filter(memo => memo.folderId === activeFolderId);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(memo => 
        memo.url.toLowerCase().includes(searchLower) || 
        (memo.title && memo.title.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(memo => selectedTypes.includes(memo.type));
    }
    
    return filtered;
  }, [memos, activeFolderId, searchTerm, selectedTypes]);
  
  if (filteredMemos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-10 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No memos found</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {searchTerm ? 
            `No memos match your search term "${searchTerm}". Try a different search.` : 
            selectedTypes.length > 0 ?
            'No memos match the selected filters.' :
            'Add your first memo by clicking the "Add Memo" button.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMemos.map((memo) => (
        <div key={memo.id} className="memo-card-enter">
          <MemoCard memo={memo} />
        </div>
      ))}
    </div>
  );
};
