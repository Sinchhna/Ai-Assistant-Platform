
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20">
      {/* Background Neural Pattern */}
      <div className="absolute inset-0 bg-neural-pattern opacity-5 dark:opacity-10" />
      
      {/* Animated Gradient Orb (subtle) */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse-slow" 
        style={{ animationDelay: "1s" }} 
      />
      
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center relative z-10">
        <div 
          className={`transition-all duration-1000 
            ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-block bg-primary/10 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
            <p className="text-sm text-primary font-medium">
              Revolutionize Your Workflow with AI
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Discover & Deploy AI Models
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Monetize AI models or integrate them into your business with just a few clicks—No coding required!
          </p>
        </div>
        
        {/* Search Bar */}
        <div 
          className={`relative max-w-xl mx-auto mb-12 transition-all duration-1000 delay-300
            ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for AI models..." 
              className="w-full h-14 pl-12 pr-36 rounded-full border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Button className="absolute right-2 rounded-full h-10 px-6">
              Search
            </Button>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500
            ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Button 
            size="lg" 
            className="relative h-12 px-8 rounded-full text-base button-effect w-full sm:w-auto"
          >
            Browse AI Models
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 px-8 rounded-full text-base w-full sm:w-auto backdrop-blur-sm"
          >
            Sell Your AI Model
          </Button>
        </div>
        
        {/* Stats */}
        <div 
          className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-700 
            ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex flex-col items-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
            <p className="text-sm text-muted-foreground">AI Models</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">10k+</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">99.9%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
      
      {/* Mouse Scroll Indicator */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000
          ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/40 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-muted-foreground/40 rounded-full mt-2 animate-float"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
