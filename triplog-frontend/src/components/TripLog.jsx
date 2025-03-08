import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download } from "lucide-react"; // Icons for better UI
import tripLogTemplate from "../assets/image.png"; // Ensure correct path

export default function AnimatedTripLog({ trip }) {
    const [loading, setLoading] = useState(true);
    const [logImages, setLogImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track current log sheet
    const [direction, setDirection] = useState(1); // Track animation direction

    useEffect(() => {
        if (trip && trip.logs.length > 0) {
            setLoading(true);
            const img = new Image();
            img.src = tripLogTemplate;
            img.onload = () => {
                generateLogs(img);
                setLoading(false);
            };
            img.onerror = () => {
                console.error("Error loading image");
                setLoading(false);
            };
        }
    }, [trip]);

    const generateLogs = (img) => {
        const generatedImages = trip.logs.map(log => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Maintain 16:9 ratio
            const maxWidth = 1000;
            const maxHeight = Math.round(maxWidth * (16 / 9));
            canvas.width = maxWidth;
            canvas.height = maxHeight;
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

            // Date
            const dateList = log.date.split('-');
            ctx.fillStyle = "#0000FF";
            ctx.font = "bold 27px Arial";
            ctx.fillText(dateList[0], maxWidth * 0.555, maxHeight * 0.095);
            ctx.fillText(dateList[1], maxWidth * 0.43, maxHeight * 0.095);
            ctx.fillText(dateList[2], maxWidth * 0.5, maxHeight * 0.095);

            // Company:
            ctx.fillText("N/A", 600, 350);
            ctx.fillText("N/A", 600, 295);



            // Driver Info
            ctx.fillText(trip.driver_name, 485, 425);
            ctx.fillText("N/A", 775, 430);
            ctx.fillText(trip.company || "N/A", 550, 235);
            ctx.fillText(trip?.truck_number || "N/A", 150, 390);
            ctx.fillText(`${trip.total_miles} miles`, maxWidth * 0.124, maxHeight * 0.152);
            ctx.fillText(`N/A`, maxWidth * 0.3, maxHeight * 0.152);


            // Log Details
            ctx.fillText(log.off_duty_hours, 890, 550);
            ctx.fillText(log.sleeper_berth_hours, 890, 600);
            ctx.fillText(log.driving_hours, 890, 650);
            ctx.fillText(log.on_duty_hours, 890, 705);

            const totalHours = log.off_duty_hours + log.sleeper_berth_hours + log.driving_hours + log.on_duty_hours;
            ctx.fillText(totalHours, 890, 795);

            // Worked Hours Circle
            ctx.save();
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = '#0000FF';
            ctx.strokeStyle = '#0000FF';
            ctx.lineWidth = 5;

            ctx.beginPath();
            ctx.arc(maxWidth * 0.72, 884, 50, 0, Math.PI * 3);
            ctx.stroke();
            ctx.fillText(log.driving_hours + log.on_duty_hours, maxWidth * 0.7, 895);
            ctx.restore();

            const segments = [
                { hours: log.off_duty_hours, y: 550, color: "#3b82f6" },
                { hours: log.sleeper_berth_hours, y: 600, color: "#9333ea" },
                { hours: log.driving_hours, y: 650, color: "#ef4444" },
                { hours: log.on_duty_hours, y: 705, color: "#f59e0b" }
            ];

            segments.forEach((segment) => {
                if (segment.hours > 0) {
                    const barWidth = (segment.hours / 24) * (maxWidth * 0.6);
                    ctx.fillStyle = segment.color;
                    ctx.fillRect(300, segment.y - 20, barWidth, 20);
                    ctx.fillStyle = "black";
                    ctx.fillText(`${segment.hours}h`, 310 + barWidth, segment.y);
                }
            });

            let stopY = 850;
            ctx.font = "bold 22px Arial";
            trip.stops.forEach((stop, index) => {
                const icon = stop.stop_type === "fuel" ? "⛽" : stop.stop_type === "rest" ? "🛑" : stop.stop_type === "pickup" ? "📦" : "🚛";
                ctx.fillText(`${icon} ${stop.location} (${stop.stop_type}) - ${stop.duration} min`, 250, stopY);
                stopY += 40;
            });

            return canvas.toDataURL("image/png");
        });

        setLogImages(generatedImages);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = logImages[currentIndex];
        link.download = `trip_log_${trip.start_time.split("T")[0]}_day_${currentIndex + 1}.png`;
        link.click();
    };

    const prevLog = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? logImages.length - 1 : prev - 1));
    };

    const nextLog = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === logImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <motion.div className="p-6 bg-white shadow-xl rounded-lg flex flex-col items-center w-full max-w-4xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            {/* Header */}
            <h2 className="text-xl font-bold text-gray-800 mb-3">
                Log Sheet {logImages.length > 1 && `(${currentIndex + 1}/${logImages.length})`}
            </h2>

            {loading ? (
                <motion.p animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                    Generating Logs...
                </motion.p>
            ) : (
                <>
                    {/* Log Sheet Navigation */}
                    <div className="relative w-full flex justify-center items-center">
                        {logImages.length > 1 && (
                            <>
                                {/* Left Arrow */}
                                <motion.button className="absolute left-0 p-2 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition"
                                    onClick={prevLog}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}>
                                    <ChevronLeft size={25} />
                                </motion.button>

                                {/* Right Arrow */}
                                <motion.button className="absolute right-0 p-2 rounded-full bg-gray-100 shadow-md hover:bg-gray-200 transition"
                                    onClick={nextLog}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}>
                                    <ChevronRight size={25} />
                                </motion.button>
                            </>
                        )}

                        {/* Log Image with Animation */}
                        <div className="w-full max-w-2xl flex justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img key={currentIndex}
                                    src={logImages[currentIndex]}
                                    alt={`Log Sheet ${currentIndex + 1}`}
                                    className="shadow-lg rounded-lg border border-gray-300 w-full object-contain"
                                    initial={{ x: direction * 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -direction * 300, opacity: 0 }}
                                // transition={{ type: "spring", stiffness: 120, damping: 12 }}
                                />
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Download Button */}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDownload}
                        className="mt-4 flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
                        <Download size={18} />
                        Download Log Sheet {currentIndex + 1}
                    </motion.button>
                </>
            )}
        </motion.div>
    );
};
