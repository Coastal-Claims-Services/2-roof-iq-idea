import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Database, 
  Cloud, 
  Zap, 
  Shield, 
  Globe,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Activity
} from "lucide-react";

interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'ai' | 'integration';
  status: 'active' | 'development' | 'planning';
  description: string;
  technologies: string[];
  connections: string[];
}

interface SystemMetrics {
  uptime: number;
  throughput: number;
  latency: number;
  accuracy: number;
}

export const TechnicalArchitecture = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('storm-api');
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'performance'>('overview');

  const components: ArchitectureComponent[] = [
    {
      id: 'storm-api',
      name: 'Storm Intelligence API',
      type: 'ai',
      status: 'development',
      description: 'Core API for storm correlation and weather data integration',
      technologies: ['Python', 'FastAPI', 'AsyncIO', 'Shapely', 'NumPy'],
      connections: ['weather-services', 'ml-pipeline', 'report-generator']
    },
    {
      id: 'ml-pipeline',
      name: 'ML Processing Pipeline',
      type: 'ai',
      status: 'active',
      description: 'Computer vision models for roof segmentation and damage detection',
      technologies: ['PyTorch', 'CUDA', 'OpenCV', 'Detectron2', 'Albumentations'],
      connections: ['image-storage', 'model-registry', 'inference-api']
    },
    {
      id: 'web-frontend',
      name: 'React Frontend',
      type: 'frontend',
      status: 'active',
      description: 'Modern web interface for claims processing and analysis',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Mapbox GL'],
      connections: ['storm-api', 'auth-service', 'report-generator']
    },
    {
      id: 'report-generator',
      name: 'Report Generation Engine',
      type: 'backend',
      status: 'development',
      description: 'PDF and interactive report generation with storm intelligence',
      technologies: ['Node.js', 'Puppeteer', 'React PDF', 'Canvas API'],
      connections: ['storm-api', 'template-engine', 'file-storage']
    },
    {
      id: 'weather-services',
      name: 'Weather Data Integration',
      type: 'integration',
      status: 'active',
      description: 'Multi-source weather data aggregation and processing',
      technologies: ['StormDate API', 'NOAA API', 'Redis Cache', 'Celery'],
      connections: ['storm-api', 'data-pipeline', 'cache-layer']
    },
    {
      id: 'database-cluster',
      name: 'Database Cluster',
      type: 'database',
      status: 'active',
      description: 'High-availability database with geospatial support',
      technologies: ['PostgreSQL', 'PostGIS', 'Redis', 'TimescaleDB'],
      connections: ['storm-api', 'ml-pipeline', 'audit-system']
    }
  ];

  const metrics: SystemMetrics = {
    uptime: 99.8,
    throughput: 1250,
    latency: 180,
    accuracy: 94.7
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'frontend': return <Globe className="w-5 h-5" />;
      case 'backend': return <Server className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'ai': return <Cpu className="w-5 h-5" />;
      case 'integration': return <Network className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'frontend': return 'bg-accent text-accent-foreground';
      case 'backend': return 'bg-primary text-primary-foreground';
      case 'database': return 'bg-success text-success-foreground';
      case 'ai': return 'bg-warning text-warning-foreground';
      case 'integration': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'development': return <Activity className="w-4 h-4 text-warning" />;
      case 'planning': return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getCurrentComponent = () => components.find(c => c.id === selectedComponent) || components[0];

  const dataFlow = [
    { from: 'Image Upload', to: 'ML Pipeline', description: 'Roof images processed for segmentation' },
    { from: 'ML Pipeline', to: 'Storm API', description: 'Roof facets sent for storm correlation' },
    { from: 'Storm API', to: 'Weather Services', description: 'Query weather data for location/date' },
    { from: 'Weather Services', to: 'Storm API', description: 'Storm events and intensity data' },
    { from: 'Storm API', to: 'Report Generator', description: 'Correlation analysis and damage assessment' },
    { from: 'Report Generator', to: 'Frontend', description: 'Interactive reports and visualizations' }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Technical Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scalable, AI-powered architecture designed for enterprise-grade performance and reliability.
            Built with modern technologies and best practices for the insurance industry.
          </p>
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Components</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">React-based interface with real-time updates</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">API Gateway</h3>
                <p className="text-sm text-muted-foreground">Secure, scalable API management</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-6 h-6 text-warning-foreground" />
                </div>
                <h3 className="font-semibold mb-2">AI Engine</h3>
                <p className="text-sm text-muted-foreground">ML models for analysis and prediction</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-success-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Data Layer</h3>
                <p className="text-sm text-muted-foreground">Geospatial database with high availability</p>
              </Card>
            </div>

            {/* Data Flow Diagram */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Data Flow Architecture
              </h3>
              <div className="space-y-4">
                {dataFlow.map((flow, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="font-medium">{flow.from}</div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="font-medium">{flow.to}</div>
                    </div>
                    <div className="text-sm text-muted-foreground max-w-xs">
                      {flow.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Component List */}
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">System Components</h3>
                  <div className="space-y-2">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedComponent === component.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${getComponentColor(component.type)}`}>
                            {getComponentIcon(component.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{component.name}</span>
                              {getStatusIcon(component.status)}
                            </div>
                            <Badge className={getComponentColor(component.type)} variant="secondary">
                              {component.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Component Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">{getCurrentComponent().name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getComponentColor(getCurrentComponent().type)}>
                        {getCurrentComponent().type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(getCurrentComponent().status)}
                        <span className="text-sm capitalize">{getCurrentComponent().status}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{getCurrentComponent().description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Technologies</h4>
                      <div className="space-y-2">
                        {getCurrentComponent().technologies.map((tech, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Connections</h4>
                      <div className="space-y-2">
                        {getCurrentComponent().connections.map((connection, index) => {
                          const connectedComponent = components.find(c => c.id === connection);
                          return (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <Network className="w-4 h-4 text-accent" />
                              <span className="text-sm">
                                {connectedComponent?.name || connection.replace('-', ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Security & Compliance */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Compliance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <Lock className="w-8 h-8 text-primary mb-2" />
                      <h4 className="font-medium mb-1">Encryption</h4>
                      <p className="text-xs text-muted-foreground">End-to-end encryption for all data transfers</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <Shield className="w-8 h-8 text-success mb-2" />
                      <h4 className="font-medium mb-1">SOC 2 Type II</h4>
                      <p className="text-xs text-muted-foreground">Compliant with enterprise security standards</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <Eye className="w-8 h-8 text-warning mb-2" />
                      <h4 className="font-medium mb-1">Audit Logs</h4>
                      <p className="text-xs text-muted-foreground">Comprehensive logging and monitoring</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">{metrics.uptime}%</div>
                <div className="text-sm text-muted-foreground mb-1">System Uptime</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.uptime}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{metrics.throughput}</div>
                <div className="text-sm text-muted-foreground mb-1">Requests/min</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (metrics.throughput / 2000) * 100)}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">{metrics.latency}ms</div>
                <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(20, 100 - (metrics.latency / 500) * 100)}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-warning mb-2">{metrics.accuracy}%</div>
                <div className="text-sm text-muted-foreground mb-1">ML Accuracy</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.accuracy}%` }}
                  />
                </div>
              </Card>
            </div>

            {/* Scalability */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Scalability & Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Horizontal Scaling</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">API Gateway</span>
                      <Badge variant="outline">Auto-scaling</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">ML Inference</span>
                      <Badge variant="outline">GPU Clusters</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">Database</span>
                      <Badge variant="outline">Read Replicas</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Performance Optimization</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">Caching Layer</span>
                      <Badge variant="outline">Redis</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">CDN</span>
                      <Badge variant="outline">Global Edge</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span className="text-sm">Load Balancing</span>
                      <Badge variant="outline">Smart Routing</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};