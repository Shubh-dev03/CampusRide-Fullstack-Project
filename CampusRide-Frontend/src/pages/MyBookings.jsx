import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const { token } = useAuth();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/mybookings`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRides(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Bookings</h2>

      {loading && <p className="text-gray-500 text-sm">Loading bookings...</p>}

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
          <button
            onClick={fetchBookings}
            className="ml-2 underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && rides.length === 0 && (
        <p className="text-gray-500 text-sm">No bookings yet.</p>
      )}

      <div className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Route + Fare */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {ride.from} → {ride.to}
              </h3>
              <span className="text-blue-600 font-medium">
                ₹{ride.rideFare}
              </span>
            </div>

            {/* Details */}
            <div className="mt-2 text-sm text-gray-600">
              <p>Driver: {ride.driver?.name ?? "Unassigned"}</p>
              <p>Time: {ride.rideTime}</p>
            </div>

            {/* Action */}
            <button
              onClick={() => handleCancel(ride._id)}
              disabled={cancellingId === ride._id}
              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingId === ride._id ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
