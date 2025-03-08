import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrip } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { motion } from "framer-motion";

import 'react-toastify/dist/ReactToastify.css';

export default function CreateTrip() {
    const [formData, setFormData] = useState({
        driver_name: "",
        company: "",
        truck_number: "",
        start_location: "",
        end_location: "",
        total_miles: "",
        start_time: "",
        end_time: "",
        current_location: "",
        current_cycle_hours: "",
        stops: [],
        logs: [],
    });

    const [stop, setStop] = useState({
        location: "",
        stop_type: "",
        stop_time: "",
        duration: "",
    });

    const [log, setLog] = useState({
        date: "",
        off_duty_hours: "",
        sleeper_berth_hours: "",
        driving_hours: "",
        on_duty_hours: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTrip,
        onMutate: () => setIsSubmitting(true), // Disable button when  submit
        onSuccess: () => {
            console.log("Was Successful")
        },
        onError: (error) => {
            toast.error(`Failed to create trip: ${error.message}`);
        },
        onSettled: () => setIsSubmitting(false), // Re-enable button
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleStopChange = (e) => setStop({ ...stop, [e.target.name]: e.target.value });
    const handleLogChange = (e) => setLog({ ...log, [e.target.name]: e.target.value });

    const addStop = () => {
        if (!stop.location || !stop.stop_type || !stop.stop_time || !stop.duration) {
            // alert("Please fill in all stop details!");
            toast.error("Please fill in all stop details!");
            return;
        }
        setFormData({ ...formData, stops: [...formData.stops, { ...stop, duration: parseInt(stop.duration) }] });
        setStop({ location: "", stop_type: "", stop_time: "", duration: "" });
    };

    const addLog = () => {
        if (!log.date || !log.off_duty_hours || !log.sleeper_berth_hours || !log.driving_hours || !log.on_duty_hours) {
            // alert("Please fill in all log details!");
            toast.error("Please fill in all log details!");

            return;
        }
        setFormData({
            ...formData,
            logs: [...formData.logs, {
                ...log,
                off_duty_hours: parseFloat(log.off_duty_hours),
                sleeper_berth_hours: parseFloat(log.sleeper_berth_hours),
                driving_hours: parseFloat(log.driving_hours),
                on_duty_hours: parseFloat(log.on_duty_hours),
            }]
        });
        setLog({ date: "", off_duty_hours: "", sleeper_berth_hours: "", driving_hours: "", on_duty_hours: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.stops.length === 0) {
            // alert("You must add at least one stop!");
            toast.error("You must add at least one stop!");
            return;
        }

        if (formData.logs.length === 0) {
            // alert("You must add at least one log entry!");
            toast.error("You must add at least one log entry!");

            return;
        }

        const mutationPromise = mutation.mutateAsync({
            driver_name: formData.driver_name,
            current_location: formData.current_location,
            start_location: formData.start_location,
            end_location: formData.end_location,
            total_miles: parseFloat(formData.total_miles),
            start_time: new Date(formData.start_time).toISOString(),
            end_time: new Date(formData.end_time).toISOString(),
            company: formData.company,
            truck_number: formData.truck_number,
            current_cycle_hours: formData.current_cycle_hours,


            // Stops should not contain `trip`
            stops: formData.stops.map(stop => ({
                location: stop.location,
                stop_type: stop.stop_type,
                stop_time: stop.stop_time,
                duration: parseInt(stop.duration) || 0
            })),

            // Logs must contain `driver_name`
            logs: formData.logs.map(log => ({
                // driver_name: formData.driver_name, // Ensure driver_name is included
                date: log.date,
                off_duty_hours: parseFloat(log.off_duty_hours) || 0,
                sleeper_berth_hours: parseFloat(log.sleeper_berth_hours) || 0,
                driving_hours: parseFloat(log.driving_hours) || 0,
                on_duty_hours: parseFloat(log.on_duty_hours) || 0
            }))
        });
        // Show the toast based on the actual mutation result
        toast.promise(mutationPromise, {
            pending: {
                render: "Processing...⌛",
                icon: "⌛"
            },
            success: {
                render: "Trip created successfully! ✅",
                icon: "✅"
            },
            error: {
                render: "Failed to create trip! ❌",
                icon: "❌"
            }
        });

        try {
            await mutationPromise;
            queryClient.invalidateQueries({ queryKey: ["trips"] });


            toast.info("Redirecting to home page... 🏠", {
                autoClose: 2000, // 2 seconds before navigation
            });

            setTimeout(() => {
                navigate("/");
            }, 2500); // 2.5 seconds to allow toast to show
        } catch (error) {
            console.error("Error creating trip:", error);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={true}
                draggable={true}
            />
            <motion.div
                className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="p-6 bg-white shadow-lg rounded-xl">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Add a New Trip</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div className="grid grid-cols-2 gap-4">
                            <input type="text" name="driver_name" placeholder="Driver Name" className="input-field" value={formData.driver_name} onChange={handleChange} required />
                            <input
                                type="text"
                                placeholder="Company"
                                className="input-field"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                placeholder="Truck/Tractor Number"
                                className="input-field"
                                name="truck_number"
                                value={formData.truck_number}
                                onChange={handleChange}
                            />
                            <input type="text" name="current_location" placeholder="current_location" className="input-field" value={formData.current_location} onChange={handleChange} required />
                            <input type="text" name="start_location" placeholder="Start Location" className="input-field" value={formData.start_location} onChange={handleChange} required />
                            <input type="text" name="end_location" placeholder="End Location" className="input-field" value={formData.end_location} onChange={handleChange} required />
                            <div className="relative">
                                <label htmlFor="start_time" className="text-gray-900 text-sm absolute bottom-11 left-1">
                                    Select Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start_time"
                                    name="start_time"
                                    className="input-field mt-4"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="start_time" className="text-gray-900 text-sm absolute bottom-11 left-1">
                                    Select End Time
                                </label>
                                <input type="datetime-local" name="end_time" className="input-field mt-4" value={formData.end_time} onChange={handleChange} required />
                            </div>
                            <input type="number" name="total_miles" placeholder="Total Miles" className="input-field" value={formData.total_miles} onChange={handleChange} required />
                            <input
                                type="number"
                                name="current_cycle_hours"
                                className="input-field"
                                value={formData.current_cycle_hours}
                                onChange={handleChange}
                                placeholder="Current Cycle Hours"
                                required
                            />
                        </motion.div >

                        {/* Stops Section */}
                        <motion.div className="bg-gray-100 p-4 rounded-md">
                            <h2 className="text-xl font-semibold mt-6">Add Stops</h2>
                            <div className="grid grid-cols-4 gap-2">
                                <input type="text" name="location" placeholder="Stop Location" className="input-field" value={stop.location} onChange={handleStopChange} />
                                <select name="stop_type" className="input-field" value={stop.stop_type} onChange={handleStopChange}>
                                    <option value="">Select Stop Type</option>
                                    <option value="fuel">Fuel</option>
                                    <option value="rest">Rest</option>
                                    <option value="pickup">Pickup</option>
                                    <option value="dropoff">Dropoff</option>
                                </select>
                                <input type="datetime-local" name="stop_time" className="input-field" value={stop.stop_time} onChange={handleStopChange} />
                                <input type="number" name="duration" placeholder="Duration (minutes)" className="input-field" value={stop.duration} onChange={handleStopChange} />
                            </div>
                            <button type="button" onClick={addStop} className="btn btn-green">Add Stop</button>

                            {/* Stops List */}
                            <ul className="mt-3 space-y-2">
                                {formData.stops.map((s, index) => (
                                    <li key={index} className="text-gray-700">{s.location} ({s.stop_type}) at {s.stop_time} - Duration: {s.duration} minutes</li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Log Sheet Section */}
                        <motion.div className="bg-gray-100 p-4 rounded-md">
                            <h2 className="text-xl font-semibold mt-6">Daily Log Entry</h2>
                            <div className="grid grid-cols-5 gap-2">
                                <input type="date" name="date" className="input-field" value={log.date} onChange={handleLogChange} />
                                <input type="number" name="off_duty_hours" placeholder="Off Duty" className="input-field" value={log.off_duty_hours} onChange={handleLogChange} />
                                <input type="number" name="sleeper_berth_hours" placeholder="Sleeper" className="input-field" value={log.sleeper_berth_hours} onChange={handleLogChange} />
                                <input type="number" name="driving_hours" placeholder="Driving" className="input-field" value={log.driving_hours} onChange={handleLogChange} />
                                <input type="number" name="on_duty_hours" placeholder="On Duty" className="input-field" value={log.on_duty_hours} onChange={handleLogChange} />
                            </div>
                            <button type="button" onClick={addLog} className="btn btn-green">Add Log Entry</button>

                            {/* Logs List */}
                            <ul className="mt-3 space-y-2">
                                {formData.logs.map((l, index) => (
                                    <li key={index} className="text-gray-700">📅 {l.date} | 🏕️ Off Duty: {l.off_duty_hours}h | 🛌 Sleep: {l.sleeper_berth_hours}h | 🚛 Driving: {l.driving_hours}h | 👷‍♂️ On Duty {l.on_duty_hours}h </li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* Submit Button */}
                        {/* <button type="submit" disabled={isSubmitting} className={`btn btn-blue ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {isSubmitting ? "Creating..." : "Create Trip"}
                        </button> */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isSubmitting ? "Creating..." : "Create Trip"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </>
    );
}
