
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  acceptTypes: string;
  selectedFile: File | null;
  handleUploadClick: () => void;
}

const FileUploadButton = ({ acceptTypes, selectedFile, handleUploadClick }: FileUploadButtonProps) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleUploadClick}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload {acceptTypes === "image/*" ? "Image" : "Data"}
      </Button>
      {selectedFile && (
        <Badge variant="outline" className="text-xs">
          {selectedFile.name}
        </Badge>
      )}
    </div>
  );
};

export default FileUploadButton;
