from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from ninja import Router
from ninja.security import django_auth
from escala.models.auth_user import AuthUser
from .schemas import SignInSchema

router_v1 = Router()


@router_v1.get(path='/set-csrf-token')
def get_csrf_token(request):
    return {'csrftoken': get_token(request)}


@router_v1.post(path='/login')
def login_view(request, payload: SignInSchema):
    user = authenticate(request, username=payload.email, password=payload.password)
    if user is not None:
        login(request, user)
        return {'success': True}
    return {'success': False, 'message': 'Credenciais inválidas'}


@router_v1.post(path='/logout', auth=django_auth)
def logout_view(request):
    logout(request)
    return {'message': 'Logged out'}


@router_v1.get(path='/user', auth=django_auth)
def user(request):
    return {'username': request.user.username, 'email': request.user.email}


@router_v1.post(path='/register')
def register(request, payload: SignInSchema):
    try:
        AuthUser.objects.create_user(username=payload.email, email=payload.email, password=payload.password)
        return {'success': 'Usuário registrado com sucesso!'}
    except Exception as e:
        return {'error': str(e)}
