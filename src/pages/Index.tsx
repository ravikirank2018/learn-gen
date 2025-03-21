
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import ContentDisplay from '@/components/ContentDisplay';
import AIGenerator from '@/components/AIGenerator';
import useContentSearch from '@/hooks/useContentSearch';

const Index = () => {
  const { 
    content, 
    error, 
    isSearching, 
    isGenerating, 
    handleSearch, 
    handleGenerate 
  } = useContentSearch();

  return (
    <Layout>
      <Hero />
      
      <SearchSection 
        onSearch={handleSearch} 
        isSearching={isSearching} 
      />
      
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
