
import React, { useState, useEffect } from "react";
import ModelInfo from "./ModelInfo";
import ModelUsageGuide from "./ModelUsageGuide";
import { Model } from "@/services/modelService";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import GeminiKeyModal from "./GeminiKeyModal";
import { initializeGeminiApiKey, isGeminiConfigured } from "@/services/directGeminiService";

interface ModelDetailSidebarProps {
  model: Model;
  onApiKeySet?: () => void;
}

const ModelDetailSidebar = ({ model, onApiKeySet }: ModelDetailSidebarProps) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if key exists in localStorage on component mount
    const keyLoaded = initializeGeminiApiKey();
    setHasApiKey(keyLoaded);
  }, []);

  const handleKeySet = () => {
    setHasApiKey(true);
    if (onApiKeySet) {
      onApiKeySet();
    }
  };

  return (
    <div className="space-y-6">
      <ModelInfo model={model} />
      <ModelUsageGuide category={model.category} />
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">API Configuration</h3>
        <Button 
          variant={hasApiKey ? "outline" : "default"} 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowKeyModal(true)}
        >
          <Key className="h-4 w-4" />
          {hasApiKey ? "Change API Key" : "Set Gemini API Key"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          {hasApiKey 
            ? "Gemini API key is configured. AI responses are enabled."
            : "Set your Gemini API key to enable real AI responses."}
        </p>
      </div>
      
      <GeminiKeyModal 
        open={showKeyModal} 
        onOpenChange={setShowKeyModal}
        onKeySet={handleKeySet}
      />
    </div>
  );
};

export default ModelDetailSidebar;
