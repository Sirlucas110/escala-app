import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import InstrumentoService from "@/sdk/services/Instrumento.service";
import { InstrumentoSaidaGet } from "@/sdk/types/instrumento";
import { Guitar, Music, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Instrumentos = () => {
  const { toast } = useToast();
  const [instrumentos, setInstrumentos] = useState<InstrumentoSaidaGet[]>([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    InstrumentoService.getAllInstruments().then(setInstrumentos);
  }, []);

  async function insertNewInstrument() {
    const newInstrument = { nome: body };

    const response =
      await InstrumentoService.insertNewInstrument(newInstrument);

    setInstrumentos((prev) => [
      ...prev,
      {
        id: response.id,
        nome: body,
      },
    ]);

    setBody("");

    toast({
      title: "Instrumento salvo com sucesso",
      description: "Cadastro realizado com sucesso",
    });
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      await insertNewInstrument();
    } catch (error) {
      toast({
        title: `${error}`,
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await InstrumentoService.deleteExistingInstrument(id);

      setInstrumentos((prev) =>
        prev.filter((instrument) => instrument.id !== id),
      );

      toast({
        title: "Instrumento removido com sucesso",
        description: "Sucesso",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao deletar instrumento",
      });
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Guitar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Instrumentos</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário de Cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Cadastrar Instrumento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Instrumento *</Label>
                  <Input
                    id="nome"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Ex: Piano, Violino..."
                    maxLength={100}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Instrumento
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <p className="text-4xl font-bold text-primary">
                  {instrumentos.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Instrumentos Cadastrados
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Instrumentos */}
        <Card>
          <CardHeader>
            <CardTitle>Instrumentos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {instrumentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum instrumento cadastrado ainda
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrumentos.map((instrumento) => (
                    <TableRow key={instrumento.id}>
                      <TableCell className="font-medium">
                        {instrumento.nome}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(instrumento.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Instrumentos;
