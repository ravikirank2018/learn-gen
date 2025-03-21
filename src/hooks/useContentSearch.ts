
import { useState } from 'react';
import { toast } from 'sonner';
import { ContentItem } from '@/components/ContentDisplay';
import { 
  searchContent, 
  generateContent, 
  synthesizeSpeech, 
  generateSignLanguageVideo 
} from '@/utils/contentService';

const useContentSearch = () => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGeneratingSignLanguage, setIsGeneratingSignLanguage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, level: string, format: string) => {
    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchContent(query, level, format);
      
      if (result) {
        setContent(result);
        toast.success('Content found!');
        
        // If format is text and we have content, synthesize speech for blind users
        if (result.format === 'text' && result.content) {
          synthesizeSpeech(result.content).catch(err => 
            console.error('Error synthesizing speech:', err)
          );
        }
      } else {
        setError('No content found for your query. Try generating with AI instead.');
        toast.error('No content found. Try AI generation instead.');
        
        // Synthesize error message for blind users
        synthesizeSpeech('No content found for your query. Try generating with AI instead.').catch(err => 
          console.error('Error synthesizing speech:', err)
        );
      }
    } catch (err) {
      setError('An error occurred while searching for content.');
      toast.error('Error searching for content');
      console.error(err);
      
      // Synthesize error message for blind users
      synthesizeSpeech('An error occurred while searching for content.').catch(err => 
        console.error('Error synthesizing speech:', err)
      );
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
      
      // If format is text and we have content, synthesize speech for blind users
      if (result.format === 'text' && result.content) {
        synthesizeSpeech(result.content).catch(err => 
          console.error('Error synthesizing speech:', err)
        );
      }
      
      // If sign language format is requested, generate sign language video
      if (format === 'signLanguage') {
        setIsGeneratingSignLanguage(true);
        try {
          const { url, thumbnailUrl } = await generateSignLanguageVideo(prompt);
          
          // Update content with sign language video
          setContent(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              url,
              thumbnailUrl,
              format: 'signLanguage'
            };
          });
          
          toast.success('Sign language video generated!');
        } catch (err) {
          toast.error('Error generating sign language video');
          console.error(err);
        } finally {
          setIsGeneratingSignLanguage(false);
        }
      }
    } catch (err) {
      setError('An error occurred while generating content.');
      toast.error('Error generating content');
      console.error(err);
      
      // Synthesize error message for blind users
      synthesizeSpeech('An error occurred while generating content.').catch(err => 
        console.error('Error synthesizing speech:', err)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    content,
    error,
    isSearching,
    isGenerating,
    isListening,
    setIsListening,
    isGeneratingSignLanguage,
    handleSearch,
    handleGenerate
  };
};

export default useContentSearch;
