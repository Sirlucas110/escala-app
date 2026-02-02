import Service from "../Service";
import { InstrumentoEntradaPost, InstrumentoSaidaDelete, InstrumentoSaidaGet, InstrumentoSaidaPost } from "../types/instrumento";

class InstrumentoService extends Service{
    static getAllInstruments() {
        return this.Http.get<InstrumentoSaidaGet[]>('/instrumentos').then(this.getData)
    }

    static insertNewInstrument(instrumento: InstrumentoEntradaPost) {
        return this.Http.post<InstrumentoSaidaPost>("/instrumentos/", instrumento).then(this.getData)
    }

    static deleteExistingInstrument(instrumentId: number) {
        return this.Http.delete<InstrumentoSaidaDelete>(`/instrumentos/${instrumentId}`).then(this.getData)
    }
}

export default InstrumentoService