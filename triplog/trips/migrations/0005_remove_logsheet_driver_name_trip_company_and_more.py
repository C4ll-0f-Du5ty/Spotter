# Generated by Django 5.1.1 on 2025-03-07 12:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0004_logsheet_driver_name_stop_lat_stop_lon_trip_end_lat_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='logsheet',
            name='driver_name',
        ),
        migrations.AddField(
            model_name='trip',
            name='company',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='trip',
            name='truck_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
