from django.db import models
from django.utils import timezone


# Create your models here.
# Model to retain information about a user.
class User(models.Model):
    ROLE_CHOICES = (
        ('AGENT', 'Agent'),
        ('CLIENT', 'Client'),
    )

    name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField()
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CLIENT')


# Model to retain information about a destination.
class Destination(models.Model):
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    image = models.ImageField(upload_to='images/')
    description = models.TextField()
    pricePerNight = models.DecimalField(max_digits=5, decimal_places=2)
    spots = models.IntegerField()
    discount = models.IntegerField(default=0)


# Model to retain information about a reservation
class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    totalPrice = models.DecimalField(max_digits=8, decimal_places=2)
