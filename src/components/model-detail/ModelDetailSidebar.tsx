
import React, { useEffect, useState } from "react";
import ModelInfo from "./ModelInfo";
import ModelUsageGuide from "./ModelUsageGuide";
import { Model } from "@/services/modelService";
import { initializeGeminiApiKey, isGeminiConfigured } from "@/services/directGeminiService";

interface ModelDetailSidebarProps {
  model: Model;
  onApiKeySet?: () => void;
}

const ModelDetailSidebar = ({ model, onApiKeySet }: ModelDetailSidebarProps) => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    const keyLoaded = initializeGeminiApiKey();
    setHasApiKey(keyLoaded);
    
    if (keyLoaded && onApiKeySet) {
      onApiKeySet();
    }
  }, [onApiKeySet]);

  return (
    <div className="space-y-6">
      <ModelInfo model={model} />
      <ModelUsageGuide category={model.category} />
    </div>
  );
};

export default ModelDetailSidebar;
