import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import CargoService from "@/sdk/services/Cargo.service";
import EscalaService from "@/sdk/services/Escala.service";
import PessoaService from "@/sdk/services/Pessoa.service";
import InstrumentoService from "@/sdk/services/Instrumento.service";

import { CargoSaidaGet } from "@/sdk/types/cargo";
import { EscalaSaidaGet } from "@/sdk/types/escala";
import { InstrumentoSaidaGet } from "@/sdk/types/instrumento";
import { PessoaSaidaGet } from "@/sdk/types/pessoa";

type EscalaFormData = {
  data: string;
  pessoaId: string;
  cargosIds: number[];
  instrumentoId: number | "";
  descricao: string;
};

const Escalas = () => {
  const { toast } = useToast();

  const [pessoas, setPessoas] = useState<PessoaSaidaGet[]>([]);
  const [escalas, setEscalas] = useState<EscalaSaidaGet[]>([]);
  const [cargos, setCargos] = useState<CargoSaidaGet[]>([]);
  const [instrumentos, setInstrumentos] = useState<InstrumentoSaidaGet[]>([]);

  const [formData, setFormData] = useState<EscalaFormData>({
    data: "",
    pessoaId: "",
    cargosIds: [],
    instrumentoId: "",
    descricao: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [pessoasRes, escalasRes, cargosRes, instrumentosRes] =
      await Promise.all([
        PessoaService.getAllPersons(),
        EscalaService.getAllEscalas(),
        CargoService.getAllCargos(),
        InstrumentoService.getAllInstruments(),
      ]);

    setPessoas(pessoasRes);
    setEscalas(escalasRes);
    setCargos(cargosRes);
    setInstrumentos(instrumentosRes);
  }

  /* ===================== DERIVED DATA ===================== */

  const cargoBanda = useMemo(
    () => cargos.find((c) => c.nome.toLowerCase() === "banda"),
    [cargos],
  );

  const isBandaSelecionado =
    !!cargoBanda && formData.cargosIds.includes(cargoBanda.id);

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => String(p.id) === formData.pessoaId),
    [pessoas, formData.pessoaId],
  );

  const instrumentosDisponiveis = instrumentos;

  /* ===================== EFFECTS ===================== */

  // Remove instrumento se tirar o cargo Banda
  useEffect(() => {
    if (!isBandaSelecionado && formData.instrumentoId !== "") {
      setFormData((prev) => ({ ...prev, instrumentoId: "" }));
    }
  }, [formData.instrumentoId, isBandaSelecionado]);

  // Remove instrumento ao trocar a pessoa
  useEffect(() => {
    setFormData((prev) => ({ ...prev, instrumentoId: "" }));
  }, [formData.pessoaId]);

  /* ===================== ACTIONS ===================== */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.data ||
      !formData.pessoaId ||
      formData.cargosIds.length === 0
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (isBandaSelecionado && !formData.instrumentoId) {
      toast({
        title: "Erro",
        description: "Selecione o instrumento para o cargo Banda",
        variant: "destructive",
      });
      return;
    }

    await EscalaService.insertNewEscala({
      data: formData.data,
      pessoa_id: Number(formData.pessoaId),
      cargo_ids: formData.cargosIds,
      instrumento_ids: formData.instrumentoId ? [formData.instrumentoId] : [],
      descricao: formData.descricao || null,
    });

    toast({
      title: "Sucesso",
      description: "Escala criada com sucesso",
    });

    setFormData({
      data: "",
      pessoaId: "",
      cargosIds: [],
      instrumentoId: "",
      descricao: "",
    });

    loadAll();
  }

  async function handleDelete(id: number) {
    await EscalaService.deleteExistingEscala(id);
    toast({
      title: "Removido",
      description: "Escala removida com sucesso",
    });
    loadAll();
  }

  /* ===================== VIEW ===================== */

  const escalasOrdenadas = [...escalas].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Gerenciar Escalas</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ================= FORM ================= */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Escala
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Pessoa *</Label>
                  <Select
                    value={formData.pessoaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pessoaId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {pessoas.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cargo *</Label>
                  <Select
                    value={formData.cargosIds[0]?.toString() ?? ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        cargosIds: [Number(value)],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ===== INSTRUMENTO (SOMENTE BANDA) ===== */}
                {isBandaSelecionado && (
                  <div>
                    <Label>Instrumento *</Label>
                    <Select
                      value={
                        formData.instrumentoId
                          ? String(formData.instrumentoId)
                          : ""
                      }
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          instrumentoId: Number(value),
                        })
                      }
                      disabled={!pessoaSelecionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o instrumento" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrumentosDisponiveis.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            Pessoa não possui instrumentos
                          </SelectItem>
                        ) : (
                          instrumentosDisponiveis.map((inst) => (
                            <SelectItem key={inst.id} value={String(inst.id)}>
                              {inst.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descricao: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Escala
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Escalas Cadastradas ({escalas.length})</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {escalasOrdenadas.map((escala) => (
                <div
                  key={escala.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {format(new Date(escala.data), "dd/MM/yyyy")}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {escala.cargos.map((cargo) => cargo.nome)}
                          {escala.instrumento &&
                            ` - ${escala.instrumento.map((instrumento) => instrumento.nome).join(", ")}`}
                        </span>
                      </div>
                      <p className="font-medium">
                        {escala.pessoa.nome || "Pessoa não encontrada"}
                      </p>
                      {escala.descricao && (
                        <p className="text-sm text-muted-foreground">
                          {escala.descricao}
                        </p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(escala.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Escalas;
