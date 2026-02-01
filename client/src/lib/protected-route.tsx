import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Initializing ChemVis...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Component />
          </div>
        </main>
      </div>
    </Route>
  );
}
