
import React from "react";
import { Card } from "@/components/ui/card";

interface ModelUsageGuideProps {
  category: string;
}

const ModelUsageGuide = ({ category }: ModelUsageGuideProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-2">How to Use</h2>
      <div className="space-y-4">
        {category === "Text Generation" && (
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
        
        {category === "Image Generation" && (
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
        
        {category === "Audio" && (
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
        
        {category === "Development" && (
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
        
        {category === "Data Analysis" && (
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
        
        {category === "Computer Vision" && (
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
  );
};

export default ModelUsageGuide;
