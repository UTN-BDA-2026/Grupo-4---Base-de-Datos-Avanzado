from django.contrib.auth import get_user_model, authenticate, login, logout

User = get_user_model()

def register_user(data: dict):
    user = User.objects.create_user(
        username=data['username'],
        email=data.get('email', ''),
        password=data['password'],
    )
    return user


def login_user(request, username: str, password: str):
    user = authenticate(request, username=username, password=password)
    if not user:
        return None
    login(request, user)
    return user


def logout_user(request):
    logout(request)