import { useQuery } from "@tanstack/react-query";
import { fetchTrips } from "../api/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Skeleton Loader Component
const SkeletonCard = () => (
    <motion.div
        className="bg-gray-200 animate-pulse rounded-lg h-32 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    ></motion.div>
);

export default function TripList() {
    const { data: trips, isLoading, error } = useQuery({
        queryKey: ["trips"],
        queryFn: fetchTrips,
    });

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Title Placeholder */}
                <motion.h2
                    className="text-2xl font-bold text-center text-gray-700 animate-pulse"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                >
                    Fetching Trips...
                </motion.h2>

                {/* Loading Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-600">Error loading trips.</p>;

    // Group trips by driver name
    const tripsByDriver = trips.reduce((acc, trip) => {
        if (!acc[trip.driver_name]) acc[trip.driver_name] = [];
        acc[trip.driver_name].push(trip);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(tripsByDriver).map(([driver, driverTrips]) => {
                // Calculate total worked hours in the last 8 days
                const totalHours = driverTrips.reduce((sum, trip) => sum + trip.current_cycle_hours, 0);
                const isOverworked = totalHours >= 70;

                return (
                    <motion.div
                        key={driver}
                        className="bg-white shadow-lg rounded-lg p-6 border-l-4 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Driver Name & Cycle Hours Counter */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {driver}'s Trips
                            </h2>

                            {/* Cycle Hours Indicator */}
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center
                                ${isOverworked ? "bg-red-100 text-red-600 animate-pulse" : "bg-green-100 text-green-600"}`}>
                                {isOverworked ? "⚠ Overworked! Rest Needed" : "✔ Safe to Drive"}
                                <span className="ml-2 text-gray-700">({totalHours}/70h)</span>
                            </div>
                        </div>

                        {/* Trip Cards Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {driverTrips.map((trip) => (
                                <motion.div
                                    key={trip.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to={`/trip/${trip.id}`}
                                        className="block bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-all"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-700">
                                            {trip.start_location} → {trip.end_location}
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            🚗 Miles: {trip.total_miles} | ⏳ Worked: {trip.current_cycle_hours}h
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            🕒 Start: {new Date(trip.start_time).toLocaleString()}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
