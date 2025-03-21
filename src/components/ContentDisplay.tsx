import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import AccessibilityControls from './AccessibilityControls';
import { synthesizeSpeech } from '@/utils/contentService';

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  source: 'external' | 'ai';
  format: 'text' | 'video' | 'audio' | 'signLanguage';
  url?: string;
  content?: string;
  thumbnailUrl?: string;
};

type ContentDisplayProps = {
  content: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  className?: string;
  speakText?: (text: string) => Promise<void>;
};

const ContentDisplay: React.FC<ContentDisplayProps> = ({ 
  content, 
  isLoading, 
  error,
  className,
  speakText 
}) => {
  const [accessibilityOptions, setAccessibilityOptions] = React.useState({
    textToSpeech: true, // Enable by default for blind users
    highContrast: false,
    subtitles: true,
    signLanguage: false,
    textSize: 'normal',
  });

  const textSizeClass = React.useMemo(() => {
    switch (accessibilityOptions.textSize) {
      case 'large': return 'text-lg';
      case 'x-large': return 'text-xl';
      default: return 'text-base';
    }
  }, [accessibilityOptions.textSize]);

  // Function to read text content aloud
  const readContent = async () => {
    if (content?.content) {
      if (speakText) {
        await speakText(content.content);
      } else {
        try {
          await synthesizeSpeech(content.content);
        } catch (err) {
          console.error('Error reading content:', err);
        }
      }
    }
  };

  // Automatically read content when it changes if textToSpeech is enabled
  useEffect(() => {
    if (content?.content && accessibilityOptions.textToSpeech) {
      readContent();
    }
  }, [content, accessibilityOptions.textToSpeech]);

  // Also read error messages aloud
  useEffect(() => {
    if (error && accessibilityOptions.textToSpeech) {
      if (speakText) {
        speakText(error);
      } else {
        synthesizeSpeech(error).catch(err => 
          console.error('Error speaking error message:', err)
        );
      }
    }
  }, [error, accessibilityOptions.textToSpeech]);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="glass p-8 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("animate-fade-in", className)}>
        <div className="glass p-8 rounded-xl shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => readContent()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={cn("animate-fade-in", className)}>
        <div className="glass p-8 rounded-xl shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <path d="M17.5 5.5C19 7 20.5 9 21 11c-2.5.5-5 .5-8.5-1"/>
              <path d="M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5"/>
              <path d="M16.5 11.5c1 2 1 3.5 1 6-2.5 0-4 0-6-1"/>
              <path d="M20 11.5c1 1.5 2 3.5 2 4.5-1.5.5-3 0-4.5-.5"/>
              <path d="M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5"/>
              <path d="M20.5 16.5c1 2 1.5 3.5 1.5 5.5-2 0-3.5-.5-5.5-1.5"/>
              <path d="M4.783 4.782C8.493 1.072 14.5 1 18 5c-1 1-4.5 2-6.5 1.5 1 1.5 1 4 .5 5.5-1.5.5-4 .5-5.5-.5C7 13.5 6 17 5 18c-4-3.5-3.927-9.508-.217-13.218Z"/>
              <path d="M4.5 4.5 3 3"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Search for a topic to retrieve or generate content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-4 right-4 z-10">
        <AccessibilityControls 
          onChange={setAccessibilityOptions} 
          initialOptions={accessibilityOptions}
        />
      </div>

      <div 
        className={cn(
          "glass p-8 rounded-xl shadow-lg animate-fade-in",
          accessibilityOptions.highContrast && "bg-white dark:bg-black"
        )}
      >
        <div className="mb-6 flex items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mr-3",
            content.source === 'external' 
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          )}>
            {content.source === 'external' ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="m8 12 3 3 5-5"/>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
              </svg>
            )}
          </div>
          <div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              content.source === 'external' 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            )}>
              {content.source === 'external' ? 'Retrieved Content' : 'AI Generated'}
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full ml-2",
              content.format === 'text' 
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                : content.format === 'video'
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : content.format === 'audio'
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            )}>
              {content.format === 'text' 
                ? 'Text' 
                : content.format === 'video' 
                ? 'Video' 
                : content.format === 'audio' 
                ? 'Audio'
                : 'Sign Language'
              }
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className={cn(
            "text-2xl font-bold",
            accessibilityOptions.textSize === 'large' && "text-3xl",
            accessibilityOptions.textSize === 'x-large' && "text-4xl",
            accessibilityOptions.highContrast && "text-black dark:text-white"
          )}>
            {content.title}
          </h2>
          
          {content.format === 'text' && content.content && (
            <button 
              onClick={readContent}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              aria-label="Read content aloud"
              title="Read content aloud"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 6v12"/>
                <path d="M6 12h12"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </button>
          )}
        </div>
        
        <p className={cn(
          "text-gray-600 dark:text-gray-300 mb-6",
          textSizeClass,
          accessibilityOptions.highContrast && "text-black dark:text-white"
        )}>
          {content.description}
        </p>

        {content.format === 'video' && content.url && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video">
              <iframe 
                src={content.url} 
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={content.title}
              ></iframe>
              {accessibilityOptions.subtitles && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-center">
                  Sample subtitle text would appear here when available
                </div>
              )}
            </div>
          </div>
        )}

        {content.format === 'audio' && content.url && (
          <div className="mb-6">
            <audio controls className="w-full">
              <source src={content.url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        
        {content.format === 'signLanguage' && content.url && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-video bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-center p-4">
                  This is where the sign language video would play.
                  <br />In a production environment, this would be an actual video of sign language.
                </p>
              </div>
            </div>
          </div>
        )}

        {content.content && (
          <div className={cn("prose max-w-none", textSizeClass)}>
            <p className={accessibilityOptions.highContrast ? "text-black dark:text-white" : ""}>
              {content.content}
            </p>
          </div>
        )}

        {accessibilityOptions.signLanguage && (
          <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/50 dark:bg-black/50">
            <div className="flex items-center mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 text-primary"
              >
                <path d="M11 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
                <path d="M11 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
                <path d="M11 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
                <path d="M7 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
                <path d="M7 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
                <path d="M3 3a8 8 0 1 0 16 0 8 8 0 0 0-16 0z"/>
                <path d="M10.7 21A8 8 0 0 0 19 12.3"/>
                <path d="M5 12.3A8 8 0 0 0 10.3 3"/>
              </svg>
              <span className="font-medium">Sign Language</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 aspect-video rounded flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sign language avatar would appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDisplay;

