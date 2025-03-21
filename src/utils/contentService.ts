
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
  }
];

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
  
  // Return a random mock AI content
  const content = { ...mockAIContent[Math.floor(Math.random() * mockAIContent.length)] };
  
  // Customize the content based on the prompt
  content.title = `${prompt} (AI Generated)`;
  content.description = `AI-generated ${format} content about ${prompt}`;
  
  return content;
};
