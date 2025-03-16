
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MemoItem {
  id: string;
  url: string;
  type: 'twitter' | 'instagram' | 'youtube' | 'other';
  folderId: string | null;
  createdAt: Date;
  title?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  createdAt: Date;
}

interface AppContextType {
  memos: MemoItem[];
  folders: FolderItem[];
  activeFolderId: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addMemo: (url: string, folderId?: string | null) => void;
  removeMemo: (id: string) => void;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  setActiveFolderId: (id: string | null) => void;
  moveMemoToFolder: (memoId: string, folderId: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memos, setMemos] = useState<MemoItem[]>(() => {
    const saved = localStorage.getItem('memos');
    if (saved) {
      try {
        return JSON.parse(saved).map((memo: any) => ({
          ...memo,
          createdAt: new Date(memo.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse memos from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem('folders');
    if (saved) {
      try {
        return JSON.parse(saved).map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse folders from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const determineType = (url: string): 'twitter' | 'instagram' | 'youtube' | 'other' => {
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'other';
  };

  const addMemo = (url: string, folderId: string | null = null) => {
    const newMemo: MemoItem = {
      id: crypto.randomUUID(),
      url,
      type: determineType(url),
      folderId,
      createdAt: new Date(),
    };

    setMemos((prevMemos) => [newMemo, ...prevMemos]);
  };

  const removeMemo = (id: string) => {
    setMemos((prevMemos) => prevMemos.filter(memo => memo.id !== id));
  };

  const addFolder = (name: string) => {
    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date()
    };

    setFolders((prevFolders) => [newFolder, ...prevFolders]);
  };

  const removeFolder = (id: string) => {
    setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== id));
    // Move memos to no folder
    setMemos((prevMemos) => 
      prevMemos.map(memo => 
        memo.folderId === id ? { ...memo, folderId: null } : memo
      )
    );
  };

  const moveMemoToFolder = (memoId: string, folderId: string | null) => {
    setMemos((prevMemos) => 
      prevMemos.map(memo => 
        memo.id === memoId ? { ...memo, folderId } : memo
      )
    );
  };

  const value = {
    memos,
    folders,
    activeFolderId,
    searchTerm,
    setSearchTerm,
    addMemo,
    removeMemo,
    addFolder,
    removeFolder,
    setActiveFolderId,
    moveMemoToFolder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
