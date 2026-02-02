from ninja import ModelSchema, Schema
from escala.models.pessoa import Pessoa


class PessoaSaidaGet(ModelSchema):

    class Meta:
        model = Pessoa
        fields = ['id', 'nome', 'email', 'telefone']


class PessoaEntradaPost(ModelSchema):
    class Meta:
        model = Pessoa
        fields = ['nome', 'email', 'telefone']


class PessoaSaidaPost(Schema):
    id: int


class PessoaEntradaPut(ModelSchema):
    class Meta:
        model = Pessoa
        fields = ['nome', 'email', 'telefone']


class PessoaSaidaPut(Schema):
    success: bool


class PessoaSaidaDelete(Schema):
    success: bool
