const BASE_URL = "https://skinny-dode-allem-79a4f1a4.koyeb.app/"; // Change this if needed

export async function fetchTrips() {
    const res = await fetch(`${BASE_URL}/trips/`);
    return res.json();
}

export async function fetchTripDetails(id) {
    const res = await fetch(`${BASE_URL}/trips/${id}/`);
    return res.json();
}

export async function createTrip(tripData) {
    const res = await fetch(`${BASE_URL}/trips/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
    });
    if (!res.ok) {
        const errorData = await res.json(); // Get error details from backend
        console.error("Error creating trip:", errorData);
        throw new Error(errorData.detail || "Failed to create trip");
    }

    return res.json();
}
