import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Cloud, Database, Zap, Shield, Cpu } from "lucide-react";

export const TechArchitecture = () => {
  const layers = [
    {
      title: "User Interface Layer",
      icon: <Zap className="w-6 h-6" />,
      components: ["Web Portal", "Mobile App", "API Integration"],
      color: "bg-accent/10 border-accent/20"
    },
    {
      title: "Application Services", 
      icon: <Cpu className="w-6 h-6" />,
      components: ["Report Generation", "Measurement Engine", "Claims Integration"],
      color: "bg-primary/10 border-primary/20"
    },
    {
      title: "AI/ML Pipeline",
      icon: <Brain className="w-6 h-6" />,
      components: ["Roof Segmentation", "Pitch Estimation", "Damage Detection"],
      color: "bg-success/10 border-success/20"
    },
    {
      title: "Data Sources",
      icon: <Database className="w-6 h-6" />,
      components: ["Imagery APIs", "Property Data", "Weather/Permits"],
      color: "bg-muted border-border"
    }
  ];

  const specs = [
    { label: "Processing Speed", value: "<2 minutes" },
    { label: "Accuracy", value: "±3%" },
    { label: "Capacity", value: "10,000+ reports/day" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Enterprise Architecture
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Built for scale, security, and performance with modern cloud-native technologies
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="mb-16">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {layers.map((layer, index) => (
            <Card key={index} className={`${layer.color} shadow-medium animate-slide-in`} style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  {layer.icon}
                  <span>{layer.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((component, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-medium">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Performance Specs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{spec.label}</span>
                  <span className="text-primary font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-primary" />
              <span>Technology Stack</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">ML/AI</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>PyTorch</Badge>
                  <Badge>SAM2</Badge>
                  <Badge>YOLOv8</Badge>
                  <Badge>OpenCV</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>FastAPI</Badge>
                  <Badge>PostgreSQL</Badge>
                  <Badge>Redis</Badge>
                  <Badge>Kubernetes</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Infrastructure</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>AWS</Badge>
                  <Badge>Docker</Badge>
                  <Badge>NVIDIA A100</Badge>
                  <Badge>CDN</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};