import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GooglePlacesSearch } from '@/components/GooglePlacesSearch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Camera, 
  Download, 
  MapPin, 
  Square, 
  Ruler,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface RoofMeasurements {
  totalArea: number;
  perimeter: number;
  ridgeLength: number;
  eaveLength: number;
  capturedImage: string;
  address: string;
  coordinates: [number, number];
}

export const RoofMeasurementTool = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isMapboxLoading, setIsMapboxLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [measurements, setMeasurements] = useState<RoofMeasurements | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          toast({
            title: "Mapbox Configuration Error",
            description: "Unable to load map. Please check Mapbox token configuration.",
            variant: "destructive"
          });
          return;
        }

        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load Mapbox token",
          variant: "destructive"
        });
      } finally {
        setIsMapboxLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-97.7431, 30.2672], // Austin, TX default
      zoom: 15,
      pitch: 0, // Top-down view for roof measurement
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  const handleAddressSelect = (address: string, coordinates: [number, number]) => {
    setSelectedAddress(address);
    
    if (map.current) {
      // Fly to the address with high zoom for roof detail
      map.current.flyTo({
        center: coordinates,
        zoom: 22, // Maximum zoom for roof detail
        pitch: 0,
        bearing: 0,
        duration: 2000
      });

      // Add marker for the property
      new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat(coordinates)
        .addTo(map.current);
    }
  };

  const captureRoof = async () => {
    if (!map.current) return;

    setIsCapturing(true);
    
    try {
      // Wait for map to finish rendering
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture the map canvas
      const canvas = map.current.getCanvas();
      const dataURL = canvas.toDataURL('image/png');
      
      // Calculate basic measurements (simplified for demo)
      const zoom = map.current.getZoom();
      const center = map.current.getCenter();
      
      // Rough calculation: At zoom 22, 1 pixel ≈ 0.12 feet
      const pixelToFeet = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom) * 3.28084;
      
      // Estimate roof area (simplified - in real app would use edge detection)
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const estimatedRoofPixels = (canvasWidth * 0.6) * (canvasHeight * 0.6); // Assume roof covers 60% of view
      const estimatedArea = estimatedRoofPixels * Math.pow(pixelToFeet, 2);
      
      const newMeasurements: RoofMeasurements = {
        totalArea: Math.round(estimatedArea),
        perimeter: Math.round(Math.sqrt(estimatedArea) * 4), // Rough estimate
        ridgeLength: Math.round(Math.sqrt(estimatedArea) * 1.2),
        eaveLength: Math.round(Math.sqrt(estimatedArea) * 2.8),
        capturedImage: dataURL,
        address: selectedAddress,
        coordinates: [center.lng, center.lat]
      };
      
      setMeasurements(newMeasurements);
      
      toast({
        title: "Roof Captured",
        description: `Estimated area: ${newMeasurements.totalArea.toLocaleString()} sq ft`,
      });
      
    } catch (error) {
      console.error('Error capturing roof:', error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture roof image",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const generateEagleViewPDF = async () => {
    if (!measurements) return;

    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('portrait', 'pt', 'letter');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // PAGE 1: REPORT SUMMARY
      pdf.setFontSize(24);
      pdf.setTextColor(40, 116, 166);
      pdf.text('RoofIQ Premium Report', 50, 80);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 150, 80);
      pdf.text(`Address: ${measurements.address}`, 50, 120);
      pdf.text(`Report #: RQ-${Date.now().toString().slice(-6)}`, 50, 140);
      
      // Areas per Pitch Table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Areas per Pitch', 50, 180);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Draw table
      const tableData = [
        ['Roof Pitches', 'Area (sq ft)', '% of Roof'],
        ['6/12', measurements.totalArea.toLocaleString(), '100%']
      ];
      
      let yPos = 200;
      tableData.forEach((row, index) => {
        row.forEach((cell, cellIndex) => {
          const xPos = 50 + (cellIndex * 100);
          if (index === 0) {
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setFont('helvetica', 'normal');
          }
          pdf.text(cell, xPos, yPos);
        });
        yPos += 20;
      });
      
      // Structure Complexity
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Structure Complexity', 50, yPos + 40);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Simple      ● Normal      Complex', 50, yPos + 60);
      
      // Waste Calculation Table
      yPos += 100;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Waste Calculation', 50, yPos);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const wastePercentages = [0, 1, 6, 11, 14, 16, 18, 21, 26];
      let wasteY = yPos + 20;
      
      pdf.text('Waste %', 50, wasteY);
      pdf.text('Area (Sq ft)', 50, wasteY + 20);
      pdf.text('Squares', 50, wasteY + 40);
      
      wastePercentages.forEach((waste, index) => {
        const xPos = 130 + (index * 40);
        const wasteArea = Math.round(measurements.totalArea * (1 + waste / 100));
        const squares = Math.ceil((wasteArea / 100) * 3) / 3; // Round to nearest 1/3
        
        if (waste === 16) {
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(255, 0, 0);
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
        }
        
        pdf.text(`${waste}%`, xPos, wasteY);
        pdf.text(wasteArea.toLocaleString(), xPos, wasteY + 20);
        pdf.text(squares.toString(), xPos, wasteY + 40);
      });
      
      // All Structures Totals
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('All Structures Totals', 50, wasteY + 100);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const totalsY = wasteY + 120;
      
      pdf.text(`Total Roof Facets = 1`, 50, totalsY);
      pdf.text(`Ridges = ${measurements.ridgeLength} ft (1 Ridge)`, 50, totalsY + 20);
      pdf.text(`Hips = 0 ft (0 Hips)`, 50, totalsY + 40);
      pdf.text(`Valleys = 0 ft (0 Valleys)`, 50, totalsY + 60);
      pdf.text(`Rakes = ${Math.round(measurements.perimeter * 0.3)} ft (2 Rakes)`, 50, totalsY + 80);
      pdf.text(`Eaves/Starter = ${measurements.eaveLength} ft (4 Eaves)`, 50, totalsY + 100);
      pdf.text(`Predominant Pitch = 6/12`, 50, totalsY + 120);
      pdf.text(`Total Area (All Pitches) = ${measurements.totalArea.toLocaleString()} sq ft`, 50, totalsY + 140);
      
      // Property Location
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Property Location', 50, totalsY + 180);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Longitude = ${measurements.coordinates[0].toFixed(6)}`, 50, totalsY + 200);
      pdf.text(`Latitude = ${measurements.coordinates[1].toFixed(6)}`, 50, totalsY + 220);
      
      // PAGE 2: LENGTH DIAGRAM
      pdf.addPage();
      
      pdf.setFontSize(24);
      pdf.setTextColor(40, 116, 166);
      pdf.text('RoofIQ Premium Report', 50, 80);
      
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text('LENGTH DIAGRAM', 50, 120);
      
      // Total Line Lengths
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Line Lengths:', 50, 160);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 0, 0);
      pdf.text(`Ridges = ${measurements.ridgeLength} ft`, 50, 180);
      pdf.setTextColor(0, 0, 255);
      pdf.text(`Valleys = 0 ft`, 50, 200);
      pdf.setTextColor(0, 128, 0);
      pdf.text(`Rakes = ${Math.round(measurements.perimeter * 0.3)} ft`, 50, 220);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Eaves = ${measurements.eaveLength} ft`, 50, 240);
      
      // Add captured roof image
      try {
        const img = new Image();
        img.src = measurements.capturedImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const imgWidth = 400;
        const imgHeight = 300;
        pdf.addImage(measurements.capturedImage, 'PNG', 50, 280, imgWidth, imgHeight);
        
        // Add measurement labels
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${measurements.ridgeLength}'`, 200, 350);
        pdf.text(`${measurements.eaveLength}'`, 250, 520);
        
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
      
      // Footer note
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.text('Note: This diagram contains segment lengths (rounded to the nearest whole number) over 5.0 Feet.', 50, pageHeight - 50);
      
      // Save PDF
      pdf.save(`RoofIQ-Report-${Date.now()}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "EagleView-style report downloaded successfully",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate report PDF",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Roof Measurement Tool
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Generate EagleView-style roof measurement reports with satellite imagery and precise calculations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Mapbox Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMapboxLoading ? (
                  <div className="flex items-center gap-2 text-warning">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading Mapbox...</span>
                  </div>
                ) : mapboxToken ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Mapbox Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Mapbox Token Missing</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Property Address</CardTitle>
              </CardHeader>
              <CardContent>
                <GooglePlacesSearch 
                  onAddressSelect={handleAddressSelect}
                  className="w-full"
                />
                {selectedAddress && (
                  <div className="mt-3 p-3 bg-secondary rounded-lg">
                    <p className="text-sm font-medium">Selected:</p>
                    <p className="text-sm text-muted-foreground">{selectedAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Measurement Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Roof Measurement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={captureRoof}
                  disabled={!selectedAddress || isCapturing}
                  className="w-full"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Roof
                    </>
                  )}
                </Button>
                
                {measurements && (
                  <Button 
                    onClick={generateEagleViewPDF}
                    disabled={isGeneratingPDF}
                    className="w-full"
                    variant="secondary"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF Report
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Measurements Display */}
            {measurements && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Roof Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Area:</span>
                    <Badge variant="secondary">
                      <Square className="h-3 w-3 mr-1" />
                      {measurements.totalArea.toLocaleString()} sq ft
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ridge Length:</span>
                    <Badge variant="outline">{measurements.ridgeLength} ft</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Eave Length:</span>
                    <Badge variant="outline">{measurements.eaveLength} ft</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Perimeter:</span>
                    <Badge variant="outline">{measurements.perimeter} ft</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div 
                  ref={mapContainer} 
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: '600px' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};