import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";
import Modal from "./ui/Modal";
import FormField from "./ui/FormField";
import Button from "./ui/Button";

// Modal version of CreateRide.
// onClose: dismiss modal
// onCreated: callback so HomePage/MyRides can refresh the rides list

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
    <Modal title="Create New Ride" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="From"
          inputProps={{
            type: "text",
            placeholder: "Pickup location",
            value: from,
            onChange: (e) => setFrom(e.target.value),
            required: true,
          }}
        />

        <FormField
          label="To"
          inputProps={{
            type: "text",
            placeholder: "Destination",
            value: to,
            onChange: (e) => setTo(e.target.value),
            required: true,
          }}
        />

        <FormField
          label="Ride Time"
          inputProps={{
            type: "datetime-local",
            value: rideTime,
            onChange: (e) => setRideTime(e.target.value),
            required: true,
          }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Fare (₹)"
            inputProps={{
              type: "number",
              min: 0,
              step: "0.01",
              placeholder: "0.00",
              value: rideFare,
              onChange: (e) => setRideFare(e.target.value),
              required: true,
            }}
          />

          <FormField
            label="Available Seats"
            inputProps={{
              type: "number",
              min: 1,
              max: 10,
              placeholder: "Seats",
              value: availableSeats,
              onChange: (e) => setAvailableSeats(e.target.value),
              required: true,
            }}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Creating..." : "Create Ride"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateRideModal;
