from ninja import ModelSchema, Schema
from escala.models.instrumento import Instrumento


class InstrumentoSaidaGet(ModelSchema):
    class Meta:
        model = Instrumento
        fields = ['id', 'nome']

class InstrumentoEntradaPost(ModelSchema):
    class Meta:
        model = Instrumento
        fields = ['nome']

class InstrumentoSaidaPost(Schema):
    id: int

class InstrumentoSaidaDelete(Schema):
    success: bool

