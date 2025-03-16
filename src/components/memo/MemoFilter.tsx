
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface FilterOption {
  type: 'twitter' | 'instagram' | 'youtube' | 'other';
  icon: React.ReactNode;
  label: string;
}

export const MemoFilter: React.FC = () => {
  const { memos, activeFolderId, selectedTypes, setSelectedTypes } = useAppContext();

  // Define filter options
  const filterOptions: FilterOption[] = [
    { type: 'twitter', icon: <Twitter className="h-4 w-4 text-blue-400" />, label: 'Twitter' },
    { type: 'instagram', icon: <Instagram className="h-4 w-4 text-pink-500" />, label: 'Instagram' },
    { type: 'youtube', icon: <Youtube className="h-4 w-4 text-red-500" />, label: 'YouTube' },
    { type: 'other', icon: <Globe className="h-4 w-4 text-gray-500" />, label: 'Other' },
  ];

  // Calculate counts for each type based on current folder
  const typeCounts = React.useMemo(() => {
    return filterOptions.reduce((acc, option) => {
      let count = 0;
      
      if (activeFolderId === 'uncategorized') {
        count = memos.filter(memo => memo.type === option.type && memo.folderId === null).length;
      } else if (activeFolderId) {
        count = memos.filter(memo => memo.type === option.type && memo.folderId === activeFolderId).length;
      } else {
        count = memos.filter(memo => memo.type === option.type).length;
      }
      
      return { ...acc, [option.type]: count };
    }, {} as Record<string, number>);
  }, [memos, activeFolderId]);

  // Toggle selection of a type
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="mr-2 text-sm font-medium text-muted-foreground">Filter:</div>
      
      {filterOptions.map(option => (
        <Badge
          key={option.type}
          variant={selectedTypes.includes(option.type) ? 'default' : 'outline'}
          className={`cursor-pointer transition-all duration-200 px-3 py-1 flex items-center space-x-1 rounded-full ${
            selectedTypes.includes(option.type) ? '' : 'bg-transparent hover:bg-accent'
          }`}
          onClick={() => toggleType(option.type)}
        >
          {option.icon}
          <span>{option.label}</span>
          <span className="ml-1 text-xs">({typeCounts[option.type] || 0})</span>
        </Badge>
      ))}
      
      {selectedTypes.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8 rounded-full"
          onClick={resetFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};
