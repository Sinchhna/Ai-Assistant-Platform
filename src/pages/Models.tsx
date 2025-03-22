
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModelsList from "@/components/models/ModelsList";
import ModelFilters from "@/components/models/ModelFilters";

const Models = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Set page title
  useEffect(() => {
    document.title = "AIMarket - Browse AI Models";
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get filter values from URL params
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "popular";
  const query = searchParams.get("q") || "";
  
  // Update filters in URL
  const updateFilters = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value === "" || (key === "category" && value === "all")) {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container max-w-7xl mx-auto px-4 pt-20 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI Models Marketplace
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Discover and deploy cutting-edge AI models from our curated collection,
            ready to power your next innovation.
          </p>
        </section>
        
        <div className="container max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <aside className="space-y-6">
              <ModelFilters 
                currentCategory={category} 
                currentSortBy={sortBy}
                currentQuery={query}
                onUpdateFilter={updateFilters}
              />
            </aside>
            
            <div>
              <ModelsList 
                isLoading={isLoading}
                category={category}
                sortBy={sortBy}
                searchQuery={query}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Models;
