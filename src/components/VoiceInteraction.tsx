
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

type VoiceInteractionProps = {
  onSubmit: (query: string, level: string, format: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  className?: string;
};

const VoiceInteraction: React.FC<VoiceInteractionProps> = ({
  onSubmit,
  isListening,
  setIsListening,
  className
}) => {
  const [transcript, setTranscript] = useState('');
  const [autoRestart, setAutoRestart] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedFormat, setSelectedFormat] = useState('text');
  const recognition = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // If we have a final transcript, use that, otherwise use the interim
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        // Reset timeout if we're getting speech
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        
        // Show user-friendly error messages
        if (event.error === 'no-speech') {
          toast.warning("I didn't hear anything. Please try speaking again.");
        } else if (event.error === 'audio-capture') {
          toast.error("Can't access your microphone. Please check your browser permissions.");
        } else if (event.error === 'not-allowed') {
          toast.error("Microphone access is blocked. Please allow microphone access in your browser settings.");
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        
        setIsListening(false);
      };

      recognition.current.onend = () => {
        if (isListening && recognition.current && autoRestart) {
          try {
            recognition.current.start();
          } catch (e) {
            console.log('Recognition already started or other error', e);
          }
        } else {
          setIsListening(false);
        }
      };
      
      recognition.current.onspeechend = () => {
        // If speech ends, wait a moment then stop listening if no new speech is detected
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = window.setTimeout(() => {
          if (recognition.current && isListening) {
            try {
              recognition.current.stop();
              toast.info("Speech completed. Click to start listening again.");
              setIsListening(false);
            } catch (e) {
              console.log('Error stopping recognition', e);
            }
          }
        }, 2000);
      };
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      if (recognition.current) {
        recognition.current.onresult = null;
        recognition.current.onerror = null;
        recognition.current.onend = null;
        recognition.current.onspeechend = null;
        try {
          recognition.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
      
      window.speechSynthesis && window.speechSynthesis.cancel();
    };
  }, [isListening, autoRestart]);

  // Start/stop recognition based on isListening state
  useEffect(() => {
    if (isListening && recognition.current) {
      try {
        recognition.current.start();
        toast.info('Listening... Speak now!', {
          duration: 3000,
        });
      } catch (e) {
        console.log('Recognition already started or error', e);
      }
    } else if (!isListening && recognition.current) {
      try {
        recognition.current.stop();
      } catch (e) {
        console.log('Recognition already stopped or error', e);
      }
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      // Try to detect level from transcript
      let detectedLevel = selectedLevel;
      if (transcript.toLowerCase().includes('beginner')) {
        detectedLevel = 'beginner';
      } else if (transcript.toLowerCase().includes('intermediate')) {
        detectedLevel = 'intermediate';
      } else if (transcript.toLowerCase().includes('advanced')) {
        detectedLevel = 'advanced';
      }
      
      // Try to detect format from transcript
      let detectedFormat = selectedFormat;
      if (transcript.toLowerCase().includes('video')) {
        detectedFormat = 'video';
      } else if (transcript.toLowerCase().includes('audio')) {
        detectedFormat = 'audio';
      } else if (transcript.toLowerCase().includes('sign') || 
                 transcript.toLowerCase().includes('language')) {
        detectedFormat = 'signLanguage';
      }
      
      onSubmit(transcript, detectedLevel, detectedFormat);
      setTranscript('');
      toast.success('Query submitted!');
    } else {
      toast.error('Please say something first');
    }
  };

  // Function to check if browser supports speech recognition
  const isSpeechRecognitionSupported = () => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  };

  return (
    <div className={className}>
      <div className="glass p-6 rounded-xl shadow-lg border border-white/20">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Voice Interaction</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isListening 
              ? 'Listening... Speak now!' 
              : 'Click the microphone to start speaking'}
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          {isSpeechRecognitionSupported() ? (
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
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
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
          ) : (
            <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300">
              Speech recognition is not supported in your browser.
            </div>
          )}
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[100px] mb-4">
          {transcript ? transcript : 'Your spoken words will appear here...'}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Difficulty Level
            </label>
            <select
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Content Format
            </label>
            <select
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="signLanguage">Sign Language</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!transcript.trim() || !isSpeechRecognitionSupported()}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Voice Query
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInteraction;
