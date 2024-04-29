import os
from datetime import datetime, timedelta

import pytz
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from Tourism.models import User, Destination, Reservation
from Tourism.serializers import UserSerializer, DestinationSerializer, ReservationSerializer


# Create your views here.
def say_hello(request):
    return HttpResponse("Hello World")


""" USER ENDPOINTS """


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_by_name(request, name):
    users = User.objects.filter(name=name)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_user(request):
    try:
        # Hash the password before saving it
        request.data['password'] = make_password(request.data['password'])
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return JsonResponse({"message": "Failed to register user"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def authenticate_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(password, user.password):
        user_data = {
            'id': user.id,
            'name': user.name,
            'role': user.role,
            'email': user.email,
            'password': user.password
        }
        return Response(user_data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
def update_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_user_by_name(request, name):
    users = User.objects.filter(name=name)
    users.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


""" DESTINATION ENDPOINTS"""


@api_view(['GET'])
def get_destinations(request):
    database_destinations = Destination.objects.all()
    serializer = DestinationSerializer(prepare_destinations(database_destinations), many=True)
    return Response(serializer.data)


def prepare_destinations(database_destinations):
    destinations = []
    for destination in database_destinations:
        destinations.append({
            'id': destination.id,
            'name': destination.name,
            'location': destination.location,
            'image': destination.image,
            'description': destination.description,
            'pricePerNight': destination.pricePerNight,
            'spots': destination.spots,
            'discount': destination.discount
        })
    return destinations


@api_view(['GET'])
def get_destination(request, destination_id):
    destination = get_object_or_404(Destination, pk=destination_id)
    serializer = DestinationSerializer(destination)
    return Response(serializer.data)


@api_view(['GET'])
def get_destination_by_name(request, name):
    database_destinations = Destination.objects.filter(name=name)
    serializer = DestinationSerializer(prepare_destinations(database_destinations), many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_destination_by_location(request, location):
    database_destinations = Destination.objects.filter(location=location)
    serializer = DestinationSerializer(prepare_destinations(database_destinations), many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_destination_by_discount(request, discount):
    destinations = Destination.objects.filter(discountPercent=discount)
    serializer = DestinationSerializer(destinations, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_destination(request):
    try:
        # Here, you can convert the base64 string back to binary
        serializer = DestinationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Destination created successfully"}, status=status.HTTP_201_CREATED)
        return JsonResponse({"message": "Failed to create destination"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_destination(request, destination_name):
    destination = get_object_or_404(Destination, name=destination_name)

    # Exclude the 'image' field from the serializer's fields
    serializer = DestinationSerializer(destination, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_destination(request, destination_id):
    destination = get_object_or_404(Destination, pk=destination_id)
    destination.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_destination_by_name(request, name):
    try:
        destination = Destination.objects.get(name=name)
    except Destination.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Delete the image file
    if destination.image:
        image_path = os.path.join(settings.MEDIA_ROOT, str(destination.image))
        if os.path.exists(image_path):
            os.remove(image_path)

    # Delete the destination
    destination.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)


""" RESERVATIONS ENDPOINT """


@api_view(['GET'])
def get_reservations(request):
    reservations = Reservation.objects.all()
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_reservation(request, reservation_id):
    reservation = Reservation.objects.get(pk=reservation_id)
    serializer = ReservationSerializer(reservation)
    return Response(serializer.data)


@api_view(['GET'])
def get_reservations_by_destination(request, destination_id):
    try:
        destination = get_object_or_404(Destination, pk=destination_id)
        reservations = Reservation.objects.filter(destination=destination)

        localized_reservations = []
        for reservation in reservations:
            # Convert timezone to the desired timezone and add the GMT offset
            start_date_local = timezone.localtime(reservation.start_date)
            start_date_with_offset = start_date_local + timedelta(hours=2)  # Assuming GMT+2

            end_date_local = timezone.localtime(reservation.end_date)
            end_date_with_offset = end_date_local + timedelta(hours=2)  # Assuming GMT+2

            localized_reservation = {
                'id': reservation.id,
                'user': reservation.user_id,
                'destination': reservation.destination_id,
                'date': reservation.date,
                'start_date': start_date_with_offset.isoformat(),
                'end_date': end_date_with_offset.isoformat(),
                'totalPrice': reservation.totalPrice,
            }
            localized_reservations.append(localized_reservation)

        serializer = ReservationSerializer(data=localized_reservations, many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return JsonResponse({"message": f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_reservation(request):
    try:
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            # Adjust dates for timezone offset
            start_date_str = serializer.validated_data['start_date']
            end_date_str = serializer.validated_data['end_date']

            time_zone = pytz.timezone('Europe/Bucharest')
            start_date = datetime.fromisoformat(str(start_date_str)).replace(tzinfo=time_zone)
            end_date = datetime.fromisoformat(str(end_date_str)).replace(tzinfo=time_zone)

            # Save the reservation with adjusted dates
            serializer.save(start_date=start_date, end_date=end_date)

            return JsonResponse({"message": "Reservation created successfully"}, status=status.HTTP_201_CREATED)
        return JsonResponse({"message": "Failed to create reservation", "errors": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
