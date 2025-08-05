import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="cosmic-bg min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-8xl mb-6 animate-bounce">:(</div>
            <h1 className="text-2xl font-bold text-red-300 mb-4">
              Космическая ошибка!
            </h1>
            <p className="text-cyan-200 mb-6">
              Что-то пошло не так в нашем космическом приложении. 
              Попробуйте перезагрузить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="neon-btn"
            >
              Перезагрузить приложение
            </button>
            
            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-black/50 p-4 rounded-lg">
                <summary className="text-red-300 cursor-pointer">
                  Детали ошибки (только для разработки)
                </summary>
                <pre className="text-red-200 text-xs mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;