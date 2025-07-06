import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Code, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  RefreshCw,
  CloudLightning,
  MapPin,
  Target,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  category: string;
  parameters: Parameter[];
  sampleResponse: any;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: any;
}

interface APICall {
  id: string;
  endpoint: string;
  timestamp: string;
  status: 'success' | 'error' | 'loading';
  responseTime: number;
  response: any;
}

export const APITestingPlayground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('storm-correlation');
  const [requestBody, setRequestBody] = useState<string>('');
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const endpoints: APIEndpoint[] = [
    {
      id: 'storm-correlation',
      name: 'Storm Correlation Analysis',
      method: 'POST',
      path: '/api/v1/storm-intelligence/correlate',
      description: 'Correlate roof damage with storm events using advanced AI analysis',
      category: 'Storm Intelligence',
      parameters: [
        { name: 'property_location', type: 'object', required: true, description: 'Property coordinates', example: { lat: 27.3364, lon: -82.5307 } },
        { name: 'roof_facets', type: 'array', required: true, description: 'Roof facet definitions', example: [{ id: 'A', coordinates: [[]], pitch: '6:12' }] },
        { name: 'claim_date', type: 'string', required: true, description: 'Date of damage claim', example: '2024-03-15' },
        { name: 'radius_miles', type: 'number', required: false, description: 'Search radius for storms', example: 5 }
      ],
      sampleResponse: {
        correlation_found: true,
        correlation_score: 0.87,
        primary_storm: {
          event_id: 'storm-1',
          type: 'hail',
          date: '2024-03-15T14:30:00Z',
          max_hail_size: 2.1,
          max_wind_speed: 65
        },
        facet_exposures: [
          { facet_id: 'A', exposure_level: 0.9, damage_probability: 0.85 }
        ],
        narrative: 'On March 15, 2024 at 2:30 PM, a hail storm with maximum hail size of 2.1 inches impacted the property...'
      }
    },
    {
      id: 'roof-segmentation',
      name: 'Roof Segmentation',
      method: 'POST',
      path: '/api/v1/ml/segment',
      description: 'AI-powered roof segmentation with facet identification',
      category: 'Machine Learning',
      parameters: [
        { name: 'image_url', type: 'string', required: true, description: 'URL of roof image', example: 'https://example.com/roof.jpg' },
        { name: 'confidence_threshold', type: 'number', required: false, description: 'Minimum confidence for detection', example: 0.8 },
        { name: 'return_masks', type: 'boolean', required: false, description: 'Include segmentation masks', example: true }
      ],
      sampleResponse: {
        facets: [
          { id: 'A', coordinates: [[]], area_sqft: 450, pitch: '6:12', confidence: 0.94 },
          { id: 'B', coordinates: [[]], area_sqft: 380, pitch: '6:12', confidence: 0.91 }
        ],
        total_area: 830,
        processing_time_ms: 1247,
        model_version: 'v2.4.1'
      }
    },
    {
      id: 'damage-detection',
      name: 'Damage Detection',
      method: 'POST',
      path: '/api/v1/ml/detect-damage',
      description: 'Identify and classify roof damage using computer vision',
      category: 'Machine Learning',
      parameters: [
        { name: 'image_url', type: 'string', required: true, description: 'URL of damage image', example: 'https://example.com/damage.jpg' },
        { name: 'damage_types', type: 'array', required: false, description: 'Specific damage types to detect', example: ['hail', 'wind', 'wear'] }
      ],
      sampleResponse: {
        damage_detected: true,
        damages: [
          { type: 'hail', confidence: 0.92, bounding_box: [100, 100, 200, 200], severity: 'moderate' },
          { type: 'wind', confidence: 0.78, bounding_box: [300, 150, 400, 250], severity: 'severe' }
        ],
        overall_condition: 'damaged',
        repair_priority: 'high'
      }
    },
    {
      id: 'pitch-estimation',
      name: 'Pitch Estimation',
      method: 'POST',
      path: '/api/v1/ml/estimate-pitch',
      description: 'Calculate roof pitch and slope measurements',
      category: 'Machine Learning',
      parameters: [
        { name: 'image_url', type: 'string', required: true, description: 'URL of roof image', example: 'https://example.com/roof.jpg' },
        { name: 'calibration_points', type: 'array', required: false, description: 'Reference points for calibration', example: [] }
      ],
      sampleResponse: {
        pitch: '6:12',
        angle_degrees: 26.57,
        slope_ratio: 0.5,
        confidence: 0.89,
        facet_pitches: [
          { facet_id: 'A', pitch: '6:12', confidence: 0.91 },
          { facet_id: 'B', pitch: '8:12', confidence: 0.87 }
        ]
      }
    }
  ];

  const getCurrentEndpoint = () => endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const generateSampleRequest = () => {
    const endpoint = getCurrentEndpoint();
    const sampleData: any = {};
    
    endpoint.parameters.forEach(param => {
      if (param.required || Math.random() > 0.5) {
        sampleData[param.name] = param.example;
      }
    });

    setRequestBody(JSON.stringify(sampleData, null, 2));
  };

  const executeAPICall = async () => {
    const endpoint = getCurrentEndpoint();
    setIsLoading(true);

    const newCall: APICall = {
      id: Date.now().toString(),
      endpoint: endpoint.name,
      timestamp: new Date().toISOString(),
      status: 'loading',
      responseTime: 0,
      response: null
    };

    setApiCalls(prev => [newCall, ...prev]);

    // Simulate API call
    setTimeout(() => {
      const responseTime = Math.floor(Math.random() * 2000) + 500;
      const success = Math.random() > 0.1; // 90% success rate

      const updatedCall: APICall = {
        ...newCall,
        status: success ? 'success' : 'error',
        responseTime,
        response: success ? endpoint.sampleResponse : { error: 'Internal server error', code: 500 }
      };

      setApiCalls(prev => prev.map(call => call.id === newCall.id ? updatedCall : call));
      setIsLoading(false);

      if (success) {
        toast.success(`API call completed in ${responseTime}ms`);
      } else {
        toast.error('API call failed');
      }
    }, Math.floor(Math.random() * 2000) + 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'loading': return <RefreshCw className="w-4 h-4 text-warning animate-spin" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Storm Intelligence': return <CloudLightning className="w-4 h-4" />;
      case 'Machine Learning': return <Target className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            API Testing Playground
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive testing environment for RoofIQ's Storm Intelligence API and ML services.
            Test endpoints, view responses, and integrate with your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Endpoints */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                API Endpoints
              </h3>
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedEndpoint === endpoint.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(endpoint.category)}
                        <span className="font-medium text-sm">{endpoint.name}</span>
                      </div>
                      <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                        {endpoint.method}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{endpoint.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button onClick={generateSampleRequest} className="w-full" variant="outline">
                  Generate Sample Request
                </Button>
                <Button onClick={executeAPICall} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute API Call
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* API Testing Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{getCurrentEndpoint().name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getCurrentEndpoint().category}</Badge>
                  <Badge variant={getCurrentEndpoint().method === 'POST' ? 'default' : 'secondary'}>
                    {getCurrentEndpoint().method}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="request" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="request" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Request Body (JSON)</label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(requestBody)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder="Enter JSON request body..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={generateSampleRequest} variant="outline">
                      Generate Sample
                    </Button>
                    <Button onClick={executeAPICall} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  <div className="space-y-4">
                    {getCurrentEndpoint().parameters.map((param, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm font-medium">{param.name}</code>
                          <Badge variant={param.required ? 'destructive' : 'secondary'}>
                            {param.required ? 'Required' : 'Optional'}
                          </Badge>
                          <Badge variant="outline">{param.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                        <div className="bg-muted p-2 rounded text-xs">
                          <strong>Example:</strong> <code>{JSON.stringify(param.example)}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Sample Response</label>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(JSON.stringify(getCurrentEndpoint().sampleResponse, null, 2))}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[300px]">
                      {JSON.stringify(getCurrentEndpoint().sampleResponse, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* API Call History */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent API Calls
              </h3>
              {apiCalls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No API calls yet. Execute an endpoint to see results here.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-auto">
                  {apiCalls.map((call) => (
                    <div key={call.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(call.status)}
                          <span className="font-medium text-sm">{call.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(call.timestamp).toLocaleTimeString()}</span>
                          {call.responseTime > 0 && (
                            <Badge variant="outline">{call.responseTime}ms</Badge>
                          )}
                        </div>
                      </div>
                      {call.response && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                            View Response
                          </summary>
                          <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-auto max-h-[200px]">
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};