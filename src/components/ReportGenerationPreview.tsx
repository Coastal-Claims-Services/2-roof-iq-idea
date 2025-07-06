import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Eye, 
  Palette, 
  CloudLightning,
  MapPin,
  Calendar,
  Building,
  Shield,
  TrendingUp,
  Camera,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'insurance' | 'commercial' | 'residential';
  sections: string[];
  features: string[];
  preview: string;
}

interface SampleReport {
  id: string;
  propertyAddress: string;
  claimDate: string;
  stormEvent: string;
  correlationScore: number;
  facetsAnalyzed: number;
  reportType: string;
  fileSize: string;
}

export const ReportGenerationPreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('storm-intelligence');
  const [selectedBrand, setSelectedBrand] = useState<string>('roofiq');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  const templates: ReportTemplate[] = [
    {
      id: 'storm-intelligence',
      name: 'Storm Intelligence Report',
      description: 'Comprehensive analysis with weather correlation, facet exposure, and damage probability scoring',
      category: 'insurance',
      sections: ['Executive Summary', 'Storm Correlation Analysis', 'Facet-by-Facet Assessment', 'Damage Probability Matrix', 'Supporting Evidence', 'Recommendations'],
      features: ['Real-time weather data integration', 'AI-powered damage correlation', 'Interactive storm path visualization', 'Confidence scoring'],
      preview: '/api/placeholder/600/800'
    },
    {
      id: 'standard-inspection',
      name: 'Standard Roof Inspection',
      description: 'Traditional inspection report with AI-enhanced accuracy and detailed measurements',
      category: 'commercial',
      sections: ['Property Overview', 'Roof Condition Assessment', 'Material Analysis', 'Measurements & Calculations', 'Recommendations'],
      features: ['Automated measurements', 'Material identification', 'Condition scoring', 'Cost estimates'],
      preview: '/api/placeholder/600/800'
    },
    {
      id: 'claims-adjuster',
      name: 'Claims Adjuster Report',
      description: 'Streamlined report format optimized for insurance claim processing and documentation',
      category: 'insurance',
      sections: ['Claim Details', 'Damage Documentation', 'Weather Analysis', 'Settlement Recommendations', 'Supporting Photos'],
      features: ['Claim-specific formatting', 'Weather correlation', 'Settlement calculations', 'Photo annotations'],
      preview: '/api/placeholder/600/800'
    },
    {
      id: 'homeowner-summary',
      name: 'Homeowner Summary',
      description: 'Easy-to-understand report for property owners with visual damage indicators',
      category: 'residential',
      sections: ['Property Summary', 'Damage Overview', 'Repair Priorities', 'Cost Breakdown', 'Next Steps'],
      features: ['Simple language', 'Visual damage indicators', 'Priority rankings', 'Maintenance tips'],
      preview: '/api/placeholder/600/800'
    }
  ];

  const sampleReports: SampleReport[] = [
    {
      id: '1',
      propertyAddress: '123 Storm Damaged Rd, Sarasota, FL',
      claimDate: '2024-03-15',
      stormEvent: 'Hail Storm (2.1" hail, 65mph winds)',
      correlationScore: 87,
      facetsAnalyzed: 3,
      reportType: 'Storm Intelligence Report',
      fileSize: '12.3 MB'
    },
    {
      id: '2',
      propertyAddress: '456 Hurricane Ave, Miami, FL',
      claimDate: '2024-02-28',
      stormEvent: 'Hurricane Milton (Category 2)',
      correlationScore: 94,
      facetsAnalyzed: 6,
      reportType: 'Claims Adjuster Report',
      fileSize: '18.7 MB'
    },
    {
      id: '3',
      propertyAddress: '789 Wind Damage Ln, Tampa, FL',
      claimDate: '2024-01-12',
      stormEvent: 'Severe Thunderstorm (78mph winds)',
      correlationScore: 76,
      facetsAnalyzed: 4,
      reportType: 'Standard Inspection',
      fileSize: '9.2 MB'
    }
  ];

  const brandingOptions = [
    { id: 'roofiq', name: 'RoofIQ Enterprise', logo: '🏢' },
    { id: 'white-label', name: 'White Label (Custom)', logo: '⚪' },
    { id: 'partner', name: 'Partner Co-Branding', logo: '🤝' }
  ];

  const formatOptions = [
    { id: 'pdf', name: 'PDF Report', icon: <FileText className="w-4 h-4" /> },
    { id: 'interactive', name: 'Interactive Web Report', icon: <Eye className="w-4 h-4" /> },
    { id: 'json', name: 'API Data Export', icon: <Layers className="w-4 h-4" /> }
  ];

  const getCurrentTemplate = () => templates.find(t => t.id === selectedTemplate) || templates[0];

  const handlePreviewReport = () => {
    const template = getCurrentTemplate();
    toast.success(`Generating ${template.name} preview...`);
  };

  const handleDownloadSample = (reportId: string) => {
    const report = sampleReports.find(r => r.id === reportId);
    toast.success(`Downloading ${report?.reportType} sample...`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'insurance': return 'bg-primary text-primary-foreground';
      case 'commercial': return 'bg-accent text-accent-foreground';
      case 'residential': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Report Generation Preview
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional PDF reports with storm intelligence integration, white-label branding, 
            and multiple export formats. See how RoofIQ transforms raw data into actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Templates
              </h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge className={getCategoryColor(template.category)} variant="secondary">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customization Options */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Customization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Branding</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brandingOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center gap-2">
                            <span>{option.logo}</span>
                            {option.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Export Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            {option.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handlePreviewReport} className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Preview
                </Button>
              </div>
            </Card>
          </div>

          {/* Report Preview & Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{getCurrentTemplate().name}</h3>
                <Badge className={getCategoryColor(getCurrentTemplate().category)}>
                  {getCurrentTemplate().category}
                </Badge>
              </div>

              <Tabs defaultValue="preview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Report Preview</p>
                      <p className="text-sm text-muted-foreground mb-4">Interactive preview coming soon</p>
                      <Button onClick={handlePreviewReport}>
                        Generate Live Preview
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  <div className="space-y-3">
                    {getCurrentTemplate().sections.map((section, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{section}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCurrentTemplate().features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CloudLightning className="w-5 h-5 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Sample Reports */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Sample Reports
              </h3>
              <div className="space-y-4">
                {sampleReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{report.propertyAddress}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {report.claimDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <CloudLightning className="w-3 h-3" />
                            {report.stormEvent}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadSample(report.id)}>
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-bold text-primary">{report.correlationScore}%</div>
                        <div className="text-xs text-muted-foreground">Correlation</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-bold text-accent">{report.facetsAnalyzed}</div>
                        <div className="text-xs text-muted-foreground">Facets</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-bold text-success">{report.fileSize}</div>
                        <div className="text-xs text-muted-foreground">Size</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};