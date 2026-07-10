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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827] sm:text-xl">
            Create New Ride
          </h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Ride Time */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Fare */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Available Seats */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#374151]">
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
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex-1 rounded-xl bg-[#2563EB] py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
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
