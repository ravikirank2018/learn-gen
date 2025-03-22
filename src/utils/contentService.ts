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
  },
  {
    id: 'e5',
    title: 'Data Structures Fundamentals',
    description: 'Learn about arrays, linked lists, stacks, queues, trees, and graphs.',
    source: 'external',
    format: 'text',
    content: 'Data structures are specialized formats for organizing, processing, retrieving and storing data. They provide a way to manage large amounts of data efficiently for uses such as large databases and internet indexing services. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs.',
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

// Improved text-to-speech conversion with better reliability
export const synthesizeSpeech = async (
  text: string,
  voiceIndex = 0 // default voice index
): Promise<boolean> => {
  console.log('Synthesizing speech:', text);
  
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // Chrome sometimes needs a workaround for voices array
      if (voices.length === 0) {
        // Set a timeout to wait for voices to be loaded
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            configureAndSpeak();
          } else {
            // If still no voices, try with default voice
            window.speechSynthesis.speak(utterance);
            resolve(true);
          }
        }, 200);
        
        // Also set up the onvoiceschanged event as a backup
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            configureAndSpeak();
          }
        };
      } else {
        // Voices are already loaded, proceed directly
        configureAndSpeak();
      }
      
      function configureAndSpeak() {
        // Select a voice (preferring English voices)
        const englishVoices = voices.filter(voice => 
          voice.lang.includes('en-')
        );
        
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[voiceIndex % englishVoices.length];
        } else if (voices.length > 0) {
          utterance.voice = voices[voiceIndex % voices.length];
        }
        
        // Set other properties
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Handle events
        utterance.onend = () => {
          console.log('Speech synthesis completed successfully');
          resolve(true);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          
          // Try again with a simpler approach as fallback
          try {
            window.speechSynthesis.cancel();
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(fallbackUtterance);
            console.log('Using fallback speech synthesis');
            resolve(true);
          } catch (e) {
            console.error('Fallback speech synthesis failed:', e);
            reject('Speech synthesis failed');
          }
        };
        
        // Add a safety timeout to resolve the promise
        // in case the onend event doesn't fire
        const safetyTimeout = setTimeout(() => {
          console.log('Safety timeout triggered for speech synthesis');
          resolve(true);
        }, text.length * 50 + 3000); // Estimate based on text length + buffer
        
        // Speak
        window.speechSynthesis.speak(utterance);
        
        // Chrome sometimes pauses speech synthesis when in background
        // This keeps it running
        if (window.navigator.userAgent.includes('Chrome')) {
          const speechUtterChars = text.length;
          const estimatedDuration = speechUtterChars * 50 + 3000;
          
          // Keep speech synthesis active in Chrome
          const intervalId = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              clearInterval(intervalId);
              clearTimeout(safetyTimeout);
            } else {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
          
          // Clear interval after estimated duration
          setTimeout(() => {
            clearInterval(intervalId);
          }, estimatedDuration);
        }
      }
    } else {
      console.error('Speech synthesis not supported');
      reject('Speech synthesis not supported');
    }
  });
};

// Simulate sign language video generation
export const generateSignLanguageVideo = async (
  content: string
): Promise<{ url: string; thumbnailUrl: string }> => {
  console.log('Generating sign language video for:', content);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // In a real implementation, this would call a service like SignAll API
  // or similar to generate an actual sign language video
  
  // Return mock result
  return {
    url: 'https://example.com/ai-videos/generated-sign-language.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/generated-sign-language.jpg'
  };
};

