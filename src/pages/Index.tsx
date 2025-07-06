import { HeroSection } from "@/components/HeroSection";
import { FeaturesComparison } from "@/components/FeaturesComparison";
import { ROICalculator } from "@/components/ROICalculator";
import { TechArchitecture } from "@/components/TechArchitecture";
import { DemoSection } from "@/components/DemoSection";
import { StormIntelligenceDemo } from "@/components/StormIntelligenceDemo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <HeroSection />
      <StormIntelligenceDemo />
      <FeaturesComparison />
      <DemoSection />
      <ROICalculator />
      <TechArchitecture />
    </div>
  );
};

export default Index;