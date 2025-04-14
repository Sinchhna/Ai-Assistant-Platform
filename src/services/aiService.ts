
import { Model } from './modelService';
import { callOpenAIViaSupabase } from './supabaseAI';

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

// Function to send a message to OpenAI and get a response
export const getAIResponse = async (model: Model, userInput: string, messageHistory: Array<{role: 'user' | 'assistant', content: string}>): Promise<string> => {
  try {
    // Define the type for OpenAI messages
    type OpenAIMessage = {
      role: 'system' | 'user' | 'assistant';
      content: string;
    };

    // Construct the messages array for the API
    const messages: OpenAIMessage[] = [
      { 
        role: 'system', 
        content: getSystemPrompt(model) 
      }
    ];
    
    // Add message history, but limit to last 10 messages to avoid token limits
    const recentMessages = messageHistory.slice(-10);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    // Add the current user input
    messages.push({
      role: 'user',
      content: userInput
    });
    
    try {
      // First attempt to use Supabase Edge Function
      const systemPromptText = getSystemPrompt(model);
      const response = await callOpenAIViaSupabase(
        systemPromptText,
        messages,
        'gpt-4o' // Using the latest model
      );
      
      return response || "I'm sorry, I couldn't generate a response.";
    } catch (supabaseError) {
      console.warn("Error using Supabase Edge Function, falling back to simulated response:", supabaseError);
      
      // Fallback to simulated responses if Supabase call fails
      const categoryResponses = {
        "Text Generation": generateTextResponse(model, userInput),
        "Image Generation": generateImageResponse(model, userInput),
        "Audio": generateAudioResponse(model, userInput),
        "Development": generateDevelopmentResponse(model, userInput),
        "Data Analysis": generateDataAnalysisResponse(model, userInput),
        "Computer Vision": generateComputerVisionResponse(model, userInput)
      };
      
      return categoryResponses[model.category as keyof typeof categoryResponses] || 
        `I'm ${model.name}, an AI assistant trained on your specific requirements. Based on your description "${model.description}", I can help you with your specialized tasks. How can I assist you today?`;
    }
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    
    // Fallback response in case of API issues
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
};

// Fallback response generators for each category
function generateTextResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
    return `Hello! I'm ${model.name}, ready to help with your text generation needs.`;
  } else if (lowercaseInput.includes('how are you')) {
    return "I'm functioning optimally, thank you for asking! How can I assist with your text needs today?";
  } else if (lowercaseInput.includes('summarize') || lowercaseInput.includes('summary')) {
    return "I'd be happy to summarize that for you. Here's a concise version: [Generated summary based on your description would appear here]";
  } else if (lowercaseInput.includes('write') || lowercaseInput.includes('create')) {
    return "Here's a draft based on your request:\n\n[Generated text would appear here]\n\nWould you like me to refine this in any way?";
  } else {
    return `Based on your input, I would generate high-quality text content tailored to your needs. I've been trained specifically on ${model.name}'s parameters to ensure the content matches your description: "${model.description}".`;
  }
}

function generateImageResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('generate') || lowercaseInput.includes('create') || lowercaseInput.includes('make')) {
    return "I've generated an image based on your description. [In a real implementation, an actual image would be displayed here]";
  } else if (lowercaseInput.includes('style') || lowercaseInput.includes('artistic')) {
    return "I've created an artistic interpretation using the style you specified. [In a real implementation, an actual image would be displayed here]";
  } else if (lowercaseInput.includes('edit') || lowercaseInput.includes('modify')) {
    return "I've modified the image according to your instructions. [In a real implementation, the edited image would be displayed here]";
  } else if (lowercaseInput.includes('upload')) {
    return "I've received your image and can now make modifications or use it as a reference for generating new images.";
  } else {
    return "I can generate custom images based on your descriptions. What kind of image would you like me to create?";
  }
}

function generateAudioResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('voice') || lowercaseInput.includes('speak')) {
    return "I've generated the requested voice clip. [In a real implementation, audio would be playable here]";
  } else if (lowercaseInput.includes('translate') || lowercaseInput.includes('language')) {
    return "I've translated your audio to the requested language. [In a real implementation, translated audio would be playable here]";
  } else if (lowercaseInput.includes('accent') || lowercaseInput.includes('tone')) {
    return "I've adjusted the accent and tone as requested. [In a real implementation, modified audio would be playable here]";
  } else {
    return "I can generate voice recordings, analyze audio files, and perform various audio transformations. What would you like me to do?";
  }
}

function generateDevelopmentResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('code') || lowercaseInput.includes('function')) {
    return "Here's the code implementation based on your requirements:\n\n```javascript\n// Example code would appear here\nfunction exampleFunction() {\n  console.log('This is a placeholder for actual generated code');\n  return 'Success';\n}\n```\n\nIs this what you were looking for?";
  } else if (lowercaseInput.includes('debug') || lowercaseInput.includes('error')) {
    return "I've analyzed your code and found the following issues:\n\n1. [Example issue description]\n2. [Another example issue]\n\nHere's the corrected version:\n\n```javascript\n// Corrected code would appear here\n```";
  } else if (lowercaseInput.includes('optimize') || lowercaseInput.includes('improve')) {
    return "I've optimized your code for better performance. Here's the improved version:\n\n```javascript\n// Optimized code would appear here\n```\n\nThis should run approximately 30% faster than the original.";
  } else {
    return "I can help you with coding tasks, debugging, optimization, and software architecture. What specific development challenge are you facing?";
  }
}

function generateDataAnalysisResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('upload') || lowercaseInput.includes('file')) {
    return "I've received your data file and analyzed its contents. [In a real implementation, a summary of the uploaded data would appear here]";
  } else if (lowercaseInput.includes('graph') || lowercaseInput.includes('chart') || lowercaseInput.includes('visualization')) {
    return "I've created the requested data visualization. [In a real implementation, the graph/chart would be displayed here]";
  } else if (lowercaseInput.includes('predict') || lowercaseInput.includes('forecast')) {
    return "Based on the data patterns, here's my prediction for future trends:\n\n[Generated forecast details would appear here]";
  } else if (lowercaseInput.includes('correlate') || lowercaseInput.includes('relationship')) {
    return "I've analyzed the correlation between the variables you specified. Here's what I found:\n\n[Generated correlation analysis would appear here]";
  } else {
    return "I can help analyze data, create visualizations, identify patterns, and generate insights. Please upload your data or describe the analysis you'd like me to perform.";
  }
}

function generateComputerVisionResponse(model: Model, userInput: string): string {
  const lowercaseInput = userInput.toLowerCase();
  
  if (lowercaseInput.includes('upload') || lowercaseInput.includes('image')) {
    return "I've analyzed the image you uploaded. [In a real implementation, the analysis results would appear here]";
  } else if (lowercaseInput.includes('detect') || lowercaseInput.includes('find')) {
    return "I've detected the objects you specified in the image. [In a real implementation, marked-up image would be displayed here]";
  } else if (lowercaseInput.includes('segment') || lowercaseInput.includes('separate')) {
    return "I've segmented the image as requested. [In a real implementation, segmented image would be displayed here]";
  } else if (lowercaseInput.includes('recognize') || lowercaseInput.includes('identify')) {
    return "I've identified the following elements in the image:\n\n[Generated list of identified objects/features would appear here]";
  } else {
    return "I can analyze images to detect objects, identify features, perform segmentation, and provide detailed visual descriptions. Please upload an image or describe what you'd like me to analyze.";
  }
}

// Function to create a Supabase Edge Function endpoint for secure API calls
export const createSupabaseAIEndpoint = () => {
  // This would be implemented with Supabase Edge Functions
  // Will be added in a separate step
};
