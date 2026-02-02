import Service from "../Service";
import {
  CargoEntradaPost,
  CargoSaidaDelete,
  CargoSaidaGet,
  CargoSaidaPost,
} from "../types/cargo";

class CargoService extends Service {
  static getAllCargos() {
    return this.Http.get<CargoSaidaGet[]>("/cargos/").then(this.getData);
  }

  static insertNewCargo(cargo: CargoEntradaPost) {
    return this.Http.post<CargoSaidaPost>("/cargos/", cargo).then(this.getData);
  }

  static deleteExistingCargo(cargoId: number) {
    return this.Http.delete<CargoSaidaDelete>(`/cargos/${cargoId}`).then(
      this.getData,
    );
  }
}

export default CargoService;
