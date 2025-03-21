
import { ContentItem } from '@/components/ContentDisplay';

// Mock data for demonstration purposes
const mockExternalContent: ContentItem[] = [
  {
    id: 'e1',
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning algorithms and their applications.',
    source: 'external',
    format: 'text',
    content: 'Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy. Machine learning is an important component of the growing field of data science.',
  },
  {
    id: 'e2',
    title: 'Understanding Quantum Computing',
    description: 'Explore the principles of quantum mechanics and how they apply to computing.',
    source: 'external',
    format: 'video',
    url: 'https://www.youtube.com/embed/JhHMJCUmq28',
    thumbnailUrl: 'https://img.youtube.com/vi/JhHMJCUmq28/maxresdefault.jpg',
  },
  {
    id: 'e3',
    title: 'The History of Ancient Rome',
    description: 'A comprehensive overview of the Roman civilization and its impact on the modern world.',
    source: 'external',
    format: 'audio',
    url: 'https://example.com/audio/ancient-rome.mp3',
  },
  {
    id: 'e4',
    title: 'Sign Language Basics',
    description: 'Learn the fundamentals of sign language communication.',
    source: 'external',
    format: 'signLanguage',
    url: 'https://example.com/videos/sign-language-basics.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/sign-language.jpg',
  }
];

const mockAIContent: ContentItem[] = [
  {
    id: 'a1',
    title: 'Machine Learning Algorithms Explained',
    description: 'An AI-generated explanation of common machine learning algorithms for beginners.',
    source: 'ai',
    format: 'text',
    content: 'Machine learning algorithms can be broadly categorized into supervised learning, unsupervised learning, and reinforcement learning. Supervised learning algorithms learn from labeled data, making predictions based on known examples. Common algorithms include linear regression, logistic regression, decision trees, and neural networks.',
  },
  {
    id: 'a2',
    title: 'Quantum Computing Basics',
    description: 'AI-generated video explaining quantum computing fundamentals.',
    source: 'ai',
    format: 'video',
    url: 'https://example.com/ai-videos/quantum-computing.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/quantum-computing.jpg',
  },
  {
    id: 'a3',
    title: 'Sign Language Tutorial',
    description: 'AI-generated sign language video tutorial.',
    source: 'ai',
    format: 'signLanguage',
    url: 'https://example.com/ai-videos/sign-language-tutorial.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/ai-sign-language.jpg',
  }
];

// Simulate speech-to-text processing
export const processVoiceInput = async (
  audioBlob: Blob
): Promise<string> => {
  // In a real implementation, this would send the audio to a speech-to-text API
  console.log('Processing voice input...');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock result
  return "What is machine learning and how does it work?";
};

// Simulate text-to-speech conversion
export const synthesizeSpeech = async (
  text: string
): Promise<void> => {
  // In a real implementation, this might use a more sophisticated TTS API
  console.log('Synthesizing speech:', text);
  
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    return Promise.resolve();
  } else {
    console.error('Speech synthesis not supported');
    return Promise.reject('Speech synthesis not supported');
  }
};

// Simulate sign language video generation
export const generateSignLanguageVideo = async (
  content: string
): Promise<{ url: string; thumbnailUrl: string }> => {
  console.log('Generating sign language video for:', content);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return mock result
  return {
    url: 'https://example.com/ai-videos/generated-sign-language.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/generated-sign-language.jpg'
  };
};

// Simulate content retrieval with a delay
export const searchContent = async (
  query: string, 
  level: string, 
  format: string
): Promise<ContentItem | null> => {
  console.log(`Searching for: ${query}, Level: ${level}, Format: ${format}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Randomly decide if we found external content or not (75% chance of finding)
  const foundExternal = Math.random() < 0.75;
  
  if (foundExternal) {
    // If sign language format is requested, prioritize sign language content
    if (format === 'signLanguage') {
      const signLanguageContent = mockExternalContent.find(item => item.format === 'signLanguage');
      if (signLanguageContent) return signLanguageContent;
    }
    
    // Return a random mock external content
    return mockExternalContent[Math.floor(Math.random() * mockExternalContent.length)];
  }
  
  return null;
};

// Simulate AI content generation with a delay
export const generateContent = async (
  prompt: string, 
  format: string
): Promise<ContentItem> => {
  console.log(`Generating content for: ${prompt}, Format: ${format}`);
  
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // For sign language format, return sign language AI content
  if (format === 'signLanguage') {
    const signLanguageContent = mockAIContent.find(item => item.format === 'signLanguage');
    if (signLanguageContent) {
      const content = { ...signLanguageContent };
      content.title = `${prompt} (AI Generated)`;
      content.description = `AI-generated sign language content about ${prompt}`;
      return content;
    }
  }
  
  // Return a random mock AI content
  const content = { ...mockAIContent[Math.floor(Math.random() * mockAIContent.length)] };
  
  // Customize the content based on the prompt
  content.title = `${prompt} (AI Generated)`;
  content.description = `AI-generated ${format} content about ${prompt}`;
  
  return content;
};
