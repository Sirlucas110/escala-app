import { cn } from "@/lib/utils";
import {
  BookUser,
  Calendar,
  Guitar,
  Home,
  UserPlus,
  Users
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/cadastro", icon: UserPlus, label: "Cadastro" },
    { to: "/pessoas", icon: Users, label: "Pessoas" },
    { to: "/escalas", icon: Calendar, label: "Escalas" },
    { to: "/instrumentos", icon: Guitar, label: "Instrumentos" },
    { to: "/cargos", icon: BookUser, label: "Cargos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Escola Sabatina</h1>
                <p className="text-xs text-muted-foreground">
                  Sistema de Escalas
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
