import { Property, StormEvent, ProcessingJob, Report } from '@/types/database';

class DatabaseService {
  // Mock database service with in-memory storage
  private mockProperties: Property[] = [];
  private mockJobs: ProcessingJob[] = [];
  private mockReports: Report[] = [];
  private mockStormEvents: StormEvent[] = [];

  // Property operations
  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const newProperty: Property = {
      ...propertyData,
      id: `prop_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.mockProperties.push(newProperty);
    return newProperty;
  }

  async getProperty(id: string): Promise<Property | null> {
    return this.mockProperties.find(p => p.id === id) || null;
  }

  async searchProperties(query: string): Promise<Property[]> {
    return this.mockProperties.filter(p => 
      p.address.toLowerCase().includes(query.toLowerCase())
    );
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const propertyIndex = this.mockProperties.findIndex(p => p.id === id);
    if (propertyIndex >= 0) {
      this.mockProperties[propertyIndex] = {
        ...this.mockProperties[propertyIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return this.mockProperties[propertyIndex];
    }
    throw new Error('Property not found');
  }

  // Storm event operations
  async getStormEvents(propertyId: string, dateRange?: { start: string; end: string }): Promise<StormEvent[]> {
    return this.mockStormEvents.filter(storm => {
      // For mock data, return all storms
      if (dateRange) {
        const stormDate = new Date(storm.event_date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return stormDate >= startDate && stormDate <= endDate;
      }
      return true;
    });
  }

  async createStormEvent(eventData: Omit<StormEvent, 'id' | 'created_at'>): Promise<StormEvent> {
    const newEvent: StormEvent = {
      ...eventData,
      id: `storm_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    this.mockStormEvents.push(newEvent);
    return newEvent;
  }

  // Processing job operations
  async createJob(jobData: Omit<ProcessingJob, 'id' | 'status' | 'progress'>): Promise<ProcessingJob> {
    const newJob: ProcessingJob = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'pending',
      progress: 0
    };
    
    this.mockJobs.push(newJob);
    return newJob;
  }

  async getJob(id: string): Promise<ProcessingJob | null> {
    return this.mockJobs.find(j => j.id === id) || null;
  }

  async updateJobProgress(id: string, progress: number, status?: ProcessingJob['status']): Promise<ProcessingJob> {
    const jobIndex = this.mockJobs.findIndex(j => j.id === id);
    if (jobIndex >= 0) {
      this.mockJobs[jobIndex] = {
        ...this.mockJobs[jobIndex],
        progress,
        ...(status && { status })
      };
      return this.mockJobs[jobIndex];
    }
    throw new Error('Job not found');
  }

  // Report operations
  async createReport(reportData: Omit<Report, 'id' | 'generated_at'>): Promise<Report> {
    const newReport: Report = {
      ...reportData,
      id: `report_${Date.now()}`,
      generated_at: new Date().toISOString()
    };
    
    this.mockReports.push(newReport);
    return newReport;
  }

  async getReports(propertyId: string): Promise<Report[]> {
    return this.mockReports.filter(r => r.property_id === propertyId);
  }
}

export const databaseService = new DatabaseService();