from ninja import ModelSchema, Schema
from escala.models.cargo import Cargo


class CargoSaidaGet(ModelSchema):
    class Meta:
        model = Cargo
        fields = ['id', 'nome']

class CargoEntradaPost(ModelSchema):
    class Meta:
        model = Cargo
        fields = ['nome']

class CargoSaidaPost(Schema):
    id: int

class CargoSaidaDelete(Schema):
    success: bool

