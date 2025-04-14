
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeAlert, Brain, Clock, Plus, Search, Trash2 } from "lucide-react";
import ModelCard from "@/components/models/ModelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { getModels, deleteModel, Model } from "@/services/modelService";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";

const MyModels = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Load models from localStorage
  useEffect(() => {
    document.title = "AIMarket - My Models";
    
    // Simulate loading data
    const timer = setTimeout(() => {
      const storedModels = getModels();
      setModels(storedModels);
      setFilteredModels(storedModels);
      setIsLoading(false);
    }, 800);
    
    // Set up interval to check for training progress updates
    const progressInterval = setInterval(() => {
      const updatedModels = getModels();
      // Only update if there are models still training
      if (updatedModels.some(model => model.status === 'training')) {
        setModels(updatedModels);
        
        // Update filtered models while preserving search
        if (searchQuery.trim() === "") {
          setFilteredModels(updatedModels);
        } else {
          const query = searchQuery.toLowerCase();
          setFilteredModels(updatedModels.filter(model => 
            model.name.toLowerCase().includes(query) || 
            model.description.toLowerCase().includes(query)
          ));
        }
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [refreshTrigger]);
  
  // Filter models when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModels(models);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredModels(models.filter(model => 
        model.name.toLowerCase().includes(query) || 
        model.description.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, models]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleDeleteModel = (modelToDelete: Model | any) => {
    setModelToDelete(modelToDelete);
  };
  
  const confirmDelete = () => {
    if (modelToDelete) {
      deleteModel(modelToDelete.id);
      setModelToDelete(null);
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
      toast.success("Model deleted successfully");
    }
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
                  onDelete={handleDeleteModel}
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!modelToDelete} onOpenChange={(open) => !open && setModelToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{modelToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setModelToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyModels;
