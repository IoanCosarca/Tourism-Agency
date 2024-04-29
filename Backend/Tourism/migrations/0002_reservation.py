# Generated by Django 5.0.3 on 2024-03-27 15:09

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Tourism', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('totalPrice', models.DecimalField(decimal_places=2, max_digits=8)),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Tourism.destination')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Tourism.user')),
            ],
        ),
    ]
