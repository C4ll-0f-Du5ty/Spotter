import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
            <Link to="/" className="text-xl font-bold">Trip Tracker</Link>
            <div>
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/create-trip" className="bg-white text-blue-600 px-4 py-2 rounded">New Trip</Link>
            </div>
        </nav>
    );
}
