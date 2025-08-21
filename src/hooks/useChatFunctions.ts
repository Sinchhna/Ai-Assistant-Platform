
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Model, addMessageToHistory, getMessageHistory } from "@/services/modelService";
import { getAIResponse } from "@/services/aiService";

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
  

  // Generate greeting that reflects the model's description, phrased in first person
  const generateGreeting = (model: Model): string => {
    const toFirstPerson = (text: string): string => {
      let t = text || "";
      // Common second→first person transformations
      t = t.replace(/\bYou are\b/gi, "I am");
      t = t.replace(/\byou're\b/gi, "I'm");
      t = t.replace(/\byou will\b/gi, "I will");
      t = t.replace(/\byou can\b/gi, "I can");
      t = t.replace(/\byou\b/gi, "I");
      t = t.replace(/\byour\b/gi, "my");
      t = t.replace(/\byours\b/gi, "mine");
      t = t.replace(/\byourself\b/gi, "myself");
      // Clean extra spaces
      t = t.replace(/\s+/g, " ").trim();
      return t;
    };

    const firstPersonDesc = toFirstPerson(model.description);
    return `Hello! I'm ${model.name}. ${firstPersonDesc}`;
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
      
      const response = await getAIResponse(
        model, 
        userMessageContent,
        messageHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );
      
      // Save AI response to history
      addMessageToHistory(model.id, 'assistant', response);
      
      // Detect and strip optional [model:...] prefix to mark real AI
      let isRealAI = false;
      let detectedModelName: string | undefined = undefined;
      let cleanResponse = response;
      const tagMatch = cleanResponse.match(/^\[model:([^\]]+)\]\s*/i);
      if (tagMatch) {
        isRealAI = true;
        detectedModelName = tagMatch[1];
        cleanResponse = cleanResponse.replace(tagMatch[0], "").trim();
      }
      
      // Add AI response to UI with model information
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cleanResponse, // Use the cleaned response without model tags
        role: 'assistant',
        timestamp: new Date(),
        // Add metadata to track if this was a real AI response and which model was used
        isRealAI: isRealAI,
        modelName: detectedModelName
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
    generateGreeting,
    handleUploadClick,
    handleFileChange,
    handleSendMessage,
    handleKeyDown
  };
};

export default useChatFunctions;
