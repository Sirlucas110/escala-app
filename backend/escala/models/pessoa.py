from django.db.models import CharField, EmailField, Model



from simple_history import register


class Pessoa(Model):
    nome = CharField(verbose_name='Nome', max_length=255)
    email = EmailField(verbose_name='Email')
    telefone = CharField(verbose_name='Telefone')

    def __str__(self):
        return self.nome

    class Meta:
        db_table = '"escala"."pessoa"'
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'


register(model=Pessoa, table_name='"escala"."historico_pessoa"')
