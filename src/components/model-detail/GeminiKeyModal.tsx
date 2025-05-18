
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { setGeminiApiKey, isGeminiConfigured, clearGeminiApiKey } from "@/services/directGeminiService";

interface GeminiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeySet: () => void;
}

const GeminiKeyModal = ({ open, onOpenChange, onKeySet }: GeminiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(isGeminiConfigured());
  }, [open]);

  const handleSetKey = () => {
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      toast.success("Gemini API key set successfully");
      setApiKey("");
      onKeySet();
      onOpenChange(false);
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const handleClearKey = () => {
    clearGeminiApiKey();
    toast.success("Gemini API key removed");
    setHasKey(false);
    setApiKey("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Gemini API Key</DialogTitle>
          <DialogDescription>
            Enter your Google Gemini API key to enable AI responses.
            {!hasKey && (
              <div className="mt-2 text-sm text-muted-foreground">
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get an API key here
                </a>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={hasKey ? "••••••••••••••••••••••" : "Enter your API key"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          {hasKey && (
            <Button variant="destructive" onClick={handleClearKey} className="mr-auto">
              Remove Key
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSetKey}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiKeyModal;
