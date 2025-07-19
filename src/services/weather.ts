
import { StormEvent } from '@/types/database';

export interface WeatherAlert {
  id: string;
  type: 'hail' | 'wind' | 'tornado' | 'hurricane';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  coordinates: [number, number];
  radius_miles: number;
  issued_at: string;
  expires_at: string;
}

class WeatherService {
  private baseUrl = '/api/weather';

  async getHistoricalStorms(
    coordinates: [number, number], 
    startDate: string, 
    endDate: string,
    radiusMiles: number = 10
  ): Promise<StormEvent[]> {
    const [longitude, latitude] = coordinates;
    const response = await fetch(
      `${this.baseUrl}/historical?lat=${latitude}&lng=${longitude}&start=${startDate}&end=${endDate}&radius=${radiusMiles}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch historical storm data');
    }
    return response.json();
  }

  async getCurrentAlerts(coordinates: [number, number], radiusMiles: number = 25): Promise<WeatherAlert[]> {
    const [longitude, latitude] = coordinates;
    const response = await fetch(
      `${this.baseUrl}/alerts?lat=${latitude}&lng=${longitude}&radius=${radiusMiles}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts');
    }
    return response.json();
  }

  async calculateStormCorrelation(propertyId: string, analysisDate: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/correlation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId, analysis_date: analysisDate })
    });
    if (!response.ok) {
      throw new Error('Failed to calculate storm correlation');
    }
    const result = await response.json();
    return result.correlation_score;
  }
}

export const weatherService = new WeatherService();
