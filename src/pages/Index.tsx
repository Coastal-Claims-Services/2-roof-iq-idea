import { HeroSection } from "@/components/HeroSection";
import { FeaturesComparison } from "@/components/FeaturesComparison";
import { ROICalculator } from "@/components/ROICalculator";
import { TechArchitecture } from "@/components/TechArchitecture";
import { DemoSection } from "@/components/DemoSection";
import { StormIntelligenceDemo } from "@/components/StormIntelligenceDemo";
import { MLPerformanceDashboard } from "@/components/MLPerformanceDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <HeroSection />
      <StormIntelligenceDemo />
      <MLPerformanceDashboard />
      <FeaturesComparison />
      <DemoSection />
      <ROICalculator />
      <TechArchitecture />
    </div>
  );
};

export default Index;