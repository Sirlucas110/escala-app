from ninja import Router
from django.shortcuts import get_object_or_404

from escala.models.cargo import Cargo
from .schemas import CargoEntradaPost, CargoSaidaGet, CargoSaidaPost, CargoSaidaDelete

router_v1 = Router()


@router_v1.get(path='/', response=list[CargoSaidaGet], summary='Lista cargos')
def listar_cargos(request):
    cargos = Cargo.objects.all()
    return cargos


@router_v1.get(path='/{cargo_id}', response=CargoSaidaGet, summary='Busca um cargo por ID')
def busca_cargo_por_id(request, cargo_id: int):
    cargo = get_object_or_404(Cargo, id=cargo_id)
    return cargo


@router_v1.post(path='/', response=CargoSaidaPost, summary='Cria um novo cargo')
def cria_um_novo_cargo(request, payload: CargoEntradaPost):
    payload_dict = payload.dict()
    cargo = Cargo(**payload_dict)
    cargo.full_clean()
    cargo.save()
    return {'id': cargo.id}


@router_v1.delete(path='/{cargo_id}', response=CargoSaidaDelete, summary='Exclui um cargo')
def exclui_um_cargo(request, cargo_id: int):
    cargo = get_object_or_404(Cargo, id=cargo_id)
    cargo.delete()
    return {'success': True}
