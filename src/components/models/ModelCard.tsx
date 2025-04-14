
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, Clock, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Model } from "@/services/modelService";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type LegacyModel = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

interface ModelCardProps {
  model: Model | LegacyModel;
  delay?: number;
  onDelete?: (model: Model | LegacyModel) => void;
}

const ModelCard = ({ model, delay = 0, onDelete }: ModelCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Helper function to check if it's a new model (has status)
  const isNewModel = (model: any): model is Model => {
    return 'status' in model;
  };
  
  // Get image source based on model type
  const getImageSrc = () => {
    if (isNewModel(model)) {
      return model.imageUrl || model.image;
    }
    return model.image;
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Navigate to model detail page on click
  const handleCardClick = () => {
    if (isNewModel(model) && model.status === 'training') {
      return; // Prevent clicking on training models
    }
    
    // Navigate to the model detail page
    window.location.href = `/model/${model.id}`;
  };
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-500 hover:shadow-lg group cursor-pointer ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`absolute inset-0 bg-secondary/70 backdrop-blur-sm shimmer ${imageLoaded ? 'hidden' : 'block'}`} />
        <img 
          src={getImageSrc()}
          alt={model.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <Badge 
          className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground"
        >
          {model.category}
        </Badge>
        
        {isNewModel(model) && model.status === 'training' && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col justify-center items-center p-4">
            <Brain className="h-10 w-10 text-primary animate-pulse mb-2" />
            <h3 className="font-medium text-base mb-1">Training in Progress</h3>
            <p className="text-xs text-muted-foreground mb-3">AI model is learning from your data</p>
            <Progress value={model.trainingProgress || 0} className="h-1.5 w-3/4 mb-2" />
            <p className="text-xs">{model.trainingProgress || 0}% Complete</p>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{model.name}</h3>
          {!isNewModel(model) && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              ${model.price}
            </Badge>
          )}
          {isNewModel(model) && model.status === 'ready' && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Ready
            </Badge>
          )}
          {isNewModel(model) && model.status === 'training' && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              Training
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {model.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {(isNewModel(model) && model.status === 'training') ? (
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-xs text-muted-foreground">Training...</span>
              </div>
            ) : (
              <>
                <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                <span className="text-sm font-medium">{model.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">({model.reviews})</span>
              </>
            )}
          </div>
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(model);
              }}
            >
              <span className="sr-only">Delete</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ModelCard;
