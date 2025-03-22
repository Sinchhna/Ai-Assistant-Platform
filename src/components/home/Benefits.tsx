
import { useEffect, useState } from "react";
import { 
  Code, 
  Zap, 
  DollarSign, 
  Lock, 
  MessageSquare, 
  BarChart3,
  Image,
  Cpu
} from "lucide-react";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}

const Benefit = ({ icon, title, description, delay, isInView }: BenefitProps) => (
  <div 
    className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-700 bg-background dark:bg-black/20 border border-border hover:border-primary/20 hover:shadow-lg group ${
      isInView 
        ? "opacity-100 translate-y-0" 
        : "opacity-0 translate-y-12"
    }`} 
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-5 transition-transform group-hover:scale-110">
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Benefits = () => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('benefits-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsInView(rect.top < window.innerHeight * 0.7);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const benefits = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "No Coding Required",
      description: "Implement advanced AI capabilities without writing a single line of code."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant API Access",
      description: "Get API keys immediately after purchase for seamless integration."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Monetize Your AI",
      description: "Sell your AI models and algorithms on our marketplace effortlessly."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "Enterprise-grade security for all your purchases and data."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Community Support",
      description: "Connect with other developers and AI enthusiasts for collaboration."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Usage Analytics",
      description: "Track and optimize your AI model usage with detailed analytics."
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Custom Visualizations",
      description: "Beautiful dashboards to understand your AI performance at a glance."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Scalable Infrastructure",
      description: "Our platform automatically scales with your needs, from startups to enterprises."
    }
  ];
  
  return (
    <section 
      id="benefits-section"
      className="w-full py-24 bg-secondary/50 relative overflow-hidden"
    >
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Our AI Marketplace</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We've simplified the process of discovering, deploying, and monetizing AI models to help you innovate faster.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Benefit
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={100 + index * 100}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
