
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

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
  const recognition = useRef<SpeechRecognition | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't have types for webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
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

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.current.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error', event.error);
        toast.error('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        // Auto restart if still listening
        if (isListening && recognition.current) {
          recognition.current.start();
        }
      };
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }

    // Initialize speech synthesis
    utterance.current = new SpeechSynthesisUtterance();
    
    return () => {
      if (recognition.current) {
        recognition.current.onresult = null;
        recognition.current.onerror = null;
        recognition.current.onend = null;
        try {
          recognition.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
      window.speechSynthesis.cancel();
    };
  }, [isListening]);

  useEffect(() => {
    if (isListening && recognition.current) {
      try {
        recognition.current.start();
        toast.info('Listening...');
      } catch (e) {
        console.log('Recognition already started');
      }
    } else if (!isListening && recognition.current) {
      try {
        recognition.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      // Extract parameters from voice input (basic parsing)
      let level = 'beginner'; // default
      let format = 'text'; // default
      
      if (transcript.toLowerCase().includes('intermediate')) {
        level = 'intermediate';
      } else if (transcript.toLowerCase().includes('advanced')) {
        level = 'advanced';
      }
      
      if (transcript.toLowerCase().includes('video')) {
        format = 'video';
      } else if (transcript.toLowerCase().includes('audio')) {
        format = 'audio';
      }
      
      onSubmit(transcript, level, format);
      setTranscript('');
    } else {
      toast.error('Please say something first');
    }
  };

  return (
    <div className={className}>
      <div className="glass p-6 rounded-xl shadow-lg border border-white/20">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Voice Interaction</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isListening ? 'Listening... Speak now!' : 'Click the microphone to start speaking'}
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-primary text-white'
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
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[100px] mb-4">
          {transcript ? transcript : 'Your spoken words will appear here...'}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Voice Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInteraction;
