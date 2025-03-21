
import { useState } from 'react';
import { toast } from 'sonner';
import { ContentItem } from '@/components/ContentDisplay';
import { searchContent, generateContent } from '@/utils/contentService';

const useContentSearch = () => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, level: string, format: string) => {
    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchContent(query, level, format);
      
      if (result) {
        setContent(result);
        toast.success('Content found!');
      } else {
        setError('No content found for your query. Try generating with AI instead.');
        toast.error('No content found. Try AI generation instead.');
      }
    } catch (err) {
      setError('An error occurred while searching for content.');
      toast.error('Error searching for content');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerate = async (prompt: string, format: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateContent(prompt, format);
      setContent(result);
      toast.success('AI-generated content ready!');
    } catch (err) {
      setError('An error occurred while generating content.');
      toast.error('Error generating content');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    content,
    error,
    isSearching,
    isGenerating,
    handleSearch,
    handleGenerate
  };
};

export default useContentSearch;
