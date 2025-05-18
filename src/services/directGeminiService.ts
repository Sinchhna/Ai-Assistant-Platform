import { Model } from './modelService';

// Interface for Gemini AI Response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Function to get system prompt based on model description and category
const getSystemPrompt = (model: Model): string => {
  const basePrompt = `You are an AI assistant named "${model.name}" with expertise in ${model.category}.
Your specific purpose is: ${model.description}
`;

  let categorySpecificPrompt = '';
  
  switch (model.category) {
    case "Text Generation":
      categorySpecificPrompt = `
You excel at generating creative, coherent, and contextually relevant text.
You can write essays, stories, summaries, and other content based on user prompts.
Keep your responses focused on text generation tasks.`;
      break;
      
    case "Image Generation":
      categorySpecificPrompt = `
You help users create image descriptions that can be used for image generation.
You can't actually generate images, but you can provide detailed descriptions that would work well for image generation.
You should ask clarifying questions about style, subject, mood, and composition.`;
      break;
      
    case "Audio":
      categorySpecificPrompt = `
You specialize in audio-related tasks such as voice generation guidance, audio analysis, and voice style description.
You can explain audio concepts, describe voice characteristics, and help with audio-related queries.`;
      break;
      
    case "Development":
      categorySpecificPrompt = `
You are a coding assistant that helps with programming tasks.
You can write code, debug issues, optimize code, and explain programming concepts.
You should format code blocks using markdown triple backticks with the appropriate language specification.`;
      break;
      
    case "Data Analysis":
      categorySpecificPrompt = `
You specialize in data analysis, interpretation, and visualization.
You can discuss statistical methods, data cleaning approaches, and analysis techniques.
When users mention uploading data, explain how you would analyze it if you had access to it.`;
      break;
      
    case "Computer Vision":
      categorySpecificPrompt = `
You specialize in computer vision concepts and applications.
You can explain image analysis, object detection, and image segmentation.
When users mention uploading images, explain how you would analyze them if you had access to them.`;
      break;
  }
  
  return basePrompt + categorySpecificPrompt;
};

// Configuration for Gemini API
export interface GeminiConfig {
  apiKey: string | null;
}

// IMPORTANT: Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key
export const geminiConfig: GeminiConfig = {
  apiKey: 'YOUR_GEMINI_API_KEY_HERE',
};

// These functions are kept for backwards compatibility but modified for the new approach
export const setGeminiApiKey = (apiKey: string) => {
  console.log('Note: Using hardcoded API key instead of user input');
  return true;
};

export const initializeGeminiApiKey = () => {
  console.log('Using pre-configured Gemini API key');
  return true;
};

export const clearGeminiApiKey = () => {
  console.log('Note: Cannot clear hardcoded API key');
};

// Function to check if Gemini API is configured
export const isGeminiConfigured = (): boolean => {
  return !!geminiConfig.apiKey && geminiConfig.apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
};

// Call the Gemini API directly
const callGeminiAPI = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Function to send a message to Google Gemini and get a response
export const getDirectGeminiResponse = async (
  model: Model, 
  userInput: string, 
  messageHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> => {
  try {
    if (!geminiConfig.apiKey || geminiConfig.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('Please replace the placeholder with your actual Gemini API key in directGeminiService.ts');
    }

    // Create a combined prompt with system instructions and message history
    const systemPrompt = getSystemPrompt(model);
    
    // Format previous messages
    const formattedHistory = messageHistory
      .slice(-5) // Limit to last 5 messages to avoid token limits
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    // Combine system prompt, message history, and current user input
    const fullPrompt = `${systemPrompt}\n\n${
      formattedHistory ? `Previous conversation:\n${formattedHistory}\n\n` : ''
    }User: ${userInput}\n\nAssistant:`;
    
    console.log(`[Direct Gemini] Calling Gemini API for model: ${model.name} (${model.category})`);
    
    // Call Gemini API directly
    const response = await callGeminiAPI(fullPrompt, geminiConfig.apiKey);
    
    console.log(`[Direct Gemini] Got response from Gemini API: ${response.substring(0, 50)}...`);
    return `[model:gemini-pro] ${response}`;
  } catch (error) {
    console.error('[Direct Gemini] Error in getDirectGeminiResponse:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "I'm currently unable to process your request because the Gemini API key is not properly configured. Please update the API key in the directGeminiService.ts file.";
      }
    }
    
    // Return a generic error message
    return "I apologize, but I'm having trouble connecting to the Gemini service. Please check your API key configuration and internet connection.";
  }
};
