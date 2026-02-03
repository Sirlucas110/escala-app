from django.db.models import CharField, Model
from simple_history import register


class Cargo(Model):
    nome = CharField(verbose_name='Nome', max_length=255)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'


register(model=Cargo, table_name='"historico_cargo"')
