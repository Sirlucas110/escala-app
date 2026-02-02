import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const initCSRF = useAuthStore((state) => state.initCSRF);

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const csrftoken = await initCSRF();
      const response = await fetch("http://localhost:8000/api/escala/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Registration successful! Please log in.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration: " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Church className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para acessar o sistema de escalas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu e-mail"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          {error && <p>{error}</p>}
          {success && <p>{success}</p>}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
