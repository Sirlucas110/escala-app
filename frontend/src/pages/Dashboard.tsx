import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  GraduationCap,
  Mic,
  Music,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import EscalaService from "@/sdk/services/Escala.service";
import PessoaService from "@/sdk/services/Pessoa.service";
import { EscalaSaidaGet } from "@/sdk/types/escala";
import { PessoaSaidaGet } from "@/sdk/types/pessoa";


const Dashboard = () => {
  const [pessoas, setPessoas] = useState<PessoaSaidaGet[]>([]);
  const [escalas, setEscalas] = useState<EscalaSaidaGet[]>([]);

  /* ===================== LOAD ===================== */

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [pessoasRes, escalasRes] = await Promise.all([
      PessoaService.getAllPersons(),
      EscalaService.getAllEscalas(),
    ]);

    setPessoas(pessoasRes);
    setEscalas(escalasRes);
  }

  /* ===================== HELPERS ===================== */

  const getCargoIcon = (cargo: string) => {
    switch (cargo.toLowerCase()) {
      case "sonoplastia":
        return Music;
      case "banda":
        return Music;
      case "vocal":
        return Mic;
      case "recepcao":
        return UserCheck;
      case "professor":
        return GraduationCap;
      default:
        return Users;
    }
  };

  /* ===================== DERIVED ===================== */

  const hoje = new Date();

  const proximasEscalas = useMemo(
    () =>
      escalas
        .filter((e) => new Date(e.data) >= hoje)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
        .slice(0, 5),
    [escalas],
  );

  const stats = [
    {
      label: "Total de Pessoas",
      value: pessoas.length,
      icon: Users,
      color: "primary",
    },
    {
      label: "Escalas Futuras",
      value: proximasEscalas.length,
      icon: Calendar,
      color: "accent",
    },
  ];

  /* ===================== VIEW ===================== */

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de escalas
          </p>
        </div>

        {/* ===================== STATS ===================== */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <Icon className={`h-5 w-5 text-${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ===================== PRÓXIMAS ESCALAS ===================== */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Escalas
            </CardTitle>
          </CardHeader>

          <CardContent className="max-h-80 overflow-y-auto">
            {proximasEscalas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma escala futura cadastrada
              </p>
            ) : (
              <div className="space-y-4">
                {proximasEscalas.map((escala) => {
                  const primeiroCargo = escala.cargos[0];
                  const Icon = primeiroCargo
                    ? getCargoIcon(primeiroCargo.nome)
                    : Users;

                  return (
                    <div
                      key={escala.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {escala.pessoa?.nome}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {escala.cargos.map((c) => c.nome).join(", ")}
                          </span>
                          {escala.instrumento && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                •
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {escala.instrumento
                                  .map((instrumento) => instrumento.nome)
                                  .join(", ")}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {format(new Date(escala.data), "PPP", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
