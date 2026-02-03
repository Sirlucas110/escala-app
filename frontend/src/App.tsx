import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Cargo from "./pages/Cargo";
import Dashboard from "./pages/Dashboard";
import Escalas from "./pages/Escalas";
import Home from "./pages/Home";
import Instrumentos from "./pages/Instrumentos";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Pessoas from "./pages/Pessoas";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
  ;
  }, );
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/escalas" element={<Escalas />} />
            <Route path="/instrumentos" element={<Instrumentos />} />
            <Route path="/cargos" element={<Cargo />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
