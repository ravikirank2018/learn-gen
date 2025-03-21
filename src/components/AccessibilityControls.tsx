
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

type AccessibilityOptions = {
  textToSpeech: boolean;
  highContrast: boolean;
  subtitles: boolean;
  signLanguage: boolean;
  textSize: 'normal' | 'large' | 'x-large';
};

type AccessibilityControlsProps = {
  onChange: (options: AccessibilityOptions) => void;
  className?: string;
};

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AccessibilityOptions>({
    textToSpeech: false,
    highContrast: false,
    subtitles: true,
    signLanguage: false,
    textSize: 'normal',
  });

  const handleChange = (key: keyof AccessibilityOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Accessibility options"
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
          className="text-gray-700 dark:text-gray-300"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 glass p-5 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-72 animate-fade-in z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Accessibility Options</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close accessibility menu">
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
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Text to Speech</label>
              <div 
                className={cn(
                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                  options.textToSpeech ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() => handleChange('textToSpeech', !options.textToSpeech)}
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    options.textToSpeech ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">High Contrast</label>
              <div 
                className={cn(
                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                  options.highContrast ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() => handleChange('highContrast', !options.highContrast)}
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    options.highContrast ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Subtitles</label>
              <div 
                className={cn(
                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                  options.subtitles ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() => handleChange('subtitles', !options.subtitles)}
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    options.subtitles ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Sign Language</label>
              <div 
                className={cn(
                  "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                  options.signLanguage ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() => handleChange('signLanguage', !options.signLanguage)}
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    options.signLanguage ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm">Text Size</label>
              <div className="flex mt-2 space-x-2">
                <button 
                  className={cn(
                    "flex-1 py-1 px-2 rounded text-sm font-medium",
                    options.textSize === 'normal' 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => handleChange('textSize', 'normal')}
                >
                  A
                </button>
                <button 
                  className={cn(
                    "flex-1 py-1 px-2 rounded text-sm font-medium",
                    options.textSize === 'large' 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => handleChange('textSize', 'large')}
                >
                  A+
                </button>
                <button 
                  className={cn(
                    "flex-1 py-1 px-2 rounded text-sm font-medium",
                    options.textSize === 'x-large' 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => handleChange('textSize', 'x-large')}
                >
                  A++
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;
