
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Model } from "@/services/modelService";

interface ModelInfoProps {
  model: Model;
}

const ModelInfo = ({ model }: ModelInfoProps) => {
  return (
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
  );
};

export default ModelInfo;
