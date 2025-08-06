import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { jsPDF } from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

function App() {
  const [address, setAddress] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [apiKeysError, setApiKeysError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<{
    area: string;
    squares: string;
    perimeter: string;
  } | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleMeasureRoof = () => {
    setIsLoading(true);
    setMeasurements(null); // Reset measurements
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Calculate perimeter in feet
  const calculatePerimeter = (feature: any) => {
    const coordinates = feature.geometry.coordinates[0];
    let perimeter = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const from = coordinates[i];
      const to = coordinates[i + 1];
      const distance = turf.distance(from, to, 'metres');
      perimeter += distance;
    }
    
    // Convert meters to feet (1 meter = 3.28084 feet)
    return (perimeter * 3.28084).toFixed(0);
  };

  // Fetch API keys from Supabase Edge Functions
  const fetchApiKeys = async () => {
    try {
      setIsInitializing(true);
      setApiKeysError(null);
      
      const [mapboxResponse, googleResponse] = await Promise.all([
        supabase.functions.invoke('get-mapbox-token'),
        supabase.functions.invoke('get-google-api-key')
      ]);
      
      if (mapboxResponse.error) {
        throw new Error('Failed to fetch Mapbox token');
      }
      
      if (googleResponse.error) {
        throw new Error('Failed to fetch Google API key');
      }
      
      setMapboxToken(mapboxResponse.data.token);
      setGoogleApiKey(googleResponse.data.apiKey);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setApiKeysError('Failed to load API keys. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Geocode address using Mapbox API
  const geocodeAddress = async (address: string) => {
    if (!mapboxToken) {
      throw new Error('Mapbox token not available');
    }
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Generate PDF Report
  const generatePDF = () => {
    if (!measurements || !mapRef.current) return;

    const pdf = new jsPDF();
    
    // Page 1 - Report Summary
    pdf.setFontSize(20);
    pdf.text('Premium Report', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    pdf.text(`Address: ${submittedAddress}`, 20, 50);
    
    // Measurements section
    pdf.setFontSize(16);
    pdf.text('Measurements', 20, 70);
    
    pdf.setFontSize(12);
    pdf.text(`Total Roof Area = ${measurements.area} sq ft`, 20, 85);
    pdf.text(`Roofing Squares = ${measurements.squares}`, 20, 95);
    pdf.text(`Perimeter = ${measurements.perimeter} ft`, 20, 105);
    
    // Waste calculation table
    pdf.text('Waste Calculation (16% suggested):', 20, 125);
    const areaWithWaste = (parseFloat(measurements.area) * 1.16).toFixed(0);
    pdf.text(`Area with 16% waste = ${areaWithWaste} sq ft`, 20, 135);
    
    // Page 2 - Add captured map image
    pdf.addPage();
    pdf.text('Roof Diagram', 105, 20, { align: 'center' });
    
    // Capture map canvas and add to PDF
    const mapCanvas = mapRef.current.getCanvas();
    const imgData = mapCanvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 20, 40, 170, 120);
    
    // Save the PDF
    pdf.save(`roof-report-${Date.now()}.pdf`);
  };

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Initialize Mapbox when address is shown
  useEffect(() => {
    if (submittedAddress && !isLoading && mapboxToken) {
      const initializeMap = async () => {
        try {
          // Set access token
          mapboxgl.accessToken = mapboxToken;
          
          // Geocode the address
          const coords = await geocodeAddress(submittedAddress);
          
          // Initialize map
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [coords.lng, coords.lat],
            zoom: 20,
            pitch: 0
          });

          // Store map reference
          mapRef.current = map;

          // Add drawing controls
          const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
              polygon: true,
              trash: true
            }
          });
          
          map.addControl(draw);

          // Listen for when drawing is completed
          map.on('draw.create', (e: any) => {
            const feature = e.features[0];
            
            // Calculate area in square meters
            const areaMeters = turf.area(feature);
            
            // Convert to square feet (1 meter = 3.28084 feet, so 1 sq meter = 10.764 sq feet)
            const areaFeet = areaMeters * 10.764;
            
            // Calculate roofing squares (1 square = 100 sq ft)
            const squares = (areaFeet / 100).toFixed(2);
            
            // Calculate perimeter
            const perimeter = calculatePerimeter(feature);
            
            // Display the results
            setMeasurements({
              area: areaFeet.toFixed(0),
              squares: squares,
              perimeter: perimeter
            });
            
            console.log('Roof measurements:', {
              area: areaFeet.toFixed(0) + ' sq ft',
              squares: squares + ' squares',
              perimeter: perimeter + ' ft'
            });
          });

          // Cleanup function
          return () => {
            mapRef.current = null;
            map.remove();
          };
        } catch (error) {
          console.error('Failed to initialize map:', error);
          alert('Failed to find address. Please try a different address.');
        }
      };
      
      initializeMap();
    }
  }, [submittedAddress, isLoading, mapboxToken]);

  // Show loading screen while fetching API keys
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            RoofIQ
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-700">Initializing app...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen if API keys failed to load
  if (apiKeysError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            RoofIQ
          </h1>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-sm text-red-700">{apiKeysError}</p>
          </div>
          <button
            onClick={fetchApiKeys}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          RoofIQ
        </h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Property Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter property address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleMeasureRoof}
            disabled={!address.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Measure Roof
          </button>
          
          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-blue-700">
                  Initializing satellite view...
                </p>
              </div>
            </div>
          )}
          
          {submittedAddress && !isLoading && (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  Selected Address:
                </h3>
                <p className="text-sm text-green-700">
                  {submittedAddress}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Satellite View
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Click to trace the roof outline. Double-click to complete.
                </p>
                <div 
                  id="map" 
                  className="w-full h-96 rounded-lg shadow-lg"
                  style={{ height: '400px', marginTop: '20px' }}
                />
              </div>
              
              {measurements && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-medium text-blue-900 mb-3">
                    Roof Measurements
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Area:</span>
                      <span className="font-medium text-blue-900">{measurements.area} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Roofing Squares:</span>
                      <span className="font-medium text-blue-900">{measurements.squares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Perimeter:</span>
                      <span className="font-medium text-blue-900">{measurements.perimeter} ft</span>
                    </div>
                  </div>
                  <button
                    onClick={generatePDF}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Generate PDF Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;