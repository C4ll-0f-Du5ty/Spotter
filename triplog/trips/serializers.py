from rest_framework import serializers
from .models import Trip, Stop, LogSheet

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        exclude = ['trip'] 

class LogSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogSheet
        exclude = ['trip'] 

class TripSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True)
    logs = LogSheetSerializer(many=True)

    class Meta:
        model = Trip
        fields = '__all__'

    def create(self, validated_data):
        stops_data = validated_data.pop('stops', [])
        logs_data = validated_data.pop('logs', [])

        trip = Trip.objects.create(**validated_data)

        for stop in stops_data:
            Stop.objects.create(trip=trip, **stop)

        for log in logs_data:
            LogSheet.objects.create(trip=trip, **log)

        return trip
