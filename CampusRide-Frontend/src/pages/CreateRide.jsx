import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRide() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/create`,
        {
          from,
          to,
          rideFare,
          availableSeats,
          rideTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Ride created successfully!");

      // Clear form fields after successful ride creation
      setFrom("");
      setTo("");
      setAvailableSeats("");
      setRideFare("");
      setRideTime("");

      navigate("/"); // Redirect to home page after successful ride creation
    } catch (error) {
      console.log("Error creating ride:", error);
      alert("Failed to create ride. Please try again.");
    }
    setLoading(false); // Stop loading state after the request is completed (whether successful or failed)
  };

  return (
    <div>
      <h2>Post your Ride</h2>
      <form onSubmit={handleSubmit}>
        <label>From</label>
        <input
          type="text"
          placeholder="From"
          onChange={(e) => setFrom(e.target.value)}
        />
        <label>To</label>
        <input
          type="text"
          placeholder="To"
          onChange={(e) => setTo(e.target.value)}
        />
        <label>Available Seats</label>
        <input
          type="number"
          min="1"
          placeholder="Available Seats"
          onChange={(e) => setAvailableSeats(e.target.value)}
        />
        <label>Ride Fare</label>
        <input
          type="number"
          placeholder="Ride Fare"
          onChange={(e) => setRideFare(e.target.value)}
        />
        <label>Ride Time</label>
        <input
          placeholder="Ride Time"
          onChange={(e) => setRideTime(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Ride"}
        </button>
      </form>
    </div>
  );
}

export default CreateRide;
