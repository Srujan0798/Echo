
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you would log this to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }
  
  private handleReturnHome = () => {
      window.location.hash = '/';
      window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl font-bold text-[#FF6B6B] mb-4">Oops! Something went wrong.</h1>
          <p className="text-[#B3B3B3] mb-8 max-w-md">
            We've encountered an unexpected error. You can try returning to the main screen or report this issue to our team.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <Button onClick={this.handleReturnHome}>
                Return to Safety
            </Button>
            <Button
              onClick={() => window.location.href = 'mailto:support@echo.app?subject=Bug Report'}
              variant="secondary"
            >
              Report Bug
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
