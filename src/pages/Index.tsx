
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import ContentDisplay from '@/components/ContentDisplay';
import AIGenerator from '@/components/AIGenerator';
import VoiceInteraction from '@/components/VoiceInteraction';
import SignLanguageSupport from '@/components/SignLanguageSupport';
import ChatInterface from '@/components/ChatInterface';
import useContentSearch from '@/hooks/useContentSearch';

const Index = () => {
  const { 
    content, 
    error, 
    isSearching, 
    isGenerating, 
    isListening,
    setIsListening,
    isGeneratingSignLanguage,
    isSpeaking,
    handleSearch, 
    handleGenerate,
    speakText
  } = useContentSearch();

  // For deaf users, detect if user may need more visual assistance
  useEffect(() => {
    // Check for URL params, browser settings, or stored preferences
    const urlParams = new URLSearchParams(window.location.search);
    const accessibilityMode = urlParams.get('accessibility');
    const needsVisualMode = accessibilityMode === 'deaf' || localStorage.getItem('accessibilityMode') === 'deaf';
    
    if (needsVisualMode) {
      // Set video as preferred format
      localStorage.setItem('preferredFormat', 'video');
    }
  }, []);

  const handleChatSubmit = (message: string) => {
    // Extract format preference, defaulting to video for deaf users
    const format = localStorage.getItem('preferredFormat') || 'video';
    // Extract level from message or default to beginner
    const level = message.toLowerCase().includes('advanced') 
      ? 'advanced' 
      : message.toLowerCase().includes('intermediate') 
        ? 'intermediate' 
        : 'beginner';
    
    // Call the search function
    handleSearch(message, level, format);
  };

  return (
    <Layout>
      <div className="sr-only" aria-live="polite">
        Educational content search application. Use voice controls or text chat to search for content.
        Press space key to start or stop voice recognition.
      </div>
      
      <Hero />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SearchSection 
              onSearch={handleSearch} 
              isSearching={isSearching} 
            />
            
            <div className="mt-8">
              <VoiceInteraction
                onSubmit={handleSearch}
                isListening={isListening}
                setIsListening={setIsListening}
                disabled={isSpeaking}
              />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <ChatInterface 
              onSubmit={handleChatSubmit}
              isProcessing={isSearching || isGenerating}
              className="min-h-[400px]"
              placeholder="Ask for videos with captions or any educational content..."
            />
          </div>
        </div>
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ContentDisplay 
              content={content} 
              isLoading={isSearching || isGenerating} 
              error={error}
              speakText={speakText}
            />
          </div>
          <div>
            <SignLanguageSupport 
              content={content?.content || null}
              isGenerating={isGeneratingSignLanguage}
            />
          </div>
        </div>
      </div>
      
      <AIGenerator 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />
    </Layout>
  );
};

export default Index;
