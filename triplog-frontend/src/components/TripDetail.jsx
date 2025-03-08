import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchTripDetails } from "../api/api";
import TripMap from "./TripMap";
import TripLog from "./TripLog";
import ErrorBoundary from '../ErrorHandlers/ErrorBoundary'
import { Trophy } from "lucide-react";

export default function TripDetail() {
    const { id } = useParams();
    const { data: trip, isLoading, error } = useQuery({
        queryKey: ["trip", id],
        queryFn: () => fetchTripDetails(id),
    });

    if (isLoading) return <p className="loading-message">Loading trip details...</p>;
    if (error) return <p className="error-message">Error loading trip details.</p>;

    console.log(trip)
    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header Section */}
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in-down">
                    {trip.driver_name}'s Trip
                </h1>
                <p className="text-gray-600 animate-fade-in-up">
                    {trip.start_location} → {trip.end_location}
                </p>
            </header>

            {/* Map Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-center mb-4 animate-fade-in-up">
                    Map
                </h2>
                <div className="rounded-lg border bg-card">
                    <ErrorBoundary>
                        <TripMap trip={trip} />
                    </ErrorBoundary>
                </div>
            </section>

            {/* Log Sheet Section */}
            <section>
                {/* <h2 className="text-xl font-semibold text-center mb-4 animate-fade-in-up">
                    Log Sheet
                </h2> */}
                <div className="rounded-lg border bg-card">
                    <TripLog trip={trip} />
                </div>
            </section>
        </div>
    );
}
