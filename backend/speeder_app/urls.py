from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='speeder_index'),
    path('play/', views.play, name='speeder_play'),
    path('api/tokenize/', views.tokenize_text, name='tokenize'),
]
