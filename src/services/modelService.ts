
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
