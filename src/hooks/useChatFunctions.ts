
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Model, addMessageToHistory, getMessageHistory } from "@/services/modelService";
import { getAIResponse } from "@/services/aiService";
import { getDirectGeminiResponse, isGeminiConfigured } from "@/services/directGeminiService";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isRealAI?: boolean;
  modelName?: string;
}

export const useChatFunctions = (model: Model | null) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(isGeminiConfigured());

  const updateApiKeyStatus = () => {
    setApiKeyConfigured(isGeminiConfigured());
  };

  // Generate appropriate greeting based on model category
  const generateGreeting = (model: Model): string => {
    const category = model.category;
    
    switch (category) {
      case "Text Generation":
        return `Hello! I'm ${model.name}, an AI assistant trained to help with text generation tasks. How can I assist you today?`;
      case "Image Generation":
        return `Welcome! I'm ${model.name}, an AI image generation model. I can create images based on your descriptions. What would you like me to create?`;
      case "Audio":
        return `Hi there! I'm ${model.name}, an AI voice assistant. I can help with voice-related tasks. Feel free to ask me anything!`;
      case "Development":
        return `Hello developer! I'm ${model.name}, an AI coding assistant. I can help with programming questions, code reviews, and suggestions. What are you working on?`;
      case "Data Analysis":
        return `Welcome to ${model.name}! I'm an AI data analysis assistant. Upload your data or describe what insights you're looking for, and I'll help you analyze it.`;
      case "Computer Vision":
        return `Hello! I'm ${model.name}, an AI computer vision model. I can analyze images or video frames. Upload an image or describe what you're looking to identify.`;
      default:
        return `Hello! I'm ${model.name}, an AI assistant trained on your specifications. How can I help you today?`;
    }
  };

  // Handle file upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() && !selectedFile) return;
    
    if (!model) {
      toast.error("Model not available");
      return;
    }
    
    if (model.status !== 'ready') {
      toast.error("Model is still training");
      return;
    }
    
    // Create user message
    const userMessageContent = selectedFile 
      ? `[Uploaded ${selectedFile.name}] ${input}`
      : input;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userMessageContent,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setIsProcessing(true);
    
    try {
      // Save user message to history
      addMessageToHistory(model.id, 'user', userMessageContent);
      
      // Get message history for context
      const messageHistory = getMessageHistory()[model.id] || [];
      
      let response;
      
      // Try to use direct Gemini API first if configured
      if (isGeminiConfigured()) {
        try {
          // Get response from Gemini directly
          response = await getDirectGeminiResponse(
            model,
            userMessageContent,
            messageHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          );
        } catch (geminiError) {
          console.error("Error with direct Gemini API:", geminiError);
          // Fall back to the original method
          response = await getAIResponse(
            model, 
            userMessageContent,
            messageHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          );
        }
      } else {
        // Fall back to original method if Gemini API key not configured
        response = await getAIResponse(
          model, 
          userMessageContent,
          messageHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        );
      }
      
      // Save AI response to history
      addMessageToHistory(model.id, 'assistant', response);
      
      // Extract model information if available
      const modelInfo = {
        isRealAI: true,
        modelName: 'Simulated', // Default value
        cleanResponse: response // Start with the original response
      };
      
      // Check if the response contains model identifier
      if (response.includes('[model:gemini-pro]')) {
        modelInfo.modelName = 'Gemini Pro';
        // Remove the model identifier from the visible response
        modelInfo.cleanResponse = response.replace('[model:gemini-pro]', '').trim();
      }
      
      // Add AI response to UI with model information
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: modelInfo.cleanResponse, // Use the cleaned response without model tags
        role: 'assistant',
        timestamp: new Date(),
        // Add metadata to track if this was a real AI response and which model was used
        isRealAI: modelInfo.isRealAI,
        modelName: modelInfo.modelName
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    input,
    setInput,
    messages,
    setMessages,
    isProcessing,
    selectedFile,
    setSelectedFile,
    fileInputRef,
    apiKeyConfigured,
    updateApiKeyStatus,
    generateGreeting,
    handleUploadClick,
    handleFileChange,
    handleSendMessage,
    handleKeyDown
  };
};

export default useChatFunctions;
