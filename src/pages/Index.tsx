import { HeroSection } from "@/components/HeroSection";
import { FeaturesComparison } from "@/components/FeaturesComparison";
import { ROICalculator } from "@/components/ROICalculator";
import { TechArchitecture } from "@/components/TechArchitecture";
import { DemoSection } from "@/components/DemoSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <HeroSection />
      <FeaturesComparison />
      <DemoSection />
      <ROICalculator />
      <TechArchitecture />
    </div>
  );
};

export default Index;