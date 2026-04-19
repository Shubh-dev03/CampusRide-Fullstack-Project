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

      // Update AuthContext so canOfferRide becomes true immediately
      updateUser(res.data.data);
      showSuccess("Vehicle details saved!");

      // Tell parent: vehicle is set, now open CreateRideModal
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">
              Add your vehicle
            </h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Required to offer rides on CampusRide
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] transition text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-4 py-3 mb-5 mt-4">
          <p className="text-sm text-[#1D4ED8]">
            You only need to do this once. Your vehicle details will be saved to
            your profile.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Make + Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Make
              </label>
              <input
                type="text"
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                Model
              </label>
              <input
                type="text"
                placeholder="e.g. Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* License Plate + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
                License Plate
              </label>
              <input
                type="text"
                placeholder="e.g. MH12 AB1234"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                required
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">
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
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E5E7EB] text-[#374151] py-2.5 rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
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
