
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface ModelCardProps {
  model: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
  };
  delay?: number;
}

const ModelCard = ({ model, delay = 0 }: ModelCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-500 hover:shadow-lg group cursor-pointer ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`absolute inset-0 bg-secondary/70 backdrop-blur-sm shimmer ${imageLoaded ? 'hidden' : 'block'}`} />
        <img 
          src={model.image} 
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
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{model.name}</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            ${model.price}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {model.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
            <span className="text-sm font-medium">{model.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({model.reviews})</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="inline-block px-2 py-0.5 rounded-full bg-secondary">
              New
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModelCard;
