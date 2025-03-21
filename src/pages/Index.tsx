
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import ContentDisplay from '@/components/ContentDisplay';
import AIGenerator from '@/components/AIGenerator';
import VoiceInteraction from '@/components/VoiceInteraction';
import SignLanguageSupport from '@/components/SignLanguageSupport';
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
    handleSearch, 
    handleGenerate 
  } = useContentSearch();

  return (
    <Layout>
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
              />
            </div>
          </div>
          
          <div>
            <SignLanguageSupport 
              content={content?.content || null}
              isGenerating={isGeneratingSignLanguage}
            />
          </div>
        </div>
      </div>
      
      <div className="container max-w-4xl mx-auto px-4 pb-16">
        <ContentDisplay 
          content={content} 
          isLoading={isSearching || isGenerating} 
          error={error} 
        />
      </div>
      
      <AIGenerator 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />
    </Layout>
  );
};

export default Index;
