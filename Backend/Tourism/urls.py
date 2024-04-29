from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('user/', views.get_users),
    path('user/<int:user_id>/', views.get_user),
    path('user/get_user_by_name/<str:name>/', views.get_user_by_name),
    path('user/create/', views.create_user),
    path('user/authenticate/', views.authenticate_user),
    path('user/<int:user_id>/update/', views.update_user),
    path('user/<int:user_id>/delete/', views.delete_user),
    path('user/delete_user_by_name/<str:name>/', views.delete_user_by_name),

    # Destination endpoints
    path('destination/', views.get_destinations),
    path('destination/<int:destination_id>/', views.get_destination),
    path('destination/get_destination_by_name/<str:name>/', views.get_destination_by_name),
    path('destination/get_destination_by_location/<str:location>/', views.get_destination_by_location),
    path('destination/get_destination_by_discount/<str:discount>/', views.get_destination_by_discount),
    path('destination/create/', views.create_destination),
    path('destination/<str:destination_name>/update/', views.update_destination),
    path('destination/<int:destination_id>/delete/', views.delete_destination),
    path('destination/delete_destination_by_name/<str:name>/', views.delete_destination_by_name),

    # Reservation endpoints
    path('reservation/', views.get_reservations),
    path('reservation/<int:reservation_id>/', views.get_reservation),
    path('reservation/get_reservations_by_destination/<int:destination_id>/', views.get_reservations_by_destination),
    path('reservation/create/', views.create_reservation),

    path('', views.say_hello)
]
