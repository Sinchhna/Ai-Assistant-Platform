
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createModel, simulateTraining } from "@/services/modelService";
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  name: z.string().min(2, { message: "Model name must be at least 2 characters." }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
});

const CreateModel = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingStage, setTrainingStage] = useState<number>(0);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [modelId, setModelId] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setTrainingStage(1);
    
    try {
      // Use default image if none provided
      const finalValues = {
        name: values.name,
        description: values.description,
        category: values.category,
        imageUrl: values.imageUrl || getRandomImageForCategory(values.category)
      };
      
      // Create the model and get its ID
      const newModel = createModel(finalValues);
      setModelId(newModel.id);
      setTrainingStage(2);
      
      // Start simulated training with progress updates
      const updateInterval = setInterval(() => {
        setTrainingProgress(prev => {
          const models = JSON.parse(localStorage.getItem('models') || '[]');
          const model = models.find((m: any) => m.id === newModel.id);
          return model?.trainingProgress || prev;
        });
      }, 500);
      
      // Start the training simulation
      await simulateTraining(newModel.id);
      
      // Cleanup interval
      clearInterval(updateInterval);
      setTrainingProgress(100);
      setTrainingStage(3);
      
      toast.success("Model trained successfully!");
      
      // Navigate to My Models after a short delay
      setTimeout(() => {
        navigate("/my-models");
      }, 1500);
    } catch (error) {
      console.error("Error creating model:", error);
      toast.error("Failed to create model. Please try again.");
      setIsSubmitting(false);
    }
  }
  
  // Helper function to get random image for a category
  function getRandomImageForCategory(category: string): string {
    const categoryImages: Record<string, string[]> = {
      "Text Generation": [
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      "Image Generation": [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      "Audio": [
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      "Development": [
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      "Data Analysis": [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      "Computer Vision": [
        "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570169043013-de63451e317b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ]
    };
    
    const images = categoryImages[category] || [
      "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];
    
    return images[Math.floor(Math.random() * images.length)];
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Create New Model
          </h1>
          
          {trainingStage === 0 ? (
            // Step 1: Model Creation Form
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Customer Support Assistant" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is how your model will appear in the marketplace.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what your model does and provide training data examples..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description helps train the AI model on your specific use case.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Text Generation">Text Generation</SelectItem>
                          <SelectItem value="Image Generation">Image Generation</SelectItem>
                          <SelectItem value="Audio">Audio</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                          <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category that best fits your model.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add an image to make your model more appealing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/my-models")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Start Training
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            // Step 2-4: Training Process Visualization
            <Card className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center">
                  <Brain className={`h-16 w-16 ${trainingStage >= 3 ? 'text-green-500' : 'text-primary/70 animate-pulse'}`} />
                  {trainingStage < 3 && (
                    <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">
                {trainingStage === 1 && "Initializing AI Training..."}
                {trainingStage === 2 && "Training in Progress..."}
                {trainingStage === 3 && "Training Complete!"}
              </h2>
              
              <p className="text-center text-muted-foreground mb-6">
                {trainingStage === 1 && "Setting up the training environment and preparing your data."}
                {trainingStage === 2 && "Training your AI model on the provided description and examples."}
                {trainingStage === 3 && "Your model has been successfully trained and is ready to use."}
              </p>
              
              {trainingStage >= 2 && (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Training Progress</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                  
                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Data Processing</span>
                      <span className={trainingProgress >= 30 ? 'text-green-500' : ''}>
                        {trainingProgress >= 30 ? 'Complete' : 'In Progress...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neural Network Training</span>
                      <span className={trainingProgress >= 70 ? 'text-green-500' : ''}>
                        {trainingProgress >= 70 ? 'Complete' : trainingProgress >= 30 ? 'In Progress...' : 'Waiting...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Optimization</span>
                      <span className={trainingProgress >= 100 ? 'text-green-500' : ''}>
                        {trainingProgress >= 100 ? 'Complete' : trainingProgress >= 70 ? 'In Progress...' : 'Waiting...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {trainingStage === 3 && (
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate("/my-models")}
                    className="gap-2"
                  >
                    View My Models
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateModel;
