import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Eye, Users, Scan } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-farm.jpg";
import produceQRImage from "@/assets/produce-qr.jpg";
import farmerTechImage from "@/assets/farmer-tech.jpg";

const Home = () => {
  const { user } = useAuth();
  
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable records ensure complete transparency and prevent fraud in the supply chain."
    },
    {
      icon: Eye,
      title: "Full Traceability",
      description: "Track your produce from farm to table with complete visibility of each step."
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description: "Connects farmers, distributors, retailers, and consumers in one platform."
    },
    {
      icon: Scan,
      title: "QR Code Scanning",
      description: "Simple QR code scanning provides instant access to complete product history."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modern sustainable farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Transparent Supply Chain for
              <span className="text-secondary-light"> Agricultural Produce</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Connect farmers, distributors, retailers, and consumers through blockchain technology. 
              Ensure fair pricing, origin verification, and quality transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/trace" className="flex items-center">
                  Trace Produce
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {user ? (
                <Button size="lg" variant="outline" className="border-white bg-white text-primary hover:bg-white/90 hover:text-primary">
                  <Link to="/dashboard" className="flex items-center">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="outline" className="border-white bg-white text-primary hover:bg-white/90 hover:text-primary">
                    <Link to="/auth?tab=signin" className="flex items-center">
                      Log In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90">
                    <Link to="/auth?tab=signup" className="flex items-center">
                      Sign Up
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose AgroConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides transparency, security, and trust throughout the agricultural supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process from farm to consumer
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={farmerTechImage}
                alt="Farmer using technology"
                className="rounded-lg shadow-medium"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Farmer Registration</h3>
                  <p className="text-muted-foreground">Farmers register new produce batches with quality reports and generate QR codes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Supply Chain Transfer</h3>
                  <p className="text-muted-foreground">Distributors and retailers verify and update the blockchain record at each step.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Consumer Verification</h3>
                  <p className="text-muted-foreground">Consumers scan QR codes to see the complete journey and verify authenticity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <img
              src={produceQRImage}
              alt="Produce with QR codes"
              className="w-32 h-32 mx-auto rounded-lg shadow-medium mb-6"
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of farmers, distributors, and retailers building a more transparent future.
          </p>
          {user ? (
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/dashboard" className="flex items-center">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/auth?tab=signup" className="flex items-center">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;