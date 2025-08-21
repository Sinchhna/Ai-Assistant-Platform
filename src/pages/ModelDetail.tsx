
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, BarChart } from "lucide-react";
import { Model, getModels } from "@/services/modelService";
import { toast } from "sonner";
import ChatInterface from "@/components/model-detail/ChatInterface";
import ModelDetailSidebar from "@/components/model-detail/ModelDetailSidebar";
import ModelDetailLoader from "@/components/model-detail/ModelDetailLoader";
import ModelNotFound from "@/components/model-detail/ModelNotFound";
import useChatFunctions from "@/hooks/useChatFunctions";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isRealAI?: boolean;
  modelName?: string;
}

const ModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const greetingAddedRef = useRef(false);
  
  // Use the chat hook
  const {
    input,
    setInput,
    messages,
    setMessages,
    isProcessing,
    selectedFile,
    setSelectedFile,
    handleUploadClick,
    handleFileChange,
    handleSendMessage,
    handleKeyDown,
    generateGreeting
  } = useChatFunctions(model);
  
  useEffect(() => {
    document.title = model ? `${model.name} - AIMarket` : "AI Model - AIMarket";
  }, [model]);
  
  // Load model data (run on id change only) and add greeting once
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        if (!id) return;

        const models = getModels();
        const foundModel = models.find(m => m.id === parseInt(id));

        if (foundModel) {
          setModel(foundModel);
          // Add initial greeting message if model is ready and not added yet
          if (foundModel.status === 'ready' && !greetingAddedRef.current) {
            greetingAddedRef.current = true;
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
    // Reset greeting flag when model id changes
    return () => {
      greetingAddedRef.current = false;
    };
  }, [id, navigate]);
  
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
              <BarChart className="h-4 w-4" />
              Upload Data
            </Button>
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
              <ArrowLeft className="h-4 w-4" />
              Upload Image
            </Button>
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
    return <ModelDetailLoader />;
  }
  
  if (!model) {
    return <ModelNotFound />;
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
            <ChatInterface
              model={model}
              messages={messages}
              input={input}
              setInput={setInput}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isProcessing={isProcessing}
              handleSendMessage={handleSendMessage}
              getCategoryIcon={getCategoryIcon}
              fileInputRef={fileInputRef}
              handleUploadClick={handleUploadClick}
              handleFileChange={handleFileChange}
              handleKeyDown={handleKeyDown}
              renderCategorySpecificUI={renderCategorySpecificUI}
            />
            
            <ModelDetailSidebar model={model} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelDetail;
