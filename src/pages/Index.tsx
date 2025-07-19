import { HeroSection } from "@/components/HeroSection";
import { FeaturesComparison } from "@/components/FeaturesComparison";
import { TechArchitecture } from "@/components/TechArchitecture";
import { StormIntelligenceDemo } from "@/components/StormIntelligenceDemo";
import { MLPerformanceDashboard } from "@/components/MLPerformanceDashboard";
import { ReportGenerationPreview } from "@/components/ReportGenerationPreview";
import { APITestingPlayground } from "@/components/APITestingPlayground";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <HeroSection />
      <StormIntelligenceDemo />
      <MLPerformanceDashboard />
      <FeaturesComparison />
      <TechArchitecture />
    </div>
  );
};

export default Index;