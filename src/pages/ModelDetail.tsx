
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Brain, Send, Upload, BarChart, Loader2, Languages } from "lucide-react";
import { Model, getModels, addMessageToHistory, getMessageHistory } from "@/services/modelService";
import { getAIResponse } from "@/services/aiService";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    document.title = model ? `${model.name} - AIMarket` : "AI Model - AIMarket";
  }, [model]);
  
  // Load model data
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        const models = getModels();
        const foundModel = models.find(m => m.id === parseInt(id));
        
        if (foundModel) {
          setModel(foundModel);
          // Add initial greeting message if model is ready
          if (foundModel.status === 'ready' && messages.length === 0) {
            const greeting = generateGreeting(foundModel);
            setMessages([
              {
                id: "greeting",
                content: greeting,
                role: 'assistant',
                timestamp: new Date()
              }
            ]);
          }
        } else {
          toast.error("Model not found");
          navigate("/models");
        }
      } catch (error) {
        console.error("Error loading model:", error);
        toast.error("Failed to load model");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModel();
  }, [id, navigate]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
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
      
      // Get response from real AI model based on category and user input
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
      
      // Add AI response to UI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
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
  
  // Render UI components based on model category
  const renderCategorySpecificUI = () => {
    if (!model) return null;
    
    switch (model.category) {
      case "Data Analysis":
        return (
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Data
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".csv,.xlsx,.json"
            />
            {selectedFile && (
              <Badge variant="outline" className="text-xs">
                {selectedFile.name}
              </Badge>
            )}
          </div>
        );
      
      case "Image Generation":
      case "Computer Vision":
        return (
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            {selectedFile && (
              <Badge variant="outline" className="text-xs">
                {selectedFile.name}
              </Badge>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Get icon based on model category
  const getCategoryIcon = () => {
    if (!model) return <Brain />;
    
    switch (model.category) {
      case "Text Generation":
        return <Brain />;
      case "Image Generation":
        return <Brain />;
      case "Audio":
        return <Brain />;
      case "Development":
        return <Brain />;
      case "Data Analysis":
        return <BarChart />;
      case "Computer Vision":
        return <Brain />;
      default:
        return <Brain />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading model...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!model) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Model Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The model you're looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate("/models")}>
              Back to Models
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-10">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={() => navigate("/models")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Models
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
            <div className="flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getCategoryIcon()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{model.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 hover:bg-primary/20 text-primary">
                      {model.category}
                    </Badge>
                    {model.status === 'ready' && (
                      <>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Ready
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Powered by GPT-4o
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'assistant' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getCategoryIcon()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'assistant'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                <Separator />
                
                <div className="p-4">
                  {renderCategorySpecificUI()}
                  
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        model.status !== 'ready'
                          ? "Model is still training..."
                          : model.category === "Data Analysis"
                          ? "Ask about your data or describe what you want to analyze..."
                          : model.category === "Image Generation"
                          ? "Describe the image you want to generate..."
                          : "Type your message..."
                      }
                      disabled={model.status !== 'ready' || isProcessing}
                      className="min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={model.status !== 'ready' || (!input.trim() && !selectedFile) || isProcessing}
                      className="self-end"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-2">About This Model</h2>
                <p className="text-muted-foreground mb-4">
                  {model.description}
                </p>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{model.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{model.rating.toFixed(1)}/5</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-2">How to Use</h2>
                <div className="space-y-4">
                  {model.category === "Text Generation" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model specializes in generating human-like text based on your prompts.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Type your prompt or question in the chat</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>The more specific your prompt, the better the results</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Ask for revisions if the output needs tweaking</span>
                        </li>
                      </ul>
                    </>
                  )}
                  
                  {model.category === "Image Generation" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model creates images based on your text descriptions.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Describe the image you want to create in detail</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>You can specify style, mood, lighting, and composition</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Upload reference images for better results</span>
                        </li>
                      </ul>
                    </>
                  )}
                  
                  {model.category === "Audio" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model works with audio processing, voice generation, and sound analysis.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Describe the voice or audio you want to generate</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>You can specify tone, accent, and emotion</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Ask for audio analysis or transcription</span>
                        </li>
                      </ul>
                    </>
                  )}
                  
                  {model.category === "Development" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model assists with coding, debugging, and software development tasks.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Ask coding questions or request code examples</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Share your code for debugging assistance</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Get help with algorithms, optimization, and best practices</span>
                        </li>
                      </ul>
                    </>
                  )}
                  
                  {model.category === "Data Analysis" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model helps analyze data, generate insights, and create visualizations.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Upload data files (CSV, Excel, JSON)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Ask specific questions about your data</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Request visualizations and statistical analysis</span>
                        </li>
                      </ul>
                    </>
                  )}
                  
                  {model.category === "Computer Vision" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This AI model analyzes and processes images and visual data.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Upload images for analysis</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Ask for object detection, classification, or image segmentation</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Get detailed descriptions of visual content</span>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelDetail;
