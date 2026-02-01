import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  History, 
  LogOut, 
  FlaskConical, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <div className="flex h-screen flex-col border-r bg-card w-64 fixed left-0 top-0 z-30">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-foreground">
          ChemVis
          <span className="block text-xs font-normal text-muted-foreground">Param Visualizer</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground">Engineer</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
