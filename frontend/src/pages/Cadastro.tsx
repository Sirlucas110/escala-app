import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import InstrumentoService from "@/sdk/services/Instrumento.service";
import PessoaService from "@/sdk/services/Pessoa.service";
import { InstrumentoSaidaGet } from "@/sdk/types/instrumento";
import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    PessoaService.insertNewPerson(formData)
      .then(() => {
        toast({
          title: "Pessoa cadastrada",
          description: "Cadastro realizado com sucesso!",
          variant: "default",
        });
        navigate("/pessoas");
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Erro ao cadastrar pessoa",
          variant: "destructive",
        });
      });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Cadastro de Pessoa
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar uma nova pessoa
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar Pessoa
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/pessoas")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Cadastro;
