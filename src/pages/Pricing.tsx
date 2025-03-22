
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingPlans from "@/components/pricing/PricingPlans";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import PricingComparison from "@/components/pricing/PricingComparison";

const Pricing = () => {
  // Set page title
  useEffect(() => {
    document.title = "AIMarket - Pricing & Plans";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container max-w-7xl mx-auto px-4 pt-20 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Choose the plan that works best for you, whether you're just getting started or scaling up your AI solutions.
          </p>
        </section>
        <PricingPlans />
        <PricingComparison />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
