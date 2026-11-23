import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Empêche un écran blanc complet en cas d'erreur de rendu non interceptée
 * et propose à l'utilisateur de recharger ou revenir à l'accueil.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught rendering error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-sm space-y-4">
            <h1 className="text-2xl font-bold text-primary">
              Une erreur inattendue est survenue
            </h1>
            <p className="text-sm text-muted-foreground">
              La page n&apos;a pas pu s&apos;afficher correctement. Vous pouvez la recharger ou retourner à l&apos;accueil.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Recharger la page
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
              >
                Accueil
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
