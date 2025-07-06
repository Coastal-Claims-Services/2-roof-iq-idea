import { Check, X, Clock, Target, Brain, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FeaturesComparison = () => {
  const features = [
    {
      feature: "Measurement Accuracy",
      eagleView: "±5%",
      quickSquares: "±7%",
      roofIQ: "±3%",
      roofIQBest: true
    },
    {
      feature: "Processing Time",
      eagleView: "24-48 hrs",
      quickSquares: "2-4 hrs", 
      roofIQ: "<2 min",
      roofIQBest: true
    },
    {
      feature: "Storm Correlation",
      eagleView: false,
      quickSquares: false,
      roofIQ: true,
      roofIQBest: true
    },
    {
      feature: "Damage Detection",
      eagleView: false,
      quickSquares: false,
      roofIQ: true,
      roofIQBest: true
    },
    {
      feature: "Permit History",
      eagleView: false,
      quickSquares: false,
      roofIQ: true,
      roofIQBest: true
    },
    {
      feature: "Price per Report",
      eagleView: "$75-150",
      quickSquares: "$40-75",
      roofIQ: "In-house",
      roofIQBest: true
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          RoofIQ vs Industry Standards
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See how RoofIQ outperforms traditional roof measurement services across all key metrics
        </p>
      </div>

      <Card className="shadow-strong animate-slide-in">
        <CardHeader className="bg-gradient-card">
          <CardTitle className="text-2xl text-center">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">EagleView</th>
                  <th className="text-center p-4 font-semibold">QuickSquares</th>
                  <th className="text-center p-4 font-semibold bg-primary text-primary-foreground">RoofIQ</th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium flex items-center space-x-2">
                      {item.feature === "Measurement Accuracy" && <Target className="w-4 h-4 text-accent" />}
                      {item.feature === "Processing Time" && <Clock className="w-4 h-4 text-accent" />}
                      {item.feature === "Storm Correlation" && <Brain className="w-4 h-4 text-accent" />}
                      {item.feature === "Damage Detection" && <Shield className="w-4 h-4 text-accent" />}
                      <span>{item.feature}</span>
                    </td>
                    <td className="p-4 text-center">
                      {typeof item.eagleView === 'boolean' ? (
                        item.eagleView ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{item.eagleView}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof item.quickSquares === 'boolean' ? (
                        item.quickSquares ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">{item.quickSquares}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {typeof item.roofIQ === 'boolean' ? (
                        item.roofIQ ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-destructive mx-auto" />
                      ) : (
                        <span className={`font-semibold ${item.roofIQBest ? 'text-success' : 'text-foreground'}`}>
                          {item.roofIQ}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};