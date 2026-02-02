import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import PessoaService from "@/sdk/services/Pessoa.service";
import { PessoaSaidaGet } from "@/sdk/types/pessoa";
import { Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

const Pessoas = () => {
  const { toast } = useToast();
  const [pessoas, setPessoas] = useState<PessoaSaidaGet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    PessoaService.getAllPersons().then((data) => {
      setPessoas(data);
    });
  }, []);

  const filteredPessoas = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = () => {
    if (!deleteId) return;
    PessoaService.deleteExistingPerson(deleteId)
      .then(() => {
        setPessoas((prev) => prev.filter((pessoa) => pessoa.id !== deleteId));
        setDeleteId(null);
        toast({
          title: "Pessoa removida com sucesso",
          description: "Sucesso",
        });
      })
      .catch(() => {
        toast({
          title: "Erro",
          description: "Erro ao deletar pessoa",
        });
      });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Pessoas Cadastradas
            </h1>
            <p className="text-muted-foreground">
              {filteredPessoas.length}{" "}
              {filteredPessoas.length === 1 ? "pessoa" : "pessoas"}{" "}
              encontrada(s)
            </p>
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>

          <CardContent>
            {filteredPessoas.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Nenhuma pessoa encontrada"
                    : "Nenhuma pessoa cadastrada"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPessoas.map((pessoa) => (
                  <Card
                    key={pessoa.id}
                    className="border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle>
                        <h3 className="font-semibold truncate">
                          {pessoa.nome}
                        </h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{pessoa.email}</p>
                        <p className="text-muted-foreground">
                          {pessoa.telefone}
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeleteId(pessoa.id ?? null)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover esta pessoa? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Pessoas;
