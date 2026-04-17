// Edit Ride page(Form)
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";

function EditRide() {
  const { id } = useParams(); // ✅ correct
  const navigate = useNavigate();
  const { token } = useAuth();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [loading, setLoading] = useState(false);

  //  Fetch ride
  useEffect(() => {
    const fetchRide = async () => {
      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${id}`,
          //
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const ride = res.data.data;

        setFrom(ride.from);
        setTo(ride.to);
        setAvailableSeats(ride.availableSeats);
        setRideFare(ride.rideFare);
        setRideTime(ride.rideTime);
      } catch (error) {
        showError("Failed to fetch ride details", error);
      }
    };

    fetchRide();
  }, [id]);

  //  Update ride
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rides/edit/${id}`, // ⚠️ check route
        {
          from,
          to,
          availableSeats,
          rideFare,
          rideTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showSuccess("Ride updated successfully");
      navigate("/");
    } catch (error) {
      showError(error.response?.data?.message || "Update Failed");
    }
    setLoading(false);
  };

  // ✅ UI RETURN (correct place)
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]">
        <h2 className="text-2xl font-semibold text-[#111827] mb-6">
          Edit Ride
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              From
            </label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Nashik"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              To
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              Available Seats
            </label>
            <input
              type="number"
              min="1"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Fare */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              Ride Fare (₹)
            </label>
            <input
              type="number"
              value={rideFare}
              onChange={(e) => setRideFare(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1">
              Ride Time
            </label>
            <input
              type="text"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
              placeholder="e.g. 8:00 AM"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRide;
