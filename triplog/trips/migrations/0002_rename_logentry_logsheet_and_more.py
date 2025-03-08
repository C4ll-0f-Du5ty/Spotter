# Generated by Django 5.1.1 on 2025-03-05 23:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='LogEntry',
            new_name='LogSheet',
        ),
        migrations.RenameField(
            model_name='trip',
            old_name='current_location',
            new_name='driver_name',
        ),
        migrations.RenameField(
            model_name='trip',
            old_name='dropoff_location',
            new_name='end_location',
        ),
        migrations.RenameField(
            model_name='trip',
            old_name='pickup_location',
            new_name='start_location',
        ),
        migrations.RenameField(
            model_name='trip',
            old_name='current_cycle_hours',
            new_name='total_miles',
        ),
        migrations.AlterField(
            model_name='trip',
            name='start_time',
            field=models.DateTimeField(),
        ),
        migrations.CreateModel(
            name='Stop',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=255)),
                ('stop_type', models.CharField(choices=[('fuel', 'Fuel'), ('rest', 'Rest'), ('pickup', 'Pickup'), ('dropoff', 'Dropoff')], max_length=50)),
                ('stop_time', models.DateTimeField()),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stops', to='trips.trip')),
            ],
        ),
    ]
