from django.db import models
from geopy.geocoders import Nominatim

class Trip(models.Model):
    driver_name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    truck_number = models.CharField(max_length=50, blank=True, null=True)
    start_location = models.CharField(max_length=255)
    start_lat = models.FloatField(null=True, blank=True) 
    start_lon = models.FloatField(null=True, blank=True)  
    end_location = models.CharField(max_length=255)
    end_lat = models.FloatField(null=True, blank=True)  
    end_lon = models.FloatField(null=True, blank=True)  
    current_location = models.CharField(max_length=255, blank=True, null=True)
    current_lat = models.FloatField(null=True, blank=True)
    current_lon = models.FloatField(null=True, blank=True)  
    total_miles = models.FloatField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    current_cycle_hours = models.FloatField(default=0)

    def save(self, *args, **kwargs):
        geolocator = Nominatim(user_agent="trip_tracker")

        # Convert start location to coordinates
        if self.start_location and not self.start_lat:
            location = geolocator.geocode(self.start_location)
            if location:
                self.start_lat, self.start_lon = location.latitude, location.longitude

        # Convert end location to coordinates
        if self.end_location and not self.end_lat:
            location = geolocator.geocode(self.end_location)
            if location:
                self.end_lat, self.end_lon = location.latitude, location.longitude

        # Convert current location to coordinates
        if self.current_location and not self.current_lat:
            location = geolocator.geocode(self.current_location)
            if location:
                self.current_lat, self.current_lon = location.latitude, location.longitude

        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.driver_name + f" drived: {self.total_miles} miles from {self.start_location} to {self.end_location}"


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="stops")
    location = models.CharField(max_length=255)
    lat = models.FloatField(null=True, blank=True)  # New field
    lon = models.FloatField(null=True, blank=True)  # New field
    stop_type = models.CharField(
        max_length=50, 
        choices=[("fuel", "Fuel"), ("rest", "Rest"), ("pickup", "Pickup"), ("dropoff", "Dropoff")]
    )
    stop_time = models.DateTimeField()
    duration = models.FloatField(default=0)  # Stop duration

    def save(self, *args, **kwargs):
        geolocator = Nominatim(user_agent="trip_tracker")
        if self.location and not self.lat:
            location = geolocator.geocode(self.location)
            if location:
                self.lat, self.lon = location.latitude, location.longitude
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.trip.driver_name} Stopped at {self.location} For: {self.stop_type} that lasted {self.duration}"

class LogSheet(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    off_duty_hours = models.FloatField(default=0)
    sleeper_berth_hours = models.FloatField(default=0)
    driving_hours = models.FloatField(default=0)
    on_duty_hours = models.FloatField(default=0)

    def total_hours(self):
        return self.off_duty_hours + self.sleeper_berth_hours + self.driving_hours + self.on_duty_hours

    def __str__(self):
        return f"Log sheet for {self.trip.driver_name} that Started at {self.trip.start_location}"
