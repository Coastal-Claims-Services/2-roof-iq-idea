
export interface GeocodeResult {
  address: string;
  coordinates: [number, number];
  formatted_address: string;
  place_id?: string;
  confidence: number;
}

class GeocodingService {
  private baseUrl = '/api/geocoding';

  async searchAddress(query: string): Promise<GeocodeResult[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }
    return response.json();
  }

  async reverseGeocode(coordinates: [number, number]): Promise<GeocodeResult> {
    const [longitude, latitude] = coordinates;
    const response = await fetch(`${this.baseUrl}/reverse?lat=${latitude}&lng=${longitude}`);
    if (!response.ok) {
      throw new Error('Failed to reverse geocode coordinates');
    }
    return response.json();
  }
}

export const geocodingService = new GeocodingService();
