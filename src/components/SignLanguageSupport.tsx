
import React from 'react';
import { cn } from '@/lib/utils';

type SignLanguageSupportProps = {
  content: string | null;
  isGenerating: boolean;
  className?: string;
};

const SignLanguageSupport: React.FC<SignLanguageSupportProps> = ({ 
  content, 
  isGenerating,
  className 
}) => {
  if (isGenerating) {
    return (
      <div className={cn("glass p-6 rounded-xl shadow-lg animate-pulse", className)}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Generating Sign Language...</h3>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-lg flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-400 animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={cn("glass p-6 rounded-xl shadow-lg", className)}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Sign Language Interpretation</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Search for content or generate with AI to see sign language interpretation
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 aspect-video rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto mb-4 text-gray-400"
            >
              <path d="M11 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M11 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M11 21a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M7 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M7 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M3 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M3 19a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/>
              <path d="M3 12a9 9 0 0 0 9 9"/>
              <path d="M3 12a9 9 0 0 1 9-9"/>
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Sign language avatar will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass p-6 rounded-xl shadow-lg", className)}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold">Sign Language Interpretation</h3>
      </div>
      <div className="bg-black aspect-video rounded-lg overflow-hidden">
        {/* Placeholder for sign language avatar */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4">
          <div className="text-center text-white">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto mb-4"
            >
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2"/>
              <path d="M9 13v2"/>
            </svg>
            <p className="text-lg font-medium mb-2">
              Sign Language Avatar
            </p>
            <p className="text-sm opacity-80">
              This is where the AI-generated sign language interpretation would be displayed.
              <br />In a production environment, this would be a video of an AI avatar signing the content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignLanguageSupport;
