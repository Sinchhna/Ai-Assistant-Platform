
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedModels from "@/components/home/FeaturedModels";
import Benefits from "@/components/home/Benefits";

const Index = () => {
  // Set page title
  useEffect(() => {
    document.title = "AIMarket - Discover & Deploy AI Models Instantly";
    
    // Set up theme based on user preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedModels />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
