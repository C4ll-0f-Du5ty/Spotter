import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TripDetail from "./components/TripDetail";
import CreateTrip from "./components/CreateTrip";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <div className="container mx-auto mt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/create-trip" element={<CreateTrip />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
