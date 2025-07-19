
export interface Property {
  id: string;
  address: string;
  coordinates: [number, number];
  created_at: string;
  updated_at: string;
  measurements?: PropertyMeasurements;
  storm_correlation_score?: number;
}

export interface PropertyMeasurements {
  total_area: number;
  facets: PropertyFacet[];
  predominant_pitch: string;
  confidence_score: number;
}

export interface PropertyFacet {
  id: string;
  coordinates: [number, number][];
  pitch: string;
  area: number;
  exposure_score: number;
  damage_probability: number;
}

export interface StormEvent {
  id: string;
  property_id: string;
  event_type: 'hail' | 'wind' | 'tornado' | 'hurricane';
  intensity: number;
  confidence: number;
  coordinates: [number, number];
  path?: [number, number][];
  event_date: string;
  max_wind_speed?: number;
  max_hail_size?: number;
  source: string;
  created_at: string;
}

export interface ProcessingJob {
  id: string;
  property_id: string;
  job_type: 'measurement' | 'storm_analysis' | 'report_generation';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  result_data?: any;
}

export interface Report {
  id: string;
  property_id: string;
  report_type: 'pdf' | 'excel';
  file_url: string;
  generated_at: string;
  expires_at?: string;
}
