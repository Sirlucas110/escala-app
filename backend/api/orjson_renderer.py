from ninja.renderers import BaseRenderer

from orjson import dumps

class ORJSONRenderer(BaseRenderer):
    media_type = 'application/json'

    def render(self, request, data, *, response_status):
        return dumps(data)