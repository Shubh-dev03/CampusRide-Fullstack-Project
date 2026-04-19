import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";
import CreateRideModal from "../components/CreateRideModal";
import VehicleDetailsModal from "../components/VehicleDetailsModel";

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

function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const navigate = useNavigate();
  const { token, canOfferRide } = useAuth();

  const fetchMyRides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/myrides`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRides(res.data.data);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch your rides");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  const handleDelete = async (rideId) => {
    if (
      !window.confirm("Delete this ride? Passengers will lose their booking.")
    )
      return;
    try {
      setDeletingId(rideId);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRides((prev) => prev.filter((r) => r._id !== rideId));
      showSuccess("Ride deleted");
    } catch (error) {
      console.log(error);
      showError("Failed to delete ride");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOfferRide = () => {
    if (canOfferRide) {
      setActiveModal("create");
    } else {
      setActiveModal("vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">My Rides</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Manage the rides you've created
            </p>
          </div>
          <button
            onClick={handleOfferRide}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Create Ride
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 animate-pulse"
              >
                <div className="h-5 bg-[#F3F4F6] rounded w-2/3 mb-3" />
                <div className="h-4 bg-[#F3F4F6] rounded w-1/3 mb-2" />
                <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          // Empty state matching screenshot
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563EB"
                strokeWidth="1.8"
              >
                <path
                  d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-[#111827] font-semibold text-base mb-1">
              No rides created yet
            </h3>
            <p className="text-sm text-[#9CA3AF] mb-5">
              Start sharing rides with your campus community
            </p>
            <button
              onClick={handleOfferRide}
              className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              Create Your First Ride
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                {/* Route + fare */}
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-[#111827]">
                    {ride.from} → {ride.to}
                  </h3>
                  <span className="text-[#111827] font-semibold text-sm">
                    ₹{ride.rideFare}
                  </span>
                </div>

                {/* Meta */}
                <div className="mt-2 text-sm text-[#6B7280] space-y-1">
                  <p>
                    <span className="font-medium">Seats:</span>{" "}
                    {ride.availableSeats} available
                    {ride.passengers?.length > 0 && (
                      <span className="text-[#9CA3AF]">
                        {" "}
                        · {ride.passengers.length} booked
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {formatRideTime(ride.rideTime)}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-2">
                  {ride.availableSeats > 0 ? (
                    <span className="text-[#10B981] text-xs font-medium">
                      ● Seats available
                    </span>
                  ) : (
                    <span className="text-[#EF4444] text-xs font-medium">
                      ● Full
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => navigate(`/ride/${ride._id}`)}
                    className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#4B5563] hover:bg-[#F3F4F6] transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-ride/${ride._id}`)}
                    className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#4B5563] hover:bg-[#F3F4F6] transition"
                  >
                    Edit
                  </button>
                  <button
                    disabled={deletingId === ride._id}
                    onClick={() => handleDelete(ride._id)}
                    className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition disabled:opacity-50"
                  >
                    {deletingId === ride._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeModal === "vehicle" && (
        <VehicleDetailsModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal("create")}
        />
      )}
      {activeModal === "create" && (
        <CreateRideModal
          onClose={() => setActiveModal(null)}
          onCreated={fetchMyRides}
        />
      )}
    </div>
  );
}

export default MyRides;
