import React, { Component } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Enterprise React Error Boundary
 * Catches unhandled UI exceptions, logs diagnostics, and displays a recovery interface.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Production telemetry logging can be wired here
    console.error('CampusPulse ErrorBoundary intercepted error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-campus-bg flex items-center justify-center p-6">
          <div className="card max-w-xl w-full border-rose p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded bg-rose-light text-rose flex items-center justify-center mx-auto">
              <AlertOctagon size={24} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-campus-text">Platform Component Error</h2>
            <p className="text-xs text-campus-muted max-w-md mx-auto">
              An unexpected runtime exception interrupted this view. Diagnostics have been captured in accordance with institutional data policies.
            </p>
            {this.state.error && (
              <div className="p-3 bg-campus-container rounded border border-campus-border text-left font-mono text-xs text-rose overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}
            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" icon={RotateCcw} onClick={this.handleReset}>
                Reload Application View
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
