
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Send, Upload, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import FileUploadButton from "./FileUploadButton";
import { Model } from "@/services/modelService";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isRealAI?: boolean;
  modelName?: string;
}

interface ChatInterfaceProps {
  model: Model;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isProcessing: boolean;
  handleSendMessage: () => void;
  getCategoryIcon: () => JSX.Element;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  renderCategorySpecificUI: () => JSX.Element | null;
}

const ChatInterface = ({
  model,
  messages,
  input,
  setInput,
  selectedFile,
  isProcessing,
  handleSendMessage,
  getCategoryIcon,
  fileInputRef,
  handleUploadClick,
  handleFileChange,
  handleKeyDown,
  renderCategorySpecificUI
}: ChatInterfaceProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
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
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Ready
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              getCategoryIcon={getCategoryIcon} 
            />
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
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept={
              model.category === "Image Generation" || model.category === "Computer Vision"
                ? "image/*"
                : model.category === "Data Analysis"
                ? ".csv,.xlsx,.json"
                : undefined
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
