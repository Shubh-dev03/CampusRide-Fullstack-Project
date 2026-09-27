import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";
import Modal from "./ui/Modal";
import FormField from "./ui/FormField";
import Button from "./ui/Button";

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
    <Modal
      title="Add your vehicle"
      subtitle="Required to offer rides on CampusRide"
      onClose={onClose}
    >
      <div className="mb-5 rounded-control border border-primary/25 bg-primary-light px-4 py-3 dark:border-primary/30 dark:bg-surface-dark">
        <p className="text-sm leading-6 text-primary-hover dark:text-primary">
          You only need to do this once. Your vehicle details will be saved to
          your profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Make"
            inputProps={{
              type: "text",
              placeholder: "e.g. Toyota",
              value: make,
              onChange: (e) => setMake(e.target.value),
              required: true,
            }}
          />

          <FormField
            label="Model"
            inputProps={{
              type: "text",
              placeholder: "e.g. Camry",
              value: model,
              onChange: (e) => setModel(e.target.value),
              required: true,
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="License Plate"
            inputProps={{
              type: "text",
              placeholder: "e.g. MH12 AB1234",
              value: licensePlate,
              onChange: (e) => setLicensePlate(e.target.value.toUpperCase()),
              required: true,
              className: "uppercase",
            }}
          />

          <FormField
            label="Capacity"
            inputProps={{
              type: "number",
              min: 1,
              max: 10,
              placeholder: "Seats",
              value: capacity,
              onChange: (e) => setCapacity(e.target.value),
              required: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default VehicleDetailsModal;