// New function to search web for content
export const searchWebForContent = async (
  query: string,
  level: string,
  format: string
): Promise<ContentItem | null> => {
  console.log(`Searching web for: ${query}, Level: ${level}, Format: ${format}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // In a real implementation, this would call a web search API like Google Custom Search,
    // Bing Search API, or a similar service. For this mock implementation, we'll simulate
    // a successful search with fabricated content.

    // Extract main topic from query by removing filler words
    const cleanQuery = query.replace(/^(tell me|say) about (a|an|the)?/i, '').trim();
    const topic = cleanQuery || query;
    
    // Format the title properly
    const titleWords = topic.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const result: ContentItem = {
      id: `web-${Date.now()}`,
      title: titleWords,
      description: `Web search results for "${topic}" at ${level} level`,
      source: 'external',
      format: format as 'text' | 'video' | 'audio' | 'signLanguage',
    };
    
    // Generate different content based on format and topic
    switch(format) {
      case 'text':
        result.content = generateTextContent(topic, level);
        break;
      case 'video':
        result.url = 'https://www.youtube.com/embed/JhHMJCUmq28'; // Example video
        result.thumbnailUrl = 'https://img.youtube.com/vi/JhHMJCUmq28/maxresdefault.jpg';
        break;
      case 'audio':
        // In a real implementation, this could be a text-to-speech conversion of web content
        result.url = 'https://example.com/audio/generated-audio.mp3'; // This would be a real URL in production
        result.content = `Audio explanation about ${topic} at ${level} level. In a real implementation, this would be actual content converted to speech.`;
        break;
      case 'signLanguage':
        result.url = 'https://example.com/videos/sign-language-explanation.mp4'; // This would be a real URL in production
        result.thumbnailUrl = 'https://example.com/thumbnails/sign-language.jpg';
        break;
    }
    
    return result;
  } catch (error) {
    console.error('Error searching web for content:', error);
    return null;
  }
};

// Helper function to generate topic-specific content
function generateTextContent(topic: string, level: string): string {
  // Normalize the topic to lowercase for comparison
  const normalizedTopic = topic.toLowerCase();
  
  // Generate content based on the topic
  if (normalizedTopic.includes('cloud computing')) {
    return `Cloud computing is a technology that allows users to access and use computing resources (like servers, storage, databases, networking, software) over the internet ("the cloud") instead of owning and maintaining physical infrastructure.

Key characteristics of cloud computing include:
- On-demand self-service: Users can provision resources as needed without human interaction
- Broad network access: Services are available over the network and accessible through standard mechanisms
- Resource pooling: Provider's resources are pooled to serve multiple consumers
- Rapid elasticity: Resources can be scaled up or down quickly based on demand
- Measured service: Resource usage is monitored, controlled, and reported

The main service models are:
1. Infrastructure as a Service (IaaS): Provides virtualized computing resources
2. Platform as a Service (PaaS): Offers hardware and software tools over the internet
3. Software as a Service (SaaS): Delivers software applications over the internet

Popular cloud providers include Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform.`;
  } 
  else if (normalizedTopic.includes('artificial intelligence') || normalizedTopic.includes('ai')) {
    return `Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.

Key concepts in AI include:
- Machine Learning: Systems that learn from data without being explicitly programmed
- Neural Networks: Computing systems inspired by the human brain's structure
- Deep Learning: Advanced neural networks with multiple layers
- Natural Language Processing: Enabling computers to understand human language
- Computer Vision: Allowing machines to interpret and process visual information

AI applications are widespread in our daily lives, from virtual assistants like Siri and Alexa to recommendation systems on streaming platforms, autonomous vehicles, fraud detection systems, and medical diagnosis tools.

The field continues to evolve rapidly, with ongoing research in areas like reinforcement learning, generative AI, and ethical AI development.`;
  }
  else if (normalizedTopic.includes('blockchain')) {
    return `Blockchain is a distributed digital ledger technology that records transactions across many computers so that any involved record cannot be altered retroactively without altering all subsequent blocks.

Key features of blockchain include:
- Decentralization: No single entity controls the network
- Transparency: All transactions are visible to anyone with access to the system
- Immutability: Once recorded, data cannot be altered
- Security: Cryptographic techniques secure transactions
- Consensus: Network participants agree on the validity of transactions

Originally created for Bitcoin cryptocurrency, blockchain technology has expanded to various applications:
- Cryptocurrencies (Bitcoin, Ethereum, etc.)
- Smart contracts that execute automatically when conditions are met
- Supply chain tracking and verification
- Digital identity management
- Voting systems
- Decentralized finance (DeFi) applications

While blockchain offers many advantages, it also faces challenges related to scalability, energy consumption, regulatory concerns, and integration with existing systems.`;
  }
  else {
    // Generic content for any other topic
    return `Here is information about ${topic} at ${level} level. 

${topic} is an important concept in modern technology and continues to evolve rapidly. The fundamentals include understanding its core principles, applications, and impact on various industries.

Key aspects of ${topic} include:
- Definition and basic concepts
- Historical development and evolution
- Current applications and use cases
- Future trends and potential developments
- Benefits and challenges

For ${level} learners, it's important to focus on building a solid foundation of knowledge before exploring more advanced concepts. Resources like online courses, tutorials, and hands-on projects can help deepen understanding of ${topic}.

As technology advances, staying updated with the latest developments in ${topic} will be valuable for both personal and professional growth.`;
  }
}

// Improved search content function that better matches queries
export const searchContent = async (
  query: string, 
  level: string, 
  format: string
): Promise<ContentItem | null> => {
  console.log(`Searching for: ${query}, Level: ${level}, Format: ${format}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Add keyword matching for data structures
  const keywords = {
    'data structure': ['e5'],
    'machine learning': ['e1'],
    'quantum': ['e2'],
    'rome': ['e3'],
    'sign language': ['e4']
  };
  
  // Check if the query contains any of our keywords
  let matchedContent = null;
  
  for (const [keyword, ids] of Object.entries(keywords)) {
    if (query.toLowerCase().includes(keyword.toLowerCase())) {
      // Find the first matching content item
      for (const id of ids) {
        const item = mockExternalContent.find(item => item.id === id);
        if (item && (format === 'all' || format === item.format)) {
          matchedContent = item;
          break;
        }
      }
      if (matchedContent) break;
    }
  }
  
  // If no keyword match found but we're asked for sign language specifically
  if (!matchedContent && format === 'signLanguage') {
    const signLanguageContent = mockExternalContent.find(item => item.format === 'signLanguage');
    if (signLanguageContent) return signLanguageContent;
  }
  
  // If we have a match, return it
  if (matchedContent) {
    return matchedContent;
  }
  
  // If no match found, return null to trigger web search
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
