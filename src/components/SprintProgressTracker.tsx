import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Target, Zap } from "lucide-react";

export const SprintProgressTracker = () => {
  const modules = [
    { id: 1, name: 'Storm Intelligence API', progress: 85, status: 'active', acceptanceCriteria: 8, completed: 7 },
    { id: 2, name: 'Roof Segmentation ML', progress: 94, status: 'deployed', acceptanceCriteria: 12, completed: 12 },
    { id: 3, name: 'Damage Detection AI', progress: 78, status: 'testing', acceptanceCriteria: 10, completed: 8 },
    { id: 4, name: 'Report Generation', progress: 67, status: 'development', acceptanceCriteria: 15, completed: 10 },
    { id: 5, name: 'Claims Integration', progress: 45, status: 'planning', acceptanceCriteria: 20, completed: 9 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'active': return <Zap className="w-4 h-4 text-warning" />;
      case 'testing': return <Target className="w-4 h-4 text-accent" />;
      case 'development': return <Clock className="w-4 h-4 text-primary" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const overallProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Sprint 1 Progress</h2>
          <p className="text-xl text-muted-foreground">Real-time tracking of RoofIQ development milestones</p>
        </div>

        <Card className="p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary mb-2">{overallProgress}%</div>
            <div className="text-xl text-muted-foreground">Overall Sprint Progress</div>
          </div>
          <Progress value={overallProgress} className="h-4" />
        </Card>

        <div className="grid gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {module.id}
                  </div>
                  <h3 className="text-lg font-semibold">{module.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status)}
                  <Badge variant="outline" className="capitalize">{module.status}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded">
                  <div className="text-2xl font-bold text-primary">{module.progress}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="text-2xl font-bold text-success">{module.completed}/{module.acceptanceCriteria}</div>
                  <div className="text-sm text-muted-foreground">Criteria Met</div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="text-2xl font-bold text-accent">{module.acceptanceCriteria - module.completed}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              
              <Progress value={module.progress} className="h-3" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};