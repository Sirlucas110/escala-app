from django.db.models import CharField, Model
from simple_history import register


class Instrumento(Model):
    nome = CharField(verbose_name='Nome', max_length=255)

    def __str__(self):
        return self.nome

    class Meta:
        db_table = '"escala"."instrumento"'
        verbose_name = 'Instrumento'
        verbose_name_plural = 'Instrumentos'


register(model=Instrumento, table_name='"escala"."historico_instrumento"')
