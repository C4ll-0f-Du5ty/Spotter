import TripList from "../components/TripList";

export default function HomePage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Trips</h1>
            <TripList />
        </div>
    );
}
