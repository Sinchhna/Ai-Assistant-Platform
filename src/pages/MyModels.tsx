
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import ModelCard from "@/components/models/ModelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

// Sample user models data
const userModels = [
  {
    id: 101,
    name: "My NLP Assistant",
    description: "Custom NLP model trained on my specific dataset for internal use.",
    category: "Text Generation",
    price: 0,
    rating: 4.5,
    reviews: 3,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 102,
    name: "Customer Service Bot",
    description: "AI chatbot trained to handle customer inquiries for my e-commerce store.",
    category: "Text Generation",
    price: 0,
    rating: 4.2,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1596920566403-2072ed942644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const MyModels = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModels, setFilteredModels] = useState(userModels);
  
  useEffect(() => {
    document.title = "AIMarket - My Models";
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModels(userModels);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredModels(userModels.filter(model => 
        model.name.toLowerCase().includes(query) || 
        model.description.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container max-w-7xl mx-auto px-4 pt-20 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                My Models
              </h1>
              <p className="text-muted-foreground">
                Manage your custom AI models and creations
              </p>
            </div>
            <Link to="/create-model" className="mt-4 md:mt-0">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Model
              </Button>
            </Link>
          </div>
          
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your models..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, index) => (
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
          ) : filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model, index) => (
                <ModelCard 
                  key={model.id} 
                  model={model} 
                  delay={Math.min(index * 50, 300)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg">
              {searchQuery ? (
                <>
                  <h3 className="text-xl font-medium mb-2">No models found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any models matching your search.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-2">You don't have any models yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI model to see it here
                  </p>
                  <Link to="/create-model">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Model
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyModels;
