from simple_history.admin import SimpleHistoryAdmin
from django.contrib import admin
from escala.models import Instrumento


class InstrumentoAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'nome']


admin.site.register(Instrumento, InstrumentoAdmin)
