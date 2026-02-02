import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, LogIn, LogOut, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Home() {
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
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Escola Sabatina</span>
          </div>

          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sistema de <span className="text-primary">Escalas</span>
          </h1>

          {isAuthenticated ? (
            <div className="space-y-4">
              <Card className="max-w-md mx-auto border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">
                    Olá,{" "}
                    <span className="font-semibold text-primary">
                      {user?.email}
                    </span>
                    !
                  </p>
                  <Button asChild className="w-full gap-2">
                    <Link to="/dashboard">
                      Acessar Dashboard
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link to="/register">
                  <UserPlus className="h-5 w-5" />
                  Criar Conta Grátis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link to="/login">
                  <LogIn className="h-5 w-5" />
                  Já Tenho Conta
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Escola Sabatina - Sistema de Escalas</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
