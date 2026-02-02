import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Home,
  UserPlus,
  Guitar,
  BookUser,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Button } from "./ui/button";

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

  const { isAuthenticated, user, logout, fetchUser } = useAuthStore();
    const navigate = useNavigate();
  
    useEffect(() => {
      void fetchUser();
    }, [fetchUser]);
  
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    };

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
            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  Olá,{" "}
                  <span className="font-medium text-foreground">
                    {user?.email}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
