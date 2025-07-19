
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Loader2, Zap } from "lucide-react";
import { ProcessingJob } from '@/types/database';
import { databaseService } from '@/services/database';

interface ProcessingStatusProps {
  jobId: string;
  onComplete?: (job: ProcessingJob) => void;
  onError?: (error: string) => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  jobId,
  onComplete,
  onError
}) => {
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await databaseService.getJob(jobId);
        if (jobData) {
          setJob(jobData);
          
          if (jobData.status === 'completed' && onComplete) {
            onComplete(jobData);
          } else if (jobData.status === 'failed' && onError) {
            onError(jobData.error_message || 'Job failed');
          }
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
        if (onError) {
          onError('Failed to fetch job status');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();

    // Poll for updates if job is still processing
    const interval = setInterval(() => {
      if (job && (job.status === 'pending' || job.status === 'processing')) {
        fetchJob();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status, onComplete, onError]);

  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'destructive';
      case 'processing': return 'primary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading job status...</span>
        </div>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Job not found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold capitalize">{job.job_type.replace('_', ' ')}</h3>
              <p className="text-sm text-muted-foreground">Job ID: {job.id}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(job.status) as any} className="flex items-center gap-1">
            {getStatusIcon(job.status)}
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-2" />
        </div>

        {job.started_at && (
          <div className="text-xs text-muted-foreground">
            Started: {new Date(job.started_at).toLocaleString()}
          </div>
        )}

        {job.completed_at && (
          <div className="text-xs text-muted-foreground">
            Completed: {new Date(job.completed_at).toLocaleString()}
          </div>
        )}

        {job.error_message && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">
            {job.error_message}
          </div>
        )}
      </div>
    </Card>
  );
};
