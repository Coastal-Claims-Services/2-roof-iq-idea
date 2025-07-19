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
  // Mock weather service with realistic storm data
  async getHistoricalStorms(
    coordinates: [number, number], 
    startDate: string, 
    endDate: string,
    radiusMiles: number = 10
  ): Promise<StormEvent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const [longitude, latitude] = coordinates;
    
    // Generate mock storm events based on location
    const storms: StormEvent[] = [
      {
        id: 'storm_1',
        property_id: 'mock_property',
        event_type: 'hail',
        intensity: 8.5,
        confidence: 0.94,
        coordinates: [longitude + 0.02, latitude + 0.01],
        path: [
          [longitude - 0.05, latitude - 0.02],
          [longitude + 0.05, latitude + 0.02]
        ],
        event_date: '2024-04-15T14:30:00Z',
        max_hail_size: 2.1,
        source: 'NOAA',
        created_at: new Date().toISOString()
      },
      {
        id: 'storm_2',
        property_id: 'mock_property',
        event_type: 'wind',
        intensity: 7.2,
        confidence: 0.87,
        coordinates: [longitude - 0.01, latitude + 0.03],
        path: [
          [longitude - 0.08, latitude],
          [longitude + 0.02, latitude + 0.06]
        ],
        event_date: '2024-06-22T18:45:00Z',
        max_wind_speed: 85,
        source: 'Weather Underground',
        created_at: new Date().toISOString()
      },
      {
        id: 'storm_3',
        property_id: 'mock_property',
        event_type: 'tornado',
        intensity: 6.8,
        confidence: 0.76,
        coordinates: [longitude + 0.04, latitude - 0.02],
        path: [
          [longitude + 0.02, latitude - 0.05],
          [longitude + 0.06, latitude + 0.01]
        ],
        event_date: '2024-08-10T21:15:00Z',
        max_wind_speed: 120,
        source: 'Storm Prediction Center',
        created_at: new Date().toISOString()
      }
    ];
    
    return storms;
  }

  async getCurrentAlerts(coordinates: [number, number], radiusMiles: number = 25): Promise<WeatherAlert[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock current alerts
    return [
      {
        id: 'alert_1',
        type: 'hail',
        severity: 'moderate',
        title: 'Hail Warning',
        description: 'Hail up to 1 inch in diameter expected in the area.',
        coordinates: coordinates,
        radius_miles: radiusMiles,
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  async calculateStormCorrelation(propertyId: string, analysisDate: string): Promise<number> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return realistic correlation score based on mock data
    return Math.random() * 0.4 + 0.6; // Returns value between 0.6-1.0
  }
}

export const weatherService = new WeatherService();