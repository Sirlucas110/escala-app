from ninja import Router
from escala.api.cargo import cargo_router_v1
from escala.api.instrumento import instrumento_router_v1
from escala.api.pessoa import pessoa_router_v1
from escala.api.escala import escala_router_v1
from escala.api.auth import auth_user_router_v1

router_v1 = Router()

router_v1.add_router('/auth', auth_user_router_v1, tags=['Autenticação'])
router_v1.add_router('/cargos', cargo_router_v1, tags=['Cargos'])
router_v1.add_router('/instrumentos', instrumento_router_v1, tags=['Instrumentos'])
router_v1.add_router('/pessoas', pessoa_router_v1, tags=['Pessoas'])
router_v1.add_router('/escalas', escala_router_v1, tags=['Escalas'])
