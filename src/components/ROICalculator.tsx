import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export const ROICalculator = () => {
  const [reportsPerMonth, setReportsPerMonth] = useState(667); // 8000/year ÷ 12
  const [costPerReport, setCostPerReport] = useState(75);
  
  const currentAnnualCost = reportsPerMonth * 12 * costPerReport;
  const roofIQAnnualCost = 599000; // From business plan
  const annualSavings = currentAnnualCost - roofIQAnnualCost;
  const savingsPercentage = ((annualSavings / currentAnnualCost) * 100).toFixed(1);
  const breakEvenMonths = Math.ceil(280000 / (annualSavings / 12)); // Initial investment / monthly savings

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Calculate Your ROI
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See exactly how much RoofIQ can save your organization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Input */}
        <Card className="shadow-medium animate-slide-in">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>Your Current Costs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="reports">Reports per Month</Label>
              <Input
                id="reports"
                type="number"
                value={reportsPerMonth}
                onChange={(e) => setReportsPerMonth(Number(e.target.value))}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Average Cost per Report</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cost"
                  type="number"
                  value={costPerReport}
                  onChange={(e) => setCostPerReport(Number(e.target.value))}
                  className="pl-10 text-lg"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">Current Annual Cost</div>
              <div className="text-3xl font-bold text-foreground">
                ${currentAnnualCost.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Results */}
        <Card className="shadow-medium animate-pulse-glow">
          <CardHeader className="bg-gradient-primary text-white">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>RoofIQ Savings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  ${annualSavings.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {savingsPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {breakEvenMonths} months
              </div>
              <div className="text-sm text-muted-foreground">Break-even Point</div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-3">Additional Benefits:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reduced litigation costs (~$200K/year)</li>
                <li>• Faster claim processing</li>
                <li>• Enhanced customer satisfaction</li>
                <li>• Proprietary data ownership</li>
              </ul>
            </div>

            <Button variant="enterprise" size="lg" className="w-full">
              Get Detailed ROI Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};