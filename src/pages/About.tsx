
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  // Set page title
  useEffect(() => {
    document.title = "AIMarket - About Us";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Empowering Innovation Through Accessible AI
                </h1>
                <p className="text-lg text-muted-foreground">
                  AIMarket is on a mission to democratize artificial intelligence by creating the most accessible marketplace for discovering, purchasing, and integrating AI models.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" asChild>
                    <Link to="/models">
                      Explore Our Models <ArrowRight className="ml-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-3xl font-bold text-primary/40">AI Market</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Founded in 2023, AIMarket was created by a team of AI researchers and entrepreneurs who recognized the need for a better way to connect AI creators with businesses and developers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="text-primary font-bold text-xl mb-3">The Problem</div>
                <p>Despite rapid advances in AI, finding and implementing the right models remained a complex, time-consuming process accessible only to technical experts.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="text-primary font-bold text-xl mb-3">Our Solution</div>
                <p>We built a marketplace that simplifies discovery, provides transparent pricing, and offers seamless API integration for AI models across all domains.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="text-primary font-bold text-xl mb-3">Our Impact</div>
                <p>Today, thousands of businesses use AIMarket to implement AI solutions that would have been out of reach, accelerating innovation across industries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-lg text-muted-foreground">
                Meet the passionate experts behind AIMarket, dedicated to transforming how the world accesses and utilizes AI.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-full max-w-[180px] mx-auto mb-4 overflow-hidden border-2 border-primary/20"></div>
                <h3 className="font-bold text-xl">Sarah Chen</h3>
                <p className="text-primary font-medium">CEO & Co-founder</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Former AI researcher at Stanford with 10+ years experience in machine learning applications.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-full max-w-[180px] mx-auto mb-4 overflow-hidden border-2 border-primary/20"></div>
                <h3 className="font-bold text-xl">Michael Rivera</h3>
                <p className="text-primary font-medium">CTO & Co-founder</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Previously led engineering teams at Google AI, specializing in large language models.
                </p>
              </div>
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-full max-w-[180px] mx-auto mb-4 overflow-hidden border-2 border-primary/20"></div>
                <h3 className="font-bold text-xl">Aisha Patel</h3>
                <p className="text-primary font-medium">Head of Product</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Product leader with experience at Amazon and Microsoft, focused on AI-driven solutions.
                </p>
              </div>
              {/* Team Member 4 */}
              <div className="text-center">
                <div className="aspect-square bg-muted rounded-full max-w-[180px] mx-auto mb-4 overflow-hidden border-2 border-primary/20"></div>
                <h3 className="font-bold text-xl">David Kim</h3>
                <p className="text-primary font-medium">Head of AI Research</p>
                <p className="text-sm text-muted-foreground mt-2">
                  PhD in Computer Science with over 20 published papers on neural networks and generative AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                These core principles guide everything we do at AIMarket.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    We believe AI should be accessible to everyone, regardless of technical expertise or resources.
                  </p>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Transparency</h3>
                  <p className="text-muted-foreground">
                    We provide clear information about model capabilities, limitations, and pricing.
                  </p>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously push the boundaries of what's possible with AI marketplace technology.
                  </p>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Responsibility</h3>
                  <p className="text-muted-foreground">
                    We are committed to promoting ethical AI development and usage throughout our ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Join the AI Revolution</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're looking to integrate AI into your business or showcase your AI models to the world, AIMarket is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Create an Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
