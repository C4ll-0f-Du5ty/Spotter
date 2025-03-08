import { useEffect, useState, useContext } from "react";
import { TripContext } from "../context/TripContext";

const TripDetails = () => {
    const { selectedTripId } = useContext(TripContext);
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        if (!selectedTripId) return;

        fetch(`http://localhost:8000/api/trips/${selectedTripId}`)
            .then((res) => res.json())
            .then((data) => setTripDetails(data))
            .catch((err) => console.error("Error fetching trip details:", err));
    }, [selectedTripId]);

    if (!tripDetails) return <h1>Loading trip details...</h1>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">{tripDetails.name}</h2>
            <p><strong>Distance:</strong> {tripDetails.distance} miles</p>
            <p><strong>Stops:</strong></p>
            <ul>
                {tripDetails.stops.map((stop, index) => (
                    <li key={index}>{stop.name} - {stop.location.join(", ")}</li>
                ))}
            </ul>
        </div>
    );
};

export default TripDetails;
