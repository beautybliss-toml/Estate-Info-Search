from django.urls import path
from sapp import views

urlpatterns = [
    path('api1/getApartmentInfo', views.Sapp_list),
    path('sapps/<int:pk>/', views.Sapp_detail),
]