// Edit Ride page (Form)
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

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
    <div className="mx-auto flex w-full max-w-xl justify-center">
      <Card className="w-full p-5 sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-ink dark:text-ink-dark sm:text-left">
          Edit Ride
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <FormField
            label="From"
            inputProps={{
              value: from,
              onChange: (e) => setFrom(e.target.value),
              placeholder: "e.g. Nashik",
            }}
          />

          <FormField
            label="To"
            inputProps={{
              value: to,
              onChange: (e) => setTo(e.target.value),
              placeholder: "e.g. Mumbai",
            }}
          />

          <FormField
            label="Available Seats"
            inputProps={{
              type: "number",
              min: 1,
              value: availableSeats,
              onChange: (e) => setAvailableSeats(e.target.value),
            }}
          />

          <FormField
            label="Ride Fare (₹)"
            inputProps={{
              type: "number",
              value: rideFare,
              onChange: (e) => setRideFare(e.target.value),
            }}
          />

          <FormField
            label="Ride Time"
            inputProps={{
              type: "datetime-local",
              value: rideTime,
              onChange: (e) => setRideTime(e.target.value),
            }}
          />

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Updating..." : "Update Ride"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default EditRide;
