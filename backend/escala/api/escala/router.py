from django.shortcuts import get_object_or_404
from ninja import Router

from escala.models.cargo import Cargo
from escala.models.escala import Escala

from .schemas import (
    EscalaEntradaPost,
    EscalaEntradaPut,
    EscalaSaidaDelete,
    EscalaSaidaGet,
    EscalaSaidaPost,
    EscalaSaidaPut,
)

router_v1 = Router()


@router_v1.get(path='/', response=list[EscalaSaidaGet], summary='Lista escalas')
def listar_escalas(request):
    escalas = Escala.objects.all()
    return escalas


@router_v1.get(path='/{escala_id}', response=EscalaSaidaGet, summary='Busca escala por ID')
def busca_escala_por_id(request, escala_id: int):
    escala = get_object_or_404(Escala, id=escala_id)
    return escala


@router_v1.post('/', response=EscalaSaidaPost, summary='Cria uma escala')
def cria_uma_nova_escala(request, payload: EscalaEntradaPost):
    escala = Escala.objects.create(
        pessoa_id=payload.pessoa_id,
        data=payload.data,
        descricao=payload.descricao,
    )

    escala.cargos.set(payload.cargo_ids)

    if payload.instrumento_ids:
        escala.instrumento.set(payload.instrumento_ids)

    return {'id': escala.id}


@router_v1.put('/{escala_id}', response=EscalaSaidaPut, summary='Atualiza uma escala')
def atualiza_uma_escala(request, escala_id: int, payload: EscalaEntradaPut):
    escala = get_object_or_404(Escala, id=escala_id)

    escala.pessoa_id = payload.pessoa_id
    escala.data = payload.data
    escala.descricao = payload.descricao
    escala.save()

    escala.cargos.set(payload.cargo_ids)

    if payload.instrumento_ids is not None:
        escala.instrumento.set(payload.instrumento_ids)

    return {'success': True}


@router_v1.delete(path='/{escala_id}', response=EscalaSaidaDelete, summary='Exclui uma escala')
def exclui_uma_escala(request, escala_id: int):
    escala = get_object_or_404(Escala, id=escala_id)
    escala.delete()
    return {'success': True}
