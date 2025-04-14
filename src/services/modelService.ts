
// Model interfaces
export interface Model {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  image?: string; // For compatibility with existing ModelCard
  price?: number; // For compatibility with existing ModelCard
  status: 'training' | 'ready' | 'failed';
  createdAt: string;
  trainingProgress?: number;
  rating: number;
  reviews: number;
}

interface MessageHistory {
  modelId: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

// Get models from localStorage
export const getModels = (): Model[] => {
  const storedModels = localStorage.getItem('models');
  return storedModels ? JSON.parse(storedModels) : [];
};

// Save models to localStorage
export const saveModels = (models: Model[]): void => {
  localStorage.setItem('models', JSON.stringify(models));
};

// Create a new model
export const createModel = (modelData: Omit<Model, 'id' | 'status' | 'createdAt' | 'trainingProgress' | 'rating' | 'reviews'>): Model => {
  const models = getModels();
  
  // Generate a new ID (simple approach)
  const newId = models.length > 0 
    ? Math.max(...models.map(model => model.id)) + 1 
    : 101;
  
  // Create new model with default values
  const newModel: Model = {
    ...modelData,
    id: newId,
    status: 'training',
    createdAt: new Date().toISOString(),
    trainingProgress: 0,
    rating: 0,
    reviews: 0,
    // For compatibility with ModelCard
    image: modelData.imageUrl
  };
  
  // Add to models list
  models.push(newModel);
  saveModels(models);
  
  return newModel;
};

// Update a model
export const updateModel = (model: Model): Model => {
  const models = getModels();
  const index = models.findIndex(m => m.id === model.id);
  
  if (index !== -1) {
    models[index] = model;
    saveModels(models);
  }
  
  return model;
};

// Delete a model
export const deleteModel = (id: number): void => {
  const models = getModels();
  const filteredModels = models.filter(model => model.id !== id);
  saveModels(filteredModels);
  
  // Also delete any message history for this model
  const messageHistory = getMessageHistory();
  if (messageHistory[id]) {
    delete messageHistory[id];
    saveMessageHistory(messageHistory);
  }
};

// Get message history for all models
export const getMessageHistory = (): Record<number, MessageHistory['messages']> => {
  const storedHistory = localStorage.getItem('messageHistory');
  return storedHistory ? JSON.parse(storedHistory) : {};
};

// Save message history for all models
export const saveMessageHistory = (history: Record<number, MessageHistory['messages']>): void => {
  localStorage.setItem('messageHistory', JSON.stringify(history));
};

// Add message to history
export const addMessageToHistory = (
  modelId: number, 
  role: 'user' | 'assistant', 
  content: string
): void => {
  const history = getMessageHistory();
  
  if (!history[modelId]) {
    history[modelId] = [];
  }
  
  history[modelId].push({
    role,
    content,
    timestamp: new Date().toISOString()
  });
  
  saveMessageHistory(history);
};

// Simulate AI model training process
export const simulateTraining = (modelId: number): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const models = getModels();
      const modelIndex = models.findIndex(m => m.id === modelId);
      
      if (modelIndex === -1) {
        clearInterval(interval);
        return resolve();
      }
      
      const model = models[modelIndex];
      
      // Increment progress
      const newProgress = (model.trainingProgress || 0) + Math.floor(Math.random() * 10) + 5;
      
      if (newProgress >= 100) {
        // Training complete
        models[modelIndex] = {
          ...model,
          status: 'ready',
          trainingProgress: 100,
          rating: (Math.random() * 1) + 4, // Random rating between 4-5
          reviews: Math.floor(Math.random() * 10) + 1, // Random number of reviews
        };
        saveModels(models);
        clearInterval(interval);
        resolve();
      } else {
        // Update progress
        models[modelIndex] = {
          ...model,
          trainingProgress: newProgress
        };
        saveModels(models);
      }
    }, 800); // Update every 800ms
  });
};

