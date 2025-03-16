
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getDomainFromUrl } from '@/utils/urlUtils';
import { AppProvider } from '@/context/AppContext';

const SavedImages = () => {
  const navigate = useNavigate();
  const { memos } = useAppContext();
  
  // Filter memos that have images
  const memosWithImages = useMemo(() => {
    return memos.filter(memo => memo.imageUrl);
  }, [memos]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header hideAddFolder={true} />
      
      <main className="flex-1 py-6">
        <Container>
          <div className="space-y-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-4"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">Saved Images</h1>
            </div>
            
            <Separator className="my-4" />
            
            {memosWithImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] p-10 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Download className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No saved images</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Download images from your memos to see them here.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Go to Memos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {memosWithImages.map((memo) => (
                  <div 
                    key={memo.id}
                    className="group relative rounded-xl overflow-hidden aspect-square border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <img 
                      src={memo.imageUrl} 
                      alt={`Image from ${getDomainFromUrl(memo.url)}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="flex flex-col items-center text-white space-y-2">
                        <span className="text-sm font-medium">
                          {getDomainFromUrl(memo.url)}
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="rounded-full h-8 w-8 p-0"
                            onClick={() => window.open(memo.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default SavedImages;
