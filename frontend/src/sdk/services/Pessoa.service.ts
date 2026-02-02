import Service from "../Service";
import {
  PessoaEntradaPost,
  PessoaSaidaDelete,
  PessoaSaidaGet,
  PessoaSaidaPost,
} from "@/sdk/types/pessoa";

class PessoaService extends Service {
  static getAllPersons(): Promise<PessoaSaidaGet[]> {
    return this.Http.get<PessoaSaidaGet[]>("/pessoas").then(this.getData);
  }

  static deleteExistingPerson(personId: number) {
    return this.Http.delete<PessoaSaidaDelete>(`/pessoas/${personId}`).then(
      this.getData,
    );
  }

  static insertNewPerson(person: PessoaEntradaPost) {
    return this.Http.post<PessoaSaidaPost>("/pessoas/", person).then(this.getData);
  }
}

export default PessoaService;
