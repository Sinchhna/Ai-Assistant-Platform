
import { useState, useEffect } from "react";
import ModelCard from "@/components/models/ModelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for AI models
const mockModels = [
  {
    id: 1,
    name: "TextGenius Pro",
    description: "Advanced natural language processing for content generation, summarization, and translation.",
    category: "Text Generation",
    price: 49,
    rating: 4.8,
    reviews: 235,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "ImageCraft AI",
    description: "Generate stunning images from text descriptions with fine-tuned control over style and content.",
    category: "Image Generation",
    price: 79,
    rating: 4.9,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "VoiceClone",
    description: "Create realistic voice replicas with minimal training data for seamless audio projects.",
    category: "Audio",
    price: 59,
    rating: 4.7,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "CodeAssist",
    description: "AI-powered coding assistant that helps write, review, and optimize code across multiple languages.",
    category: "Development",
    price: 99,
    rating: 4.9,
    reviews: 356,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "DataMind Analyzer",
    description: "Powerful data analysis and visualization tool that uncovers insights in complex datasets.",
    category: "Data Analysis",
    price: 129,
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "SentimentScan",
    description: "Advanced sentiment analysis model for social media monitoring and brand reputation tracking.",
    category: "Text Generation",
    price: 39,
    rating: 4.5,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "ObjectDetector Pro",
    description: "Real-time object detection and tracking for video streams and image processing applications.",
    category: "Computer Vision",
    price: 89,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "TranslateGenius",
    description: "Neural machine translation system supporting 50+ languages with contextual understanding.",
    category: "Text Generation",
    price: 69,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

interface ModelsListProps {
  isLoading: boolean;
  category: string;
  sortBy: string;
  searchQuery: string;
}

const ModelsList = ({ isLoading, category, sortBy, searchQuery }: ModelsListProps) => {
  const [models, setModels] = useState(mockModels);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filter and sort models when filters change
  useEffect(() => {
    setPage(1);
    
    let filteredModels = [...mockModels];
    
    // Apply category filter
    if (category && category !== "all") {
      filteredModels = filteredModels.filter(model => model.category === category);
    }
    
    // Apply search query
    if (searchQuery) {
      filteredModels = filteredModels.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        model.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredModels.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredModels.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredModels.sort((a, b) => b.rating - a.rating);
        break;
      default: // "popular"
        filteredModels.sort((a, b) => b.reviews - a.reviews);
    }
    
    setModels(filteredModels);
    setHasMore(filteredModels.length > 6);
  }, [category, sortBy, searchQuery]);
  
  // Load more models
  const loadMore = () => {
    setPage(prev => prev + 1);
    // In a real app, you would fetch more models here
    setHasMore(false);
  };
  
  // Show loading skeletons
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-border">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Show message if no models match filters
  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No models found</h3>
        <p className="text-muted-foreground mb-6">
          Try changing your search or filter criteria
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.href = "/models"}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    );
  }
  
  // Determine how many models to show based on pagination
  const displayedModels = models.slice(0, page * 6);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{displayedModels.length}</span> of <span className="font-medium text-foreground">{models.length}</span> models
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
          <Button variant="ghost" size="sm" className="gap-1">
            <span>{sortBy === "price-low" ? "Price: Low to High" : 
                   sortBy === "price-high" ? "Price: High to Low" : 
                   sortBy === "rating" ? "Highest Rated" : "Most Popular"}</span>
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedModels.map((model, index) => (
          <ModelCard 
            key={model.id} 
            model={model} 
            delay={Math.min(index * 50, 300)}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={loadMore}
            className="px-8"
          >
            Load More Models
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModelsList;
