from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Modelo de usuario personalizado basado en AbstractUser de Django.
    Permite extender funcionalidades del usuario en el futuro.
    """
    pass
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
    
    def __str__(self):
        return self.username
