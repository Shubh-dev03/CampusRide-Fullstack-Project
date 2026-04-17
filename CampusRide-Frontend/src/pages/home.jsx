// Home page(Driver)
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [rides, setRides] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { token, role } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        if (role !== "driver") {
          navigate("/rider");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/myrides`,
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

  const handleDelete = async (rideId) => {
    if (!window.confirm("Delete this ride?")) return;

    try {
      setDeletingId(rideId);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRides((prev) => prev.filter((ride) => ride._id !== rideId));
      showSuccess("Ride deleted");
    } catch (error) {
      console.log(error);
      showError("Failed to delete ride");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#111827]">My Rides</h2>

          <button
            onClick={() => navigate("/create-ride")}
            className="bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Create Ride
          </button>
        </div>

        {rides.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center text-[#9CA3AF]">
            No rides created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {ride.from} → {ride.to}
                  </h3>

                  <span className="text-[#111827] font-medium">
                    ₹{ride.rideFare}
                  </span>
                </div>

                <div className="mt-2 text-sm text-[#4B5563]">
                  <p>Seats: {ride.availableSeats}</p>
                  <p>Time: {ride.rideTime}</p>
                </div>

                {/* Status */}
                <div className="mt-2">
                  {ride.availableSeats > 0 ? (
                    <span className="text-[#10B981] text-sm font-medium">
                      Seats Available
                    </span>
                  ) : (
                    <span className="text-[#EF4444] text-sm font-medium">
                      Full
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => navigate(`/ride/${ride._id}`)}
                    className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit-ride/${ride._id}`)}
                    className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
                  >
                    Edit
                  </button>

                  <button
                    disabled={deletingId === ride._id}
                    onClick={() => handleDelete(ride._id)}
                    className="px-3 py-1.5 text-sm text-[#EF4444] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50"
                  >
                    {deletingId === ride._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
