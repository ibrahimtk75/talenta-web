import { Component, type ReactNode } from 'react';

// Catches render errors anywhere below it so one broken component shows a
// friendly message instead of a blank white page.
export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surfaced to the console (and any monitoring) without crashing the app.
    console.error('Unhandled UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
          <p className="mx-auto mt-2 max-w-sm text-mute">
            A part of the page failed to load. Please refresh — if it keeps happening, contact us at sportstalenta@gmail.com.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.assign('/'); }}
            className="btn-primary mx-auto mt-6 w-fit"
          >
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
