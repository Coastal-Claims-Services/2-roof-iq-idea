import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CloudLightning, Wind, AlertTriangle, Activity, Zap } from "lucide-react";
import { toast } from "sonner";
import { AddressSearch } from "./AddressSearch";
import { ProcessingStatus } from "./ProcessingStatus";
import { GeocodeResult } from '@/services/geocoding';
import { Property, StormEvent, ProcessingJob } from '@/types/database';
import { databaseService } from '@/services/database';
import { weatherService } from '@/services/weather';

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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [stormEvents, setStormEvents] = useState<StormEvent[]>([]);
  const [correlationScore, setCorrelationScore] = useState(0);
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');

  // Use local state for Mapbox token
  const MAPBOX_TOKEN = mapboxToken;
  
  // Debug logging
  console.log('Debug - mapboxToken:', mapboxToken);
  console.log('Debug - MAPBOX_TOKEN:', MAPBOX_TOKEN);
  console.log('Debug - Should show address search:', !!MAPBOX_TOKEN);

  const initializeMap = (coordinates: [number, number]) => {
    if (!mapContainer.current || !MAPBOX_TOKEN || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: coordinates,
      zoom: 16,
      pitch: 45,
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      toast.success("Map loaded successfully");
    });
  };

  const handleAddressSelect = async (result: GeocodeResult) => {
    try {
      // Create or find property in database
      const propertyData = {
        address: result.formatted_address,
        coordinates: result.coordinates
      };

      const property = await databaseService.createProperty(propertyData);
      setSelectedProperty(property);
      
      // Initialize map with selected coordinates
      initializeMap(result.coordinates);
      
      // Start storm analysis job
      await startStormAnalysis(property.id);
      
      toast.success("Property analysis initiated");
    } catch (error) {
      console.error('Failed to process address:', error);
      toast.error("Failed to analyze property. Please try again.");
    }
  };

  const startStormAnalysis = async (propertyId: string) => {
    try {
      setIsAnalyzing(true);
      
      // Create processing job for storm analysis
      const job = await databaseService.createJob({
        property_id: propertyId,
        job_type: 'storm_analysis'
      });
      
      setCurrentJob(job);
      
      // Fetch historical storm data
      if (selectedProperty) {
        const storms = await weatherService.getHistoricalStorms(
          selectedProperty.coordinates,
          '2024-01-01',
          '2024-12-31'
        );
        
        setStormEvents(storms);
        
        // Calculate correlation score
        const correlation = await weatherService.calculateStormCorrelation(
          propertyId,
          new Date().toISOString()
        );
        
        setCorrelationScore(correlation);
        
        // Update job as completed
        await databaseService.updateJobProgress(job.id, 100, 'completed');
      }
    } catch (error) {
      console.error('Storm analysis failed:', error);
      toast.error("Storm analysis failed. Please try again.");
      
      if (currentJob) {
        await databaseService.updateJobProgress(currentJob.id, 0, 'failed');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadMapData = () => {
    if (!map.current || !selectedProperty) return;

    // Add property marker
    new mapboxgl.Marker({ color: '#dc2626' })
      .setLngLat(selectedProperty.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${selectedProperty.address}</h3>
          <p class="text-xs text-gray-600">Storm Analysis Complete</p>
        </div>
      `))
      .addTo(map.current);

    // Add storm events to map
    stormEvents.forEach((storm, index) => {
      if (storm.coordinates) {
        const circle = generateCircleCoords(storm.coordinates, 0.5);
        
        map.current!.addSource(`storm-impact-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [circle]
            }
          }
        });

        map.current!.addLayer({
          id: `storm-impact-${index}`,
          type: 'fill',
          source: `storm-impact-${index}`,
          paint: {
            'fill-color': storm.event_type === 'hail' ? '#3b82f6' : '#ef4444',
            'fill-opacity': 0.3
          }
        });

        new mapboxgl.Marker({ 
          color: storm.event_type === 'hail' ? '#3b82f6' : '#ef4444' 
        })
          .setLngLat(storm.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm capitalize">${storm.event_type} Storm</h3>
              <p class="text-xs">Confidence: ${(storm.confidence * 100).toFixed(0)}%</p>
              <p class="text-xs">Date: ${new Date(storm.event_date).toLocaleDateString()}</p>
            </div>
          `))
          .addTo(map.current!);
      }
    });
  };

  useEffect(() => {
    if (isMapLoaded && selectedProperty && stormEvents.length > 0) {
      loadMapData();
    }
  }, [isMapLoaded, selectedProperty, stormEvents]);

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
    const radiusDeg = radiusMiles / 69;
    for (let i = 0; i <= 360; i += 10) {
      const angle = i * Math.PI / 180;
      coords.push([
        center[0] + radiusDeg * Math.cos(angle),
        center[1] + radiusDeg * Math.sin(angle)
      ]);
    }
    return coords;
  };

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
            Storm Intelligence System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time storm correlation analysis with live weather data and property intelligence.
          </p>
        </div>

        {/* Mapbox Token Input - Always visible at top */}
        <Card className="p-8 mb-8 max-w-2xl mx-auto border-2 border-primary/20">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">🗺️ Enter Mapbox API Token</h3>
            <p className="text-muted-foreground">
              Get your free public token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">mapbox.com</a> to enable maps and address search
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token (pk.eyJ1...)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1 h-12 text-center"
            />
            <Button 
              onClick={() => {
                if (mapboxToken.trim()) {
                  toast.success("Mapbox token configured! You can now search addresses.");
                } else {
                  toast.error("Please enter a valid Mapbox token.");
                }
              }}
              disabled={!mapboxToken.trim()}
              size="lg"
              className="min-w-[120px]"
            >
              {mapboxToken ? 'Update' : 'Configure'}
            </Button>
          </div>
          {mapboxToken && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                ✅ Mapbox configured! You can now search for addresses below.
              </p>
            </div>
          )}
        </Card>

        {/* Address Search */}
        <div className="mb-8">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Debug: Token = "{mapboxToken}" | Show Search = {MAPBOX_TOKEN ? 'YES' : 'NO'}
          </p>
          {MAPBOX_TOKEN ? (
            <div className="max-w-md mx-auto">
              <AddressSearch onAddressSelect={handleAddressSelect} />
            </div>
          ) : (
            <p className="text-center text-red-500">Address search hidden - token not detected</p>
          )}
        </div>

        {selectedProperty && (
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
                        {selectedProperty.address}
                      </span>
                    </div>
                    <Button 
                      onClick={() => startStormAnalysis(selectedProperty.id)} 
                      size="sm"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              {/* Processing Status */}
              {currentJob && (
                <ProcessingStatus
                  jobId={currentJob.id}
                  onComplete={() => toast.success("Analysis completed!")}
                  onError={(error) => toast.error(`Analysis failed: ${error}`)}
                />
              )}

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
                  {stormEvents.length > 0 ? (
                    stormEvents.map((storm) => (
                      <div key={storm.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${storm.event_type === 'hail' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                            {getStormIcon(storm.event_type)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{storm.event_type} Storm</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(storm.event_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {(storm.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No storm events detected for this location.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
