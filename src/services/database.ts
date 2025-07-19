
import { Property, StormEvent, ProcessingJob, Report } from '@/types/database';

class DatabaseService {
  private baseUrl = '/api/database';

  // Property operations
  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const response = await fetch(`${this.baseUrl}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    return response.json();
  }

  async getProperty(id: string): Promise<Property | null> {
    const response = await fetch(`${this.baseUrl}/properties/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async searchProperties(query: string): Promise<Property[]> {
    const response = await fetch(`${this.baseUrl}/properties/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const response = await fetch(`${this.baseUrl}/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  // Storm event operations
  async getStormEvents(propertyId: string, dateRange?: { start: string; end: string }): Promise<StormEvent[]> {
    let url = `${this.baseUrl}/storm-events?property_id=${propertyId}`;
    if (dateRange) {
      url += `&start_date=${dateRange.start}&end_date=${dateRange.end}`;
    }
    const response = await fetch(url);
    return response.json();
  }

  async createStormEvent(eventData: Omit<StormEvent, 'id' | 'created_at'>): Promise<StormEvent> {
    const response = await fetch(`${this.baseUrl}/storm-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  }

  // Processing job operations
  async createJob(jobData: Omit<ProcessingJob, 'id' | 'status' | 'progress'>): Promise<ProcessingJob> {
    const response = await fetch(`${this.baseUrl}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...jobData, status: 'pending', progress: 0 })
    });
    return response.json();
  }

  async getJob(id: string): Promise<ProcessingJob | null> {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async updateJobProgress(id: string, progress: number, status?: ProcessingJob['status']): Promise<ProcessingJob> {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress, ...(status && { status }) })
    });
    return response.json();
  }

  // Report operations
  async createReport(reportData: Omit<Report, 'id' | 'generated_at'>): Promise<Report> {
    const response = await fetch(`${this.baseUrl}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return response.json();
  }

  async getReports(propertyId: string): Promise<Report[]> {
    const response = await fetch(`${this.baseUrl}/reports?property_id=${propertyId}`);
    return response.json();
  }
}

export const databaseService = new DatabaseService();
