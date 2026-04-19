import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";

// Modal version of CreateRide — matches the screenshot design exactly.
// onClose: dismiss modal
// onCreated: callback so HomePage can refresh the rides list

function CreateRideModal({ onClose, onCreated }) {
  const { token } = useAuth();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/create`,
        {
          from,
          to,
          rideTime,
          rideFare: Number(rideFare),
          availableSeats: Number(availableSeats),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showSuccess("Ride created successfully!");
      onCreated(); // trigger parent to refetch rides
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-[#111827]">
            Create New Ride
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] transition text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              From
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Pickup location"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              To
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* Ride Time */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Ride Time
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <input
                type="datetime-local"
                value={rideTime}
                onChange={(e) => setRideTime(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* Fare */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Fare (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={rideFare}
                onChange={(e) => setRideFare(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Available Seats
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Number of seats"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E5E7EB] text-[#374151] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRideModal;
