
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ModelNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Model Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The model you're looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate("/models")}>
            Back to Models
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelNotFound;
