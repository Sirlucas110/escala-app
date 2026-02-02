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
import CargoService from "@/sdk/services/Cargo.service";
import { CargoSaidaGet } from "@/sdk/types/cargo";
import { BookUser, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function Cargo() {
  const { toast } = useToast();
  const [cargos, setCargos] = useState<CargoSaidaGet[]>([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    CargoService.getAllCargos().then(setCargos);
  }, []);

  async function insertNewCargo() {
    const newCargo = {
      nome,
    };

    await CargoService.insertNewCargo(newCargo);

    const cargosAtualizados = await CargoService.getAllCargos();
    setCargos(cargosAtualizados);

    setNome("");

    toast({
      title: "Cargo salvo com sucesso",
      description: "Cadastro realizado com sucesso",
    });
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      await insertNewCargo();
    } catch (error) {
      toast({
        title: `${error}`,
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await CargoService.deleteExistingCargo(id);

      setCargos((props) => props.filter((cargo) => cargo.id !== id));

      toast({
        title: "Cargo removido com sucesso",
        description: "Sucesso",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao deletar cargo",
      });
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookUser className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cargos</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário de Cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Cadastrar Cargo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cargo *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Banda, Vocal ..."
                    maxLength={100}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Cargo
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookUser className="h-5 w-5" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <p className="text-4xl font-bold text-primary">
                  {cargos.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Cargos Cadastrados
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Instrumentos */}
        <Card>
          <CardHeader>
            <CardTitle>Cargos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {cargos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum cargo cadastrado ainda
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
                  {cargos.map((cargo) => (
                    <TableRow key={cargo.id}>
                      <TableCell className="font-medium">
                        {cargo.nome}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cargo.id)}
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
}

export default Cargo;
