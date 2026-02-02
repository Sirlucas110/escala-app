from django.contrib import admin
from escala.models import Cargo
from simple_history.admin import SimpleHistoryAdmin


class CargoAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'nome']


admin.site.register(Cargo, CargoAdmin)