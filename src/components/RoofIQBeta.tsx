import React, { useState } from 'react';
import { Upload, Brain, Target, TrendingUp, FileText, Zap } from 'lucide-react';

interface RoofPrediction {
  facets: number;
  area: number;
  pitch: string;
  confidence: number;
  timestamp: string;
  materials: string[];
  complexity: 'Simple' | 'Moderate' | 'Complex';
}

interface TrainingProgress {
  reportsAnalyzed: number;
  targetReports: number;
  currentAccuracy: number;
  targetAccuracy: number;
  etaMonths: number;
}

interface LearningComparison {
  ourPrediction: RoofPrediction;
  eagleViewData?: any;
  differences?: string[];
  improvements?: string[];
}

const RoofIQBeta: React.FC = () => {
  console.log('=== ROOFIQ BETA COMPONENT RENDERING ===');
  const [currentPrediction, setCurrentPrediction] = useState<RoofPrediction>({
    facets: 12,
    area: 3500,
    pitch: "6/12",
    confidence: 87,
    timestamp: new Date().toISOString(),
    materials: ["Asphalt Shingles", "Ridge Cap"],
    complexity: "Moderate"
  });

  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    reportsAnalyzed: 1247,
    targetReports: 3000,
    currentAccuracy: 87,
    targetAccuracy: 95,
    etaMonths: 2
  });

  const [isUploading, setIsUploading] = useState(false);
  const [recentLearning, setRecentLearning] = useState<LearningComparison[]>([
    {
      ourPrediction: { ...currentPrediction, area: 3200 },
      differences: ["Missed small dormer on NE corner", "Underestimated hip sections by 8%"],
      improvements: ["Better edge detection", "Improved hip section recognition"]
    }
  ]);

  const handleEagleViewUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setTrainingProgress(prev => ({
        ...prev,
        reportsAnalyzed: prev.reportsAnalyzed + 1,
        currentAccuracy: Math.min(prev.currentAccuracy + 0.1, prev.targetAccuracy)
      }));
      
      setRecentLearning(prev => [{
        ourPrediction: currentPrediction,
        eagleViewData: { facets: 13, area: 3821, pitch: "6/12" },
        differences: ["Missed utility room section", "Area difference: -8.4%"],
        improvements: ["Enhanced satellite resolution processing", "Better small structure detection"]
      }, ...prev.slice(0, 2)]);
      
      setIsUploading(false);
    }, 3000);
  };

  const progressPercentage = (trainingProgress.reportsAnalyzed / trainingProgress.targetReports) * 100;
  const accuracyProgress = (trainingProgress.currentAccuracy / trainingProgress.targetAccuracy) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            RoofIQ Beta
          </h1>
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us learn! Every EagleView report you upload makes our AI smarter and more accurate.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Our Prediction */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">RoofIQ Analysis</h2>
            </div>
            
            <div className="space-y-4">
              {/* Confidence Gauge */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <span className="text-2xl font-bold text-primary">{currentPrediction.confidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentPrediction.confidence}%` }}
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Facets Detected</p>
                  <p className="text-2xl font-bold">{currentPrediction.facets}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-2xl font-bold">{currentPrediction.area.toLocaleString()} sq ft</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Roof Pitch</p>
                  <p className="text-2xl font-bold">{currentPrediction.pitch}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  <p className="text-2xl font-bold">{currentPrediction.complexity}</p>
                </div>
              </div>

              {/* Materials */}
              <div>
                <p className="text-sm font-medium mb-2">Detected Materials</p>
                <div className="flex flex-wrap gap-2">
                  {currentPrediction.materials.map((material, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/30 p-8 text-center">
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Help Us Learn!</h3>
            <p className="text-muted-foreground mb-6">
              Upload the EagleView report for this property to improve our accuracy
            </p>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleEagleViewUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block">
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Upload EagleView Report'
                )}
              </div>
            </label>
            
            <p className="text-xs text-muted-foreground mt-3">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>
        </div>

        {/* Training Progress */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-lg border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold">Learning Progress</h2>
            </div>
            
            <div className="space-y-6">
              {/* Reports Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Reports Analyzed</span>
                  <span className="text-lg font-bold">
                    {trainingProgress.reportsAnalyzed.toLocaleString()} / {trainingProgress.targetReports.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {progressPercentage.toFixed(1)}% complete
                </p>
              </div>

              {/* Accuracy Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Current Accuracy</span>
                  <span className="text-lg font-bold text-green-600">
                    {trainingProgress.currentAccuracy}% / {trainingProgress.targetAccuracy}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${accuracyProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: Production ready at 95%
                </p>
              </div>

              {/* ETA */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Estimated Time to Production</p>
                  <p className="text-3xl font-bold text-primary">{trainingProgress.etaMonths} months</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on current upload rate
                  </p>
                </div>
              </div>

              {/* Recent Learning Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-lg font-bold">+23</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-lg font-bold">+156</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-lg font-bold">+672</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Learning */}
          <div className="bg-card rounded-xl shadow-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Recent Learning</h3>
            </div>
            
            <div className="space-y-4">
              {recentLearning.map((learning, index) => (
                <div key={index} className="border-l-4 border-primary/30 pl-4 py-2">
                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground mb-1">
                      What we learned:
                    </p>
                    <ul className="space-y-1">
                      {learning.differences?.map((diff, i) => (
                        <li key={i} className="text-xs text-red-600">• {diff}</li>
                      ))}
                    </ul>
                    {learning.improvements && (
                      <>
                        <p className="font-medium text-muted-foreground mt-2 mb-1">
                          Improvements made:
                        </p>
                        <ul className="space-y-1">
                          {learning.improvements.map((improvement, i) => (
                            <li key={i} className="text-xs text-green-600">• {improvement}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-center text-primary-foreground">
        <h3 className="text-2xl font-bold mb-4">Be Part of the Future</h3>
        <p className="text-lg mb-6 opacity-90">
          Every report you upload helps us build the most accurate roof measurement system in the industry.
          You're not just using our tool - you're helping create it.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">$0</p>
            <p className="text-sm opacity-80">Per report after training</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">95%</p>
            <p className="text-sm opacity-80">Target accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm opacity-80">Owned by you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoofIQBeta;