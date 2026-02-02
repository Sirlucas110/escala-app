from django.contrib import admin
from escala.models import AuthUser
from simple_history.admin import SimpleHistoryAdmin


class AuthUserAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'email']


admin.site.register(AuthUser, AuthUserAdmin)
