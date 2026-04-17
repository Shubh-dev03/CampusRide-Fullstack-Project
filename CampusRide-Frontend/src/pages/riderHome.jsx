import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";

function RiderHome() {
  const [rides, setRides] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        if (role === "driver") {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/allrides`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setRides(res.data.data);
      } catch (error) {
        console.log(error);
        showError("Failed to fetch rides");
      }
    };

    fetchRides();
  }, [role, navigate, token]);

  const handleBooking = async (rideId) => {
    try {
      setBookingId(rideId);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/book/${rideId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      showSuccess("Ride booked successfully");

      setRides((prev) =>
        prev.map((ride) =>
          ride._id === rideId
            ? { ...ride, availableSeats: ride.availableSeats - 1 }
            : ride,
        ),
      );
    } catch (error) {
      showError(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-[#111827] mb-6">
          Available Rides
        </h2>

        {rides.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center text-[#9CA3AF]">
            No rides available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {ride.from} → {ride.to}
                  </h3>

                  <span className="text-[#10B981] font-medium">
                    ₹{ride.rideFare}
                  </span>
                </div>

                <div className="mt-2 text-sm text-[#4B5563]">
                  <p>Seats: {ride.availableSeats}</p>
                  <p>Time: {ride.rideTime}</p>
                </div>

                <button
                  disabled={ride.availableSeats === 0 || bookingId === ride._id}
                  onClick={() => handleBooking(ride._id)}
                  className="mt-4 w-full bg-[#2563EB] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingId === ride._id
                    ? "Booking..."
                    : ride.availableSeats === 0
                      ? "Full"
                      : "Book Ride"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiderHome;
