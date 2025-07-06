import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, Clock } from "lucide-react";
import heroImage from "@/assets/hero-roofiq.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            RoofIQ
            <span className="block text-3xl md:text-4xl font-normal mt-2 opacity-90">
              Enterprise Roof Measurement System
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-95">
            AI-Powered Alternative to EagleView & QuickSquares. 
            Generate accurate roof measurements in under 2 minutes with 95%+ accuracy.
          </p>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-8 h-8 text-accent animate-pulse-glow" />
              <div className="text-left">
                <div className="text-2xl font-bold">&lt;2 min</div>
                <div className="text-sm opacity-80">Processing Time</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Target className="w-8 h-8 text-accent animate-pulse-glow" />
              <div className="text-left">
                <div className="text-2xl font-bold">95%+</div>
                <div className="text-sm opacity-80">Accuracy</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-8 h-8 text-accent animate-pulse-glow" />
              <div className="text-left">
                <div className="text-2xl font-bold">$200K+</div>
                <div className="text-sm opacity-80">Annual Savings</div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              View Live Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="professional" size="xl">
              Get ROI Analysis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};