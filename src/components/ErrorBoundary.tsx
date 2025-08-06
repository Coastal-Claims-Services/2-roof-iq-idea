import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <Card className="p-6 m-4 border-destructive">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Something went wrong</h3>
          </div>
          
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          
          <Button onClick={this.retry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export const ComponentErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ 
  error, 
  retry 
}) => (
  <div className="p-4 border rounded-lg border-destructive/20 bg-destructive/5">
    <div className="flex items-center gap-2 mb-2">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <span className="text-sm font-medium text-destructive">Component Error</span>
    </div>
    <p className="text-xs text-muted-foreground mb-3">
      {error?.message || 'Failed to load component'}
    </p>
    <Button onClick={retry} variant="outline" size="sm" className="h-7 text-xs">
      <RefreshCw className="h-3 w-3 mr-1" />
      Retry
    </Button>
  </div>
);