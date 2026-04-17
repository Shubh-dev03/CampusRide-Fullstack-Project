// Create Ride Pafe(form)

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utility/toast";
import { useAuth } from "../context/AuthContext";

function CreateRide() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when the form is submitted
    try {

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
      // Making Changes in alert
      showSuccess("Ride created successflly");

      // Clear form fields after successful ride creation
      setFrom("");
      setTo("");
      setAvailableSeats("");
      setRideFare("");
      setRideTime("");

      navigate("/"); // Redirect to home page after successful ride creation
    } catch (error) {
      console.log("Error creating ride:", error);
      // Making changes in alert
      showError(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false); // Stop loading state after the request is completed (whether successful or failed)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Offer a Ride
        </h2>
        <p className="text-gray-600 mb-6">
          Share your ride details with others
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              placeholder="Enter destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Seats + Fare (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seats
              </label>
              <input
                type="number"
                min="1"
                placeholder="Seats"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare (₹)
              </label>
              <input
                type="number"
                placeholder="Fare"
                value={rideFare}
                onChange={(e) => setRideFare(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Ride Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ride Time
            </label>
            <input
              type="datetime-local"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition text-white font-medium py-2.5 rounded-lg"
          >
            {loading ? "Creating..." : "Create Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRide;
