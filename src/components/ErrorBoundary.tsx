import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  featureName?: string;
}

/**
 * Fallback UI displayed when an error is caught
 */
export function ErrorFallback({ error, resetError, featureName }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">
            {featureName ? `${featureName} Error` : "Something went wrong"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {featureName
              ? `An error occurred in the ${featureName} section. You can try refreshing or go back to the dashboard.`
              : "An unexpected error occurred. Please try again."}
          </p>
          
          {/* Error details (collapsible in production) */}
          {process.env.NODE_ENV === "development" && (
            <details className="bg-muted rounded-lg p-3">
              <summary className="text-xs font-medium cursor-pointer text-muted-foreground">
                Error Details
              </summary>
              <pre className="mt-2 text-xs overflow-auto max-h-32 text-red-600">
                {error.message}
                {error.stack && (
                  <>
                    {"\n\n"}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}

          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleGoHome} className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button onClick={resetError} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches errors in child components
 * Provides graceful error handling per feature
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (in production, send to error tracking service)
    console.error(`Error in ${this.props.featureName || "component"}:`, error);
    console.error("Error info:", errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          featureName={this.props.featureName}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureName?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary featureName={featureName}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
