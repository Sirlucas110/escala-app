import Service from "../Service";
import {
  EsacalaEntradaPost,
  EscalaSaidaDelete,
  EscalaSaidaGet,
  EscalaSaidaPost,
} from "../types/escala";

class EscalaService extends Service {
  static getAllEscalas() {
    return this.Http.get<EscalaSaidaGet[]>("/escalas").then(this.getData);
  }

  static insertNewEscala(escala: EsacalaEntradaPost) {
    return this.Http.post<EscalaSaidaPost>("/escalas/", escala).then(
      this.getData,
    );
  }

  static deleteExistingEscala(escalaId: number) {
    return this.Http.delete<EscalaSaidaDelete>(`/escalas/${escalaId}`).then(
      this.getData,
    );
  }
}

export default EscalaService;
