import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";

// This modal fires when user clicks "+ Create Ride" but has no vehicleDetails.
// On save, it calls PATCH /api/users/vehicle-details, updates context,
// then calls onSuccess() so the parent can open CreateRideModal.

function VehicleDetailsModal({ onClose, onSuccess }) {
  const { token, updateUser } = useAuth();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/vehicle-details`,
        { make, model, licensePlate, capacity: Number(capacity) },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      updateUser(res.data.data);
      showSuccess("Vehicle details saved!");
      onSuccess();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to save vehicle details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111827] sm:text-xl">
              Add your vehicle
            </h2>

            <p className="mt-0.5 text-sm text-[#6B7280]">
              Required to offer rides on CampusRide
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl leading-none text-[#9CA3AF] transition hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-4 mb-5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
          <p className="text-sm leading-6 text-[#1D4ED8]">
            You only need to do this once. Your vehicle details will be saved to
            your profile.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Make + Model */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                Make
              </label>

              <input
                type="text"
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                Model
              </label>

              <input
                type="text"
                placeholder="e.g. Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* License Plate + Capacity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                License Plate
              </label>

              <input
                type="text"
                placeholder="e.g. MH12 AB1234"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#374151]">
                Capacity
              </label>

              <input
                type="number"
                min="1"
                max="10"
                placeholder="Seats"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full flex-1 rounded-lg border border-[#E5E7EB] py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex-1 rounded-lg bg-[#2563EB] py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleDetailsModal;