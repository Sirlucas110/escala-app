from django.db.models import CharField, DateField, Model, ManyToManyField, ForeignKey, PROTECT

from escala.models.cargo import Cargo
from escala.models.instrumento import Instrumento
from escala.models.pessoa import Pessoa
from simple_history import register


class Escala(Model):
    pessoa = ForeignKey(to=Pessoa, on_delete=PROTECT, related_name='escalas')
    instrumento = ManyToManyField(
        to=Instrumento,
        related_name='instrumento_da_escala',
        blank=True,
    )
    cargos = ManyToManyField(Cargo, related_name='escalas')
    data = DateField(verbose_name='Data')
    descricao = CharField(verbose_name='Descrição', max_length=255, blank=True, null=True)

    def __str__(self):
        return f'Escala do dia {self.data}'

    class Meta:
        verbose_name = 'Escala'
        verbose_name_plural = 'Escalas'


register(model=Escala, table_name='"historico_escala"')
