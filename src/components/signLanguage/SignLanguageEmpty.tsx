
import React from 'react';
import { cn } from '@/lib/utils';

type SignLanguageEmptyProps = {
  className?: string;
};

const SignLanguageEmpty: React.FC<SignLanguageEmptyProps> = ({ className }) => {
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
};

export default SignLanguageEmpty;
