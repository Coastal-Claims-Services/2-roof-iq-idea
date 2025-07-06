import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CloudLightning, Wind, AlertTriangle, MapPin, Activity, Zap } from "lucide-react";
import { toast } from "sonner";

interface StormEvent {
  id: string;
  type: 'hail' | 'wind' | 'tornado';
  intensity: number;
  confidence: number;
  coordinates: [number, number];
  path: [number, number][];
  date: string;
  maxWindSpeed?: number;
  maxHailSize?: number;
}

interface PropertyData {
  address: string;
  coordinates: [number, number];
  facets: Array<{
    id: string;
    coordinates: [number, number][];
    pitch: string;
    exposure: number;
    damageProb: number;
  }>;
}

export const StormIntelligenceDemo = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [stormEvents, setStormEvents] = useState<StormEvent[]>([]);
  const [correlationScore, setCorrelationScore] = useState(0);

  // Demo data
  const demoProperty: PropertyData = {
    address: "123 Storm Damaged Rd, Sarasota, FL",
    coordinates: [-82.5307, 27.3364],
    facets: [
      { id: 'A', coordinates: [[-82.531, 27.337], [-82.530, 27.337], [-82.530, 27.336], [-82.531, 27.336]], pitch: '6:12', exposure: 0.9, damageProb: 0.85 },
      { id: 'B', coordinates: [[-82.530, 27.337], [-82.529, 27.337], [-82.529, 27.336], [-82.530, 27.336]], pitch: '6:12', exposure: 0.7, damageProb: 0.62 },
      { id: 'C', coordinates: [[-82.531, 27.336], [-82.530, 27.336], [-82.530, 27.335], [-82.531, 27.335]], pitch: '8:12', exposure: 0.4, damageProb: 0.31 },
    ]
  };

  const demoStorms: StormEvent[] = [
    {
      id: 'storm-1',
      type: 'hail',
      intensity: 2.1,
      confidence: 0.92,
      coordinates: [-82.5307, 27.3364],
      path: [[-82.55, 27.35], [-82.53, 27.34], [-82.51, 27.33]],
      date: '2024-03-15T14:30:00Z',
      maxHailSize: 2.1,
      maxWindSpeed: 65
    },
    {
      id: 'storm-2', 
      type: 'wind',
      intensity: 85,
      confidence: 0.88,
      coordinates: [-82.5285, 27.3385],
      path: [[-82.54, 27.35], [-82.52, 27.34], [-82.50, 27.33]],
      date: '2024-03-15T15:45:00Z',
      maxWindSpeed: 85
    }
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-82.5307, 27.3364],
      zoom: 16,
      pitch: 45,
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      loadDemoData();
      toast.success("Storm Intelligence Demo Loaded");
    });
  };

  const loadDemoData = () => {
    if (!map.current) return;

    // Add property marker
    new mapboxgl.Marker({ color: '#dc2626' })
      .setLngLat(demoProperty.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${demoProperty.address}</h3>
          <p class="text-xs text-gray-600">Click to analyze storm correlation</p>
        </div>
      `))
      .addTo(map.current);

    // Add storm path
    map.current.addSource('storm-path', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { type: 'storm-path' },
        geometry: {
          type: 'LineString',
          coordinates: demoStorms[0].path
        }
      }
    });

    map.current.addLayer({
      id: 'storm-path-line',
      type: 'line',
      source: 'storm-path',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#fbbf24',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Add storm impact zones
    demoStorms.forEach((storm, index) => {
      const circle = turf.circle(storm.coordinates, 0.5, { units: 'miles' });
      
      map.current!.addSource(`storm-impact-${index}`, {
        type: 'geojson',
        data: circle
      });

      map.current!.addLayer({
        id: `storm-impact-${index}`,
        type: 'fill',
        source: `storm-impact-${index}`,
        paint: {
          'fill-color': storm.type === 'hail' ? '#3b82f6' : '#ef4444',
          'fill-opacity': 0.3
        }
      });

      // Add storm marker
      new mapboxgl.Marker({ color: storm.type === 'hail' ? '#3b82f6' : '#ef4444' })
        .setLngLat(storm.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm capitalize">${storm.type} Storm</h3>
            <p class="text-xs">Confidence: ${(storm.confidence * 100).toFixed(0)}%</p>
            <p class="text-xs">${storm.type === 'hail' ? `Hail: ${storm.maxHailSize}"` : `Wind: ${storm.maxWindSpeed}mph`}</p>
          </div>
        `))
        .addTo(map.current!);
    });

    setSelectedProperty(demoProperty);
    setStormEvents(demoStorms);
    setCorrelationScore(0.87);
  };

  const turf = {
    circle: (center: [number, number], radius: number, options: any) => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [generateCircleCoords(center, radius)]
      }
    })
  };

  const generateCircleCoords = (center: [number, number], radiusMiles: number) => {
    const coords = [];
    const radiusDeg = radiusMiles / 69; // Rough conversion
    for (let i = 0; i <= 360; i += 10) {
      const angle = i * Math.PI / 180;
      coords.push([
        center[0] + radiusDeg * Math.cos(angle),
        center[1] + radiusDeg * Math.sin(angle)
      ]);
    }
    return coords;
  };

  const runStormAnalysis = () => {
    toast.success("Storm correlation analysis complete!");
    // Animation effect for correlation score
    let current = 0;
    const target = 87;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCorrelationScore(current / 100);
    }, 50);
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
  }, [mapboxToken]);

  const getStormIcon = (type: string) => {
    switch (type) {
      case 'hail': return <CloudLightning className="w-4 h-4" />;
      case 'wind': return <Wind className="w-4 h-4" />;
      case 'tornado': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Storm Intelligence Demo
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how RoofIQ correlates storm events with roof damage using advanced AI analysis.
            This is what sets us apart from EagleView and QuickSquares.
          </p>
        </div>

        {!mapboxToken && (
          <Card className="p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Enter Mapbox Token
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get your free token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => mapboxToken && initializeMap()}>
                Load Demo
              </Button>
            </div>
          </Card>
        )}

        {mapboxToken && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div ref={mapContainer} className="h-[600px] w-full" />
                <div className="p-4 bg-card border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Live Analysis
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Sarasota, FL - March 15, 2024
                      </span>
                    </div>
                    <Button onClick={runStormAnalysis} size="sm">
                      Run Analysis
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              {/* Correlation Score */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Storm Correlation</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {(correlationScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Confidence Score
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${correlationScore * 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Storm Events */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detected Events</h3>
                <div className="space-y-3">
                  {stormEvents.map((storm) => (
                    <div key={storm.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${storm.type === 'hail' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          {getStormIcon(storm.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{storm.type} Storm</p>
                          <p className="text-xs text-muted-foreground">
                            {storm.type === 'hail' ? `${storm.maxHailSize}" hail` : `${storm.maxWindSpeed}mph winds`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {(storm.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Facet Analysis */}
              {selectedProperty && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Facet Exposure</h3>
                  <div className="space-y-3">
                    {selectedProperty.facets.map((facet) => (
                      <div key={facet.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Facet {facet.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {facet.pitch} pitch
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {(facet.damageProb * 100).toFixed(0)}% damage risk
                          </p>
                          <div className="w-16 bg-muted rounded-full h-1 mt-1">
                            <div 
                              className={`h-1 rounded-full ${facet.damageProb > 0.7 ? 'bg-destructive' : facet.damageProb > 0.4 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${facet.damageProb * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};