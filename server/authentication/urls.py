from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='api_token_auth'), # Using DRF's default token auth for now
]
