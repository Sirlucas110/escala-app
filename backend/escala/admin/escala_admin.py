from simple_history.admin import SimpleHistoryAdmin
from django.contrib import admin
from escala.models import Escala


class EscalaAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'get_pessoa', 'get_cargos', 'data', 'descricao']

    # pessoa é FK -> só mostrar nome
    def get_pessoa(self, obj):
        return obj.pessoa.nome

    get_pessoa.short_description = 'Pessoa'

    # cargos é M2M -> lista separada por vírgula
    def get_cargos(self, obj):
        return obj.cargo.nome

   


admin.site.register(Escala, EscalaAdmin)
