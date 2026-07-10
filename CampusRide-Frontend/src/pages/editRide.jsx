// Edit Ride page(Form)
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";

function EditRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${id}`,
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rides/edit/${id}`,
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-[#111827] sm:text-left">
          Edit Ride
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* From */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4B5563]">
              From
            </label>

            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Nashik"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* To */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4B5563]">
              To
            </label>

            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4B5563]">
              Available Seats
            </label>

            <input
              type="number"
              min="1"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Fare */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4B5563]">
              Ride Fare (₹)
            </label>

            <input
              type="number"
              value={rideFare}
              onChange={(e) => setRideFare(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Time */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4B5563]">
              Ride Time
            </label>

            <input
              type="datetime-local"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2563EB] py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRide;