// Simulate AI response based on model category and user input
export const simulateAIResponse = (model: Model, userInput: string): Promise<string> => {
  return new Promise((resolve) => {
    // Add a delay to simulate thinking time
    const thinkingTime = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Store the message in history
      addMessageToHistory(model.id, 'user', userInput);
      
      let response = '';
      const lowercaseInput = userInput.toLowerCase();
      
      // Generate response based on model category
      switch (model.category) {
        case "Text Generation":
          if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
            response = `Hello! I'm ${model.name}, ready to help with your text generation needs.`;
          } else if (lowercaseInput.includes('how are you')) {
            response = "I'm functioning optimally, thank you for asking! How can I assist with your text needs today?";
          } else if (lowercaseInput.includes('summarize') || lowercaseInput.includes('summary')) {
            response = "I'd be happy to summarize that for you. Here's a concise version: [Generated summary based on your description would appear here]";
          } else if (lowercaseInput.includes('write') || lowercaseInput.includes('create')) {
            response = "Here's a draft based on your request:\n\n[Generated text would appear here]\n\nWould you like me to refine this in any way?";
          } else {
            response = `Based on your input, I would generate high-quality text content tailored to your needs. I've been trained specifically on ${model.name}'s parameters to ensure the content matches your description: "${model.description}".`;
          }
          break;
          
        case "Image Generation":
          if (lowercaseInput.includes('generate') || lowercaseInput.includes('create') || lowercaseInput.includes('make')) {
            response = "I've generated an image based on your description. [In a real implementation, an actual image would be displayed here]";
          } else if (lowercaseInput.includes('style') || lowercaseInput.includes('artistic')) {
            response = "I've created an artistic interpretation using the style you specified. [In a real implementation, an actual image would be displayed here]";
          } else if (lowercaseInput.includes('edit') || lowercaseInput.includes('modify')) {
            response = "I've modified the image according to your instructions. [In a real implementation, the edited image would be displayed here]";
          } else if (lowercaseInput.includes('upload')) {
            response = "I've received your image and can now make modifications or use it as a reference for generating new images.";
          } else {
            response = "I can generate custom images based on your descriptions. What kind of image would you like me to create?";
          }
          break;
          
        case "Audio":
          if (lowercaseInput.includes('voice') || lowercaseInput.includes('speak')) {
            response = "I've generated the requested voice clip. [In a real implementation, audio would be playable here]";
          } else if (lowercaseInput.includes('translate') || lowercaseInput.includes('language')) {
            response = "I've translated your audio to the requested language. [In a real implementation, translated audio would be playable here]";
          } else if (lowercaseInput.includes('accent') || lowercaseInput.includes('tone')) {
            response = "I've adjusted the accent and tone as requested. [In a real implementation, modified audio would be playable here]";
          } else {
            response = "I can generate voice recordings, analyze audio files, and perform various audio transformations. What would you like me to do?";
          }
          break;
          
        case "Development":
          if (lowercaseInput.includes('code') || lowercaseInput.includes('function')) {
            response = "Here's the code implementation based on your requirements:\n\n```javascript\n// Example code would appear here\nfunction exampleFunction() {\n  console.log('This is a placeholder for actual generated code');\n  return 'Success';\n}\n```\n\nIs this what you were looking for?";
          } else if (lowercaseInput.includes('debug') || lowercaseInput.includes('error')) {
            response = "I've analyzed your code and found the following issues:\n\n1. [Example issue description]\n2. [Another example issue]\n\nHere's the corrected version:\n\n```javascript\n// Corrected code would appear here\n```";
          } else if (lowercaseInput.includes('optimize') || lowercaseInput.includes('improve')) {
            response = "I've optimized your code for better performance. Here's the improved version:\n\n```javascript\n// Optimized code would appear here\n```\n\nThis should run approximately 30% faster than the original.";
          } else {
            response = "I can help you with coding tasks, debugging, optimization, and software architecture. What specific development challenge are you facing?";
          }
          break;
          
        case "Data Analysis":
          if (lowercaseInput.includes('upload') || lowercaseInput.includes('file')) {
            response = "I've received your data file and analyzed its contents. [In a real implementation, a summary of the uploaded data would appear here]";
          } else if (lowercaseInput.includes('graph') || lowercaseInput.includes('chart') || lowercaseInput.includes('visualization')) {
            response = "I've created the requested data visualization. [In a real implementation, the graph/chart would be displayed here]";
          } else if (lowercaseInput.includes('predict') || lowercaseInput.includes('forecast')) {
            response = "Based on the data patterns, here's my prediction for future trends:\n\n[Generated forecast details would appear here]";
          } else if (lowercaseInput.includes('correlate') || lowercaseInput.includes('relationship')) {
            response = "I've analyzed the correlation between the variables you specified. Here's what I found:\n\n[Generated correlation analysis would appear here]";
          } else {
            response = "I can help analyze data, create visualizations, identify patterns, and generate insights. Please upload your data or describe the analysis you'd like me to perform.";
          }
          break;
          
        case "Computer Vision":
          if (lowercaseInput.includes('upload') || lowercaseInput.includes('image')) {
            response = "I've analyzed the image you uploaded. [In a real implementation, the analysis results would appear here]";
          } else if (lowercaseInput.includes('detect') || lowercaseInput.includes('find')) {
            response = "I've detected the objects you specified in the image. [In a real implementation, marked-up image would be displayed here]";
          } else if (lowercaseInput.includes('segment') || lowercaseInput.includes('separate')) {
            response = "I've segmented the image as requested. [In a real implementation, segmented image would be displayed here]";
          } else if (lowercaseInput.includes('recognize') || lowercaseInput.includes('identify')) {
            response = "I've identified the following elements in the image:\n\n[Generated list of identified objects/features would appear here]";
          } else {
            response = "I can analyze images to detect objects, identify features, perform segmentation, and provide detailed visual descriptions. Please upload an image or describe what you'd like me to analyze.";
          }
          break;
          
        default:
          response = `I'm ${model.name}, an AI assistant trained on your specific requirements. Based on your description "${model.description}", I can help you with your specialized tasks. How can I assist you today?`;
      }
      
      // Store the AI response in history
      addMessageToHistory(model.id, 'assistant', response);
      
      resolve(response);
    }, thinkingTime);
  });
};
