import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, MapPin, Clock, CheckCircle, AlertCircle, Camera } from "lucide-react";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";

export const DemoSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  
  const steps = [
    { icon: <MapPin className="w-4 h-4" />, text: "Acquiring aerial imagery...", duration: 800 },
    { icon: <Camera className="w-4 h-4" />, text: "AI segmentation in progress...", duration: 1200 },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Calculating measurements...", duration: 1000 },
    { icon: <AlertCircle className="w-4 h-4" />, text: "Verifying with property data...", duration: 800 },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Generating report...", duration: 600 }
  ];

  const handleStartDemo = async () => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }
    
    // Show completion
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStep(0);
    }, 1000);
  };

  const sampleData = {
    address: "123 Main Street, Sarasota, FL 34236",
    totalArea: "3,842 sq ft",
    facets: 12,
    pitch: "6:12 predominant",
    confidence: "94%",
    stormCorrelation: "89% - Hail event March 14, 2024",
    processingTime: "1.3 seconds"
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-subtle">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          See RoofIQ in Action
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the speed and accuracy of our AI-powered roof measurement system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Demo Interface */}
        <Card className="shadow-strong">
          <CardHeader className="bg-gradient-primary text-white">
            <CardTitle className="flex items-center justify-between">
              <span>Live Demo Interface</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Simulated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Property Input */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">Sample Property</span>
                </div>
                <p className="text-sm text-muted-foreground">{sampleData.address}</p>
              </div>

              {/* Start Demo Button */}
              <Button 
                variant="enterprise" 
                size="lg" 
                className="w-full"
                onClick={handleStartDemo}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Analysis</span>
                  </div>
                )}
              </Button>

              {/* Processing Steps */}
              {isProcessing && (
                <div className="space-y-3 animate-fade-in">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-2 rounded transition-all ${
                        index < processingStep ? 'text-success bg-success/10' : 
                        index === processingStep - 1 ? 'text-primary bg-primary/10' : 
                        'text-muted-foreground'
                      }`}
                    >
                      {step.icon}
                      <span className="text-sm">{step.text}</span>
                      {index < processingStep && <CheckCircle className="w-4 h-4 ml-auto" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {!isProcessing && processingStep === 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-success">Analysis Complete!</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Area:</span>
                      <div className="font-medium">{sampleData.totalArea}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Facets:</span>
                      <div className="font-medium">{sampleData.facets}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pitch:</span>
                      <div className="font-medium">{sampleData.pitch}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="font-medium text-success">{sampleData.confidence}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Storm Correlation:</span>
                      <div className="font-medium text-accent">{sampleData.stormCorrelation}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="font-bold text-primary flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{sampleData.processingTime}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Preview */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle>Dashboard Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={dashboardMockup} 
                alt="RoofIQ Dashboard"
                className="w-full h-auto rounded-b-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-success text-success-foreground">
                  Live Interface
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center shadow-medium">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Instant Results</h3>
            <p className="text-sm text-muted-foreground">
              Get accurate measurements in under 2 minutes vs. 24-48 hours with traditional services
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-medium">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">AI Verification</h3>
            <p className="text-sm text-muted-foreground">
              Multi-source verification with property data and storm correlation for maximum accuracy
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-medium">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Claims Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Integrated damage detection and permit history for comprehensive claim analysis
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};