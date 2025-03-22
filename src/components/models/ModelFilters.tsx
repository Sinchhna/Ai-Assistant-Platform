
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Search, X } from "lucide-react";

// Categories for models
const modelCategories = [
  { value: "all", label: "All Categories" },
  { value: "Text Generation", label: "Text Generation" },
  { value: "Image Generation", label: "Image Generation" },
  { value: "Audio", label: "Audio" },
  { value: "Development", label: "Development" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Computer Vision", label: "Computer Vision" }
];

// Sorting options
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" }
];

interface ModelFiltersProps {
  currentCategory: string;
  currentSortBy: string;
  currentQuery: string;
  onUpdateFilter: (key: string, value: string) => void;
}

const ModelFilters = ({ 
  currentCategory,
  currentSortBy,
  currentQuery,
  onUpdateFilter
}: ModelFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Update search input when URL param changes
  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilter("q", searchQuery);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    onUpdateFilter("category", "all");
    onUpdateFilter("sortBy", "popular");
    onUpdateFilter("q", "");
    setSearchQuery("");
  };
  
  // Check if any filters are active
  const hasActiveFilters = currentCategory !== "all" || currentSortBy !== "popular" || currentQuery !== "";
  
  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full justify-between"
        >
          Filters & Search
          <span className="flex h-2 w-2 translate-y-1/4 rounded-full bg-primary"></span>
        </Button>
      </div>
        
      <Card className={`sticky top-24 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
        <CardHeader className="pb-3">
          <CardTitle>Filter Models</CardTitle>
          <CardDescription>
            Refine your search with the options below.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="space-y-2">
            <p className="text-sm font-medium mb-1">Search</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    onUpdateFilter("q", "");
                  }}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="w-full">Search</Button>
          </form>
          
          <Accordion type="single" collapsible defaultValue="category" className="w-full">
            {/* Categories */}
            <AccordionItem value="category" className="border-b">
              <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-1">
                  {modelCategories.map((category) => (
                    <div 
                      key={category.value}
                      className={`
                        cursor-pointer rounded-md px-2 py-1.5 text-sm transition-colors 
                        ${currentCategory === category.value 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted'
                        }
                      `}
                      onClick={() => onUpdateFilter("category", category.value)}
                    >
                      {category.label}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Sort By */}
            <AccordionItem value="sort" className="border-b">
              <AccordionTrigger className="text-sm font-medium">Sort By</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-1">
                  {sortOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`
                        cursor-pointer rounded-md px-2 py-1.5 text-sm transition-colors 
                        ${currentSortBy === option.value 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted'
                        }
                      `}
                      onClick={() => onUpdateFilter("sortBy", option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2">
              <Button 
                variant="ghost"
                size="sm"
                className="text-muted-foreground w-full hover:text-foreground"
                onClick={clearAllFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ModelFilters;
