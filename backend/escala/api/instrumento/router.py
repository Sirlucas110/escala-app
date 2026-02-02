from ninja import Router
from django.shortcuts import get_object_or_404

from escala.models.instrumento import Instrumento

from .schemas import InstrumentoEntradaPost, InstrumentoSaidaGet, InstrumentoSaidaPost, InstrumentoSaidaDelete

router_v1 = Router()


@router_v1.get(path='/', response=list[InstrumentoSaidaGet], summary='Lista instrumentos')
def listar_instrumentos(request):
    instrumentos = Instrumento.objects.all()
    return instrumentos


@router_v1.get(path='/{instrumento_id}', response=InstrumentoSaidaGet, summary='Busca um instrumento por ID')
def busca_instrumento_por_id(request, instrumento_id: int):
    instrumento = get_object_or_404(Instrumento, id=instrumento_id)
    return instrumento


@router_v1.post(path='/', response=InstrumentoSaidaPost, summary='Cria um novo instrumento')
def cria_um_novo_instrumento(request, payload: InstrumentoEntradaPost):
    payload_dict = payload.dict()
    instrumento = Instrumento(**payload_dict)
    instrumento.full_clean()
    instrumento.save()
    return {'id': instrumento.id}


@router_v1.delete(path='/{instrumento_id}', response=InstrumentoSaidaDelete, summary='Exclui um instrumento')
def exclui_um_instrumento(request, instrumento_id: int):
    instrumento = get_object_or_404(Instrumento, id=instrumento_id)
    instrumento.delete()
    return {'success': True}
