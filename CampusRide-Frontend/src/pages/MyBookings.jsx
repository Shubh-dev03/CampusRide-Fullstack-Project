import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const formatRideTime = (rideTime) => {
  if (!rideTime) return "";
  const date = new Date(rideTime);
  if (isNaN(date)) return rideTime;
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
};

function MyBookings() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/mybookings`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRides(res.data.data);
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (rideId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setCancellingId(rideId);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/cancel/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRides((prev) => prev.filter((ride) => ride._id !== rideId));
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">
            {" "}
            My Bookings
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            View and manage your ride bookings
          </p>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 animate-pulse max-w-sm"
              >
                <div className="h-4 bg-[#F3F4F6] rounded w-1/4 mb-2" />
                <div className="h-5 bg-[#F3F4F6] rounded w-1/2 mb-4" />
                <div className="h-4 bg-[#F3F4F6] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          // Empty state matching screenshot
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A34A"
                strokeWidth="1.8"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <h3 className="text-[#111827] font-semibold text-base mb-1">
              No Bookings yet
            </h3>
            <p className="text-sm text-[#9CA3AF] mb-5">
              Browse available rides and book your first trip
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-[#16A34A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
            >
              Browse Rides
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rides.map((ride) => {
              const totalSeats =
                ride.availableSeats + (ride.passengers?.length ?? 0);
              const bookedSeats = ride.passengers?.length ?? 0;

              const isCompleted = new Date(ride.rideTime) < new Date();

              return (
                <div
                  key={ride._id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Driver */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium">
                        Driver
                      </p>
                      <p className="text-[#111827] font-semibold text-base leading-tight mt-0.5">
                        {ride.driver?.name ?? "Unknown"}
                      </p>
                    </div>

                    {isCompleted && (
                      <span className=" text-xs- bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full font-medium ">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-3 mb-4">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">From</p>
                      <p className="text-[#111827] font-semibold text-sm">
                        {ride.from}
                      </p>
                    </div>
                    <svg
                      className="mt-4 flex-shrink-0"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-[#9CA3AF]">To</p>
                      <p className="text-[#111827] font-semibold text-sm">
                        {ride.to}
                      </p>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-sm border-t border-[#F3F4F6] pt-3 mb-4">
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-xs">
                        {formatRideTime(ride.rideTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#10B981]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      <span className="text-xs font-semibold">
                        ₹{ride.rideFare}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs">
                        {bookedSeats}/{totalSeats} seats
                      </span>
                    </div>
                  </div>

                  {/* Cancel button */}
                  {/* Completed Ride Badge */}
                  {isCompleted ? (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#6B7280]">
                        Ride Completed
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCancel(ride._id)}
                      disabled={cancellingId === ride._id}
                      className="w-full bg-[#EF4444] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {cancellingId === ride._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
