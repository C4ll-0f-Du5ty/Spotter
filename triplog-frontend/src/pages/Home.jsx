import { useContext } from "react";
import { TripContext } from "../context/TripContext";
import TripForm from "../components/TripForm";
import MapView from "../components/MapView";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { setTripData, setSelectedTripId } = useContext(TripContext);
    const navigate = useNavigate();

    // const handleTripSubmit = (trip) => {
    //     setTripData(trip);
    //     setSelectedTripId(trip.id);  // Store the selected trip
    //     navigate("/trip-details");
    // };

    const handleTripSubmit = (trip) => {
        fetch("http://localhost:8000/api/trips/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip),
        })
            .then((response) => response.json())
            .then((data) => {
                setTripData(data);
                setSelectedTripId(data.id); // Store the created trip's ID
                navigate("/trip-details");
            })
            .catch((error) => console.error("Error saving trip:", error));
    };


    return (
        <div className="max-w-2xl mx-auto">
            <TripForm onSubmit={handleTripSubmit} />
            <div className="mt-6">
                <MapView position={[37.7749, -122.4194]} />
            </div>
        </div>
    );
};

export default Home;
