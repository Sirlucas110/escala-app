from ninja import NinjaAPI
from escala.api import escala_router_v1
from api.orjson_renderer import ORJSONRenderer

api_v1 = NinjaAPI(version='1.0.0', title='API ESCALA - LUCAS-DEV', renderer=ORJSONRenderer())


api_v1.add_router('/escala', escala_router_v1)