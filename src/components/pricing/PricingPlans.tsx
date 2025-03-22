
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-center mb-10">
        <div className="bg-secondary rounded-lg p-1 inline-flex">
          <RadioGroup 
            className="flex" 
            defaultValue="monthly" 
            value={billingCycle}
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
          >
            <label 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-all ${
                billingCycle === "monthly" ? "bg-primary text-primary-foreground" : ""
              }`}
              htmlFor="monthly"
            >
              <RadioGroupItem id="monthly" value="monthly" className="sr-only" />
              <span>Monthly</span>
            </label>
            <label 
              className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-all ${
                billingCycle === "yearly" ? "bg-primary text-primary-foreground" : ""
              }`}
              htmlFor="yearly"
            >
              <RadioGroupItem id="yearly" value="yearly" className="sr-only" />
              <span>Yearly</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/20">
                Save 20%
              </Badge>
            </label>
          </RadioGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <Card className="p-6 flex flex-col h-full border border-border hover:border-primary/50 transition-all hover:shadow-md">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Free</h3>
            <p className="text-muted-foreground mb-4">Perfect for exploring and testing AI models</p>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2 mb-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Access to 5 community AI models</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>100 API calls per month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Basic documentation</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Community support</span>
            </li>
          </ul>

          <Button variant="outline" className="mt-auto">
            Get Started Free
          </Button>
        </Card>

        {/* Pro Tier */}
        <Card className="p-6 flex flex-col h-full relative border-2 border-primary shadow-lg">
          <Badge className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2">
            Popular
          </Badge>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-4">Ideal for businesses implementing AI solutions</p>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold">${billingCycle === "monthly" ? "49" : "39"}</span>
              <span className="text-muted-foreground ml-2 mb-1">/{billingCycle === "monthly" ? "month" : "month (billed yearly)"}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Access to all community AI models</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>10,000 API calls per month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Advanced documentation</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Priority email support</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Custom API key management</span>
            </li>
          </ul>

          <Button className="mt-auto">
            Get Started
          </Button>
        </Card>

        {/* Enterprise Tier */}
        <Card className="p-6 flex flex-col h-full border border-border hover:border-primary/50 transition-all hover:shadow-md">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-4">For organizations with advanced AI needs</p>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-bold">${billingCycle === "monthly" ? "199" : "159"}</span>
              <span className="text-muted-foreground ml-2 mb-1">/{billingCycle === "monthly" ? "month" : "month (billed yearly)"}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Access to all AI models including premium</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Unlimited API calls</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Custom integration support</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>24/7 dedicated support</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>SLA guarantees</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>Advanced analytics dashboard</span>
            </li>
          </ul>

          <Button variant="outline" className="mt-auto">
            Contact Sales
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default PricingPlans;
