
import React from "react";
import ModelInfo from "./ModelInfo";
import ModelUsageGuide from "./ModelUsageGuide";
import { Model } from "@/services/modelService";

interface ModelDetailSidebarProps {
  model: Model;
  onApiKeySet?: () => void;
}

const ModelDetailSidebar = ({ model }: ModelDetailSidebarProps) => {
  return (
    <div className="space-y-6">
      <ModelInfo model={model} />
      <ModelUsageGuide category={model.category} />
    </div>
  );
};

export default ModelDetailSidebar;
