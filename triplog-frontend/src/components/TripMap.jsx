import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";

const ORS_API_KEY = "5b3ce3597851110001cf624842e5c4ecf7d04c2bbc5888499a2ea866";

// Simple Note: the distance should not exceed 6000000.0 meters. as beyond that it will exceed the server configuration limits

export default function TripMap({ trip }) {
    const [routeCoords, setRouteCoords] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (
            !trip ||
            !trip?.start_lat ||
            !trip?.start_lon ||
            !trip?.end_lat ||
            !trip?.end_lon
        )
            return;



        // console.log(trip.start_time.split("T")[0])

        const fetchFullRoute = async () => {
            if (!trip || !trip?.start_lat || !trip?.start_lon || !trip?.end_lat || !trip?.end_lon) return;

            const current = [trip?.current_lon, trip?.current_lat]
            let rawLocations = []
            // Collect locations: Start → Stops → End
            if (current && current[0] == null) {
                rawLocations = [
                    [trip?.start_lon, trip?.start_lat], // Start location (lon, lat)
                    ...trip.stops.map((stop) => [stop?.lon, stop?.lat]), // Stops (lon, lat)
                    [trip?.end_lon, trip?.end_lat], // End location (lon, lat)
                ];
            }
            else {
                rawLocations = [
                    [trip?.current_lon, trip?.current_lat],
                    [trip?.start_lon, trip?.start_lat], // Start location (lon, lat)
                    ...trip.stops.map((stop) => [stop?.lon, stop?.lat]), // Stops (lon, lat)
                    [trip?.end_lon, trip?.end_lat], // End location (lon, lat)
                ];
            }
            // console.log("Raw locations for routing:", rawLocations);
            // console.log("Raw locations for routing:", rawLocations);

            const url = "https://api.openrouteservice.org/v2/directions/driving-hgv";

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": ORS_API_KEY,
                    },
                    body: JSON.stringify({
                        coordinates: rawLocations, // Pass coordinates in [lon, lat] format
                        format: "geojson",
                        instructions: true,
                    }),
                });

                const data = await response?.json();
                // console.log("ORS Route Response:", data);

                if (data?.routes && data?.routes?.length > 0) {

                    const encodedPolyline = data?.routes[0]?.geometry;
                    // console.log("Encoded Polyline:", encodedPolyline);

                    const decodedRoute = polyline?.decode(encodedPolyline);
                    setRouteCoords(decodedRoute);
                    setErrorMessage(null);
                }
                if (routeCoords.length == 0 && response.status == 400) {
                    setErrorMessage("The distance has surpassed 6000000.0 meters, which exceeds the configuration limits set by the ORS server.");

                }
            } catch (error) {
                console.error("Error fetching full route:", error);
                setErrorMessage("The distance has surpassed 6000000.0 meters, which exceeds the configuration limits set by the ORS server.");
            }
        };


        fetchFullRoute();
    }, [trip]);

    // Debug.
    useEffect(() => {
        // console.log("Updated routeCoords:", routeCoords);

    }, [routeCoords]);

    if (
        !trip ||
        !trip?.start_lat ||
        !trip?.start_lon ||
        !trip?.end_lat ||
        !trip?.end_lon
    ) {
        return <p>Loading Map...</p>;
    }

    return (
        <div className="relative">
            {/* Display error message if there's a 400 error */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-400 rounded">
                    <p>{errorMessage}</p>
                </div>
            )}
            <MapContainer
                center={[trip?.start_lat, trip?.start_lon]}
                zoom={4}
                style={{ height: "400px", width: "100%", }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {routeCoords?.length > 0 && (
                    <Polyline positions={routeCoords} color="blue" weight={4} />
                )}

                {trip.current_lat && <Marker position={[trip?.current_lat, trip?.current_lon]}>
                    <Popup>now: {trip?.current_location}</Popup>
                </Marker>}

                <Marker position={[trip?.start_lat, trip?.start_lon]}>
                    <Popup>Start: {trip?.start_location}</Popup>
                </Marker>

                {trip?.stops.map((stop, index) => (
                    <Marker key={index} position={[stop?.lat, stop?.lon]}>
                        <Popup>{stop?.location} ({stop?.stop_type})</Popup>
                    </Marker>
                ))}

                <Marker position={[trip?.end_lat, trip?.end_lon]}>
                    <Popup>End: {trip?.end_location}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
