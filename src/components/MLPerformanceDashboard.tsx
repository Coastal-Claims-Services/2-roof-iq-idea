import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Activity, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Layers,
  Cpu
} from "lucide-react";

interface ModelMetrics {
  modelName: string;
  version: string;
  accuracy: number;
  iouScore: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: string;
  lastUpdated: string;
  status: 'training' | 'deployed' | 'testing';
}

interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  timeRemaining: string;
}

export const MLPerformanceDashboard = () => {
  const [selectedModel, setSelectedModel] = useState<string>('segmentation');
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    epoch: 847,
    totalEpochs: 1000,
    loss: 0.0234,
    accuracy: 94.7,
    valLoss: 0.0298,
    valAccuracy: 93.2,
    timeRemaining: '2h 14m'
  });

  const modelMetrics: Record<string, ModelMetrics> = {
    segmentation: {
      modelName: 'RoofSegNet Pro',
      version: 'v2.4.1',
      accuracy: 94.7,
      iouScore: 0.887,
      precision: 93.2,
      recall: 95.1,
      f1Score: 94.1,
      trainingTime: '18h 32m',
      lastUpdated: '2024-07-06 14:30 UTC',
      status: 'training'
    },
    pitch: {
      modelName: 'PitchEstimator AI',
      version: 'v1.8.3',
      accuracy: 91.3,
      iouScore: 0.823,
      precision: 89.7,
      recall: 92.8,
      f1Score: 91.2,
      trainingTime: '12h 18m',
      lastUpdated: '2024-07-05 09:15 UTC',
      status: 'deployed'
    },
    damage: {
      modelName: 'DamageDetect Neural',
      version: 'v3.1.0',
      accuracy: 96.2,
      iouScore: 0.912,
      precision: 95.8,
      recall: 96.6,
      f1Score: 96.2,
      trainingTime: '24h 45m',
      lastUpdated: '2024-07-04 16:22 UTC',
      status: 'testing'
    }
  };

  const performanceHistory = [
    { date: '2024-06-01', accuracy: 87.2, iou: 0.756 },
    { date: '2024-06-15', accuracy: 89.8, iou: 0.801 },
    { date: '2024-07-01', accuracy: 92.4, iou: 0.845 },
    { date: '2024-07-06', accuracy: 94.7, iou: 0.887 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-warning text-warning-foreground';
      case 'deployed': return 'bg-success text-success-foreground';
      case 'testing': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training': return <Activity className="w-3 h-3" />;
      case 'deployed': return <CheckCircle className="w-3 h-3" />;
      case 'testing': return <AlertCircle className="w-3 h-3" />;
      default: return <Cpu className="w-3 h-3" />;
    }
  };

  useEffect(() => {
    // Simulate real-time training updates
    const interval = setInterval(() => {
      setTrainingProgress(prev => ({
        ...prev,
        epoch: Math.min(prev.epoch + 1, prev.totalEpochs),
        loss: Math.max(0.01, prev.loss - 0.0001 + (Math.random() - 0.5) * 0.0002),
        accuracy: Math.min(99, prev.accuracy + 0.01 + (Math.random() - 0.5) * 0.02),
        valLoss: Math.max(0.01, prev.valLoss - 0.0001 + (Math.random() - 0.5) * 0.0003),
        valAccuracy: Math.min(99, prev.valAccuracy + 0.01 + (Math.random() - 0.5) * 0.03)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentModel = modelMetrics[selectedModel];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            ML Model Performance Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time monitoring of our AI models powering RoofIQ's intelligent roof analysis.
            Track training progress, accuracy metrics, and deployment status.
          </p>
        </div>

        <Tabs value={selectedModel} onValueChange={setSelectedModel} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="segmentation" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Segmentation
            </TabsTrigger>
            <TabsTrigger value="pitch" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Pitch
            </TabsTrigger>
            <TabsTrigger value="damage" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Damage
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedModel} className="space-y-8">
            {/* Model Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Model Status</h3>
                  </div>
                  <Badge className={`${getStatusColor(currentModel.status)} flex items-center gap-1`}>
                    {getStatusIcon(currentModel.status)}
                    {currentModel.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{currentModel.modelName}</p>
                  <p className="text-xs text-muted-foreground">{currentModel.version}</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-success" />
                  <h3 className="font-semibold">Accuracy</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-success">
                    {currentModel.accuracy.toFixed(1)}%
                  </div>
                  <Progress value={currentModel.accuracy} className="h-2" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">IoU Score</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {currentModel.iouScore.toFixed(3)}
                  </div>
                  <Progress value={currentModel.iouScore * 100} className="h-2" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold">F1 Score</h3>
                </div>  
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">
                    {currentModel.f1Score.toFixed(1)}%
                  </div>
                  <Progress value={currentModel.f1Score} className="h-2" />
                </div>
              </Card>
            </div>

            {/* Training Progress (only for training models) */}
            {currentModel.status === 'training' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-warning" />
                    <h3 className="text-lg font-semibold">Live Training Progress</h3>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {trainingProgress.timeRemaining} remaining
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Epoch Progress</span>
                        <span>{trainingProgress.epoch}/{trainingProgress.totalEpochs}</span>
                      </div>
                      <Progress 
                        value={(trainingProgress.epoch / trainingProgress.totalEpochs) * 100} 
                        className="h-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Training Loss</p>
                        <p className="text-2xl font-bold">{trainingProgress.loss.toFixed(4)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Training Accuracy</p>
                        <p className="text-2xl font-bold text-success">{trainingProgress.accuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Validation Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Validation Loss</p>
                        <p className="text-2xl font-bold">{trainingProgress.valLoss.toFixed(4)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Validation Accuracy</p>
                        <p className="text-2xl font-bold text-success">{trainingProgress.valAccuracy.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Precision</span>
                    <div className="flex items-center gap-2">
                      <Progress value={currentModel.precision} className="w-24 h-2" />
                      <span className="text-sm font-medium w-12">{currentModel.precision.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recall</span>
                    <div className="flex items-center gap-2">
                      <Progress value={currentModel.recall} className="w-24 h-2" />
                      <span className="text-sm font-medium w-12">{currentModel.recall.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">F1 Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={currentModel.f1Score} className="w-24 h-2" />
                      <span className="text-sm font-medium w-12">{currentModel.f1Score.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IoU Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={currentModel.iouScore * 100} className="w-24 h-2" />
                      <span className="text-sm font-medium w-12">{currentModel.iouScore.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Training Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Training Time</span>
                    <span className="text-sm font-medium">{currentModel.trainingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm font-medium">{currentModel.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{currentModel.version}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Export Metrics
                      </Button>
                      <Button size="sm" variant="outline">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Performance History */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance History</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {performanceHistory.map((point, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">{point.date}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs">Accuracy</span>
                        <span className="text-xs font-medium">{point.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs">IoU</span>
                        <span className="text-xs font-medium">{point.iou}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};