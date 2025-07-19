
export interface GeocodeResult {
  address: string;
  coordinates: [number, number];
  formatted_address: string;
  place_id?: string;
  confidence: number;
}

class GeocodingService {
  // Mock geocoding service with sample addresses
  async searchAddress(query: string): Promise<GeocodeResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock results based on query
    const mockResults: GeocodeResult[] = [
      {
        address: "123 Main Street, Austin, TX 78701",
        coordinates: [-97.7431, 30.2672],
        formatted_address: "123 Main Street, Austin, TX 78701, USA",
        place_id: "mock_austin_1",
        confidence: 0.95
      },
      {
        address: "456 Oak Avenue, Dallas, TX 75201",
        coordinates: [-96.7970, 32.7767],
        formatted_address: "456 Oak Avenue, Dallas, TX 75201, USA", 
        place_id: "mock_dallas_1",
        confidence: 0.89
      },
      {
        address: "789 Pine Road, Houston, TX 77002",
        coordinates: [-95.3698, 29.7604],
        formatted_address: "789 Pine Road, Houston, TX 77002, USA",
        place_id: "mock_houston_1", 
        confidence: 0.92
      }
    ];

    // Filter results based on query
    return mockResults.filter(result => 
      result.address.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes('texas') ||
      query.toLowerCase().includes('tx') ||
      query.length < 3
    );
  }

  async reverseGeocode(coordinates: [number, number]): Promise<GeocodeResult> {
    const [longitude, latitude] = coordinates;
    // Mock reverse geocoding
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      address: `${Math.abs(latitude).toFixed(3)}°, ${Math.abs(longitude).toFixed(3)}°`,
      coordinates: coordinates,
      formatted_address: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      place_id: `coord_${Date.now()}`,
      confidence: 0.85
    };
  }
}

export const geocodingService = new GeocodingService();
