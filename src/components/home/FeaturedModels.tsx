
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import ModelCard from "../models/ModelCard";

// Sample data for featured models
const featuredModels = [
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
  }
];

const categories = [
  "All",
  "Text Generation",
  "Image Generation",
  "Audio",
  "Development",
  "Data Analysis",
  "Computer Vision"
];

const FeaturedModels = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleModels, setVisibleModels] = useState(featuredModels);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('featured-models');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight * 0.8);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (selectedCategory === "All") {
      setVisibleModels(featuredModels);
    } else {
      setVisibleModels(featuredModels.filter(model => model.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  return (
    <section 
      id="featured-models"
      className="w-full py-24 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div 
          className={`transition-all duration-700 transform ${
            isInView 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-3">Featured Models</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Models for Every Need</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Explore our curated collection of high-performance AI models ready for instant deployment.
              </p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 group self-start rounded-full"
              variant="outline"
            >
              <span>View All Models</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div 
          className={`transition-all duration-700 delay-200 transform ${
            isInView 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-10 overflow-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent pb-4">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="rounded-full whitespace-nowrap"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Models Grid */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-400 transform ${
            isInView 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          {visibleModels.map((model, index) => (
            <ModelCard 
              key={model.id} 
              model={model} 
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModels;
