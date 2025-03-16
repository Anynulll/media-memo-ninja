
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { MemoList } from '@/components/memo/MemoList';
import { MemoForm } from '@/components/memo/MemoForm';
import { MemoFilter } from '@/components/memo/MemoFilter';
import { FolderList } from '@/components/folder/FolderList';
import { FolderForm } from '@/components/folder/FolderForm';
import { CustomButton } from '@/components/ui/CustomButton';
import { Separator } from '@/components/ui/separator';
import { AppProvider } from '@/context/AppContext';

const Index = () => {
  const [isMemoFormOpen, setIsMemoFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header onOpenFolderModal={() => setIsFolderFormOpen(true)} />
        
        <main className="flex-1 py-6">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
                    <h2 className="text-sm font-semibold mb-3">Folders</h2>
                    <FolderList />
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Your Memos</h1>
                  <CustomButton 
                    onClick={() => setIsMemoFormOpen(true)}
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Add Memo
                  </CustomButton>
                </div>
                
                <Separator className="my-4" />
                
                <MemoFilter />
                
                <MemoList />
              </div>
            </div>
          </Container>
        </main>
        
        {/* Modals */}
        <MemoForm 
          isOpen={isMemoFormOpen} 
          onClose={() => setIsMemoFormOpen(false)} 
        />
        
        <FolderForm 
          isOpen={isFolderFormOpen} 
          onClose={() => setIsFolderFormOpen(false)} 
        />
      </div>
    </AppProvider>
  );
};

export default Index;
