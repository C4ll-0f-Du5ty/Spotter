import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchTripDetails } from "../api/api";
import TripMap from "./TripMap";
import TripLog from "./TripLog";
import ErrorBoundary from '../ErrorHandlers/ErrorBoundary';
import { motion } from "framer-motion";

// Skeleton Loader Component
const SkeletonLoader = () => (
    <motion.div
        className="bg-gray-200 animate-pulse rounded-lg h-32 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    ></motion.div>
);

export default function TripDetail() {
    const { id } = useParams();
    const { data: trip, isLoading, error } = useQuery({
        queryKey: ["trip", id],
        queryFn: () => fetchTripDetails(id),
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Title Placeholder */}
                <motion.h2
                    className="text-2xl font-bold text-center text-gray-700 animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Fetching Trip Details...
                </motion.h2>

                {/* Skeleton Loader for Map and Log Sections */}
                <div className="space-y-6 mt-6">
                    <SkeletonLoader /> {/* Simulating Map Section */}
                    <SkeletonLoader /> {/* Simulating Log Sheet Section */}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-600">Error loading trip details.</p>;

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
                <div className="rounded-lg border bg-card">
                    <TripLog trip={trip} />
                </div>
            </section>
        </div>
    );
}
