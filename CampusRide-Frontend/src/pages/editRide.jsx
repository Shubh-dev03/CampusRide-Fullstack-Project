import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditRide() {
  const { id } = useParams(); // ✅ correct
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [rideFare, setRideFare] = useState("");
  const [rideTime, setRideTime] = useState("");

  // ✅ Fetch ride
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${id}`,
          //
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
        console.log("Error fetching ride:", error);
      }
    };

    fetchRide();
  }, [id]);

  // ✅ Update ride
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rides/edit/${id}`, // ⚠️ check route
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

      alert("Ride updated ✅");
      navigate("/");
    } catch (error) {
      console.log("Error updating ride:", error);
    }
  };

  // ✅ UI RETURN (correct place)
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Ride</h2>

      <form onSubmit={handleUpdate} className="space-y-3">
        <label>From</label>
        <input
          value={from}
          placeholder="e.g : Nashik"
          onChange={(e) => setFrom(e.target.value)}
          className="w-full border p-2"
        />
        <label>To</label>
        <input
          placeholder="e.g : Mumbai"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full border p-2"
        />
        <label>Available Seats</label>
        <input
          placeholder="e.g : 3"
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          className="w-full border p-2"
        />
        <label>Ride Fare</label>
        <input
          placeholder="e.g : ₹100"
          value={rideFare}
          onChange={(e) => setRideFare(e.target.value)}
          className="w-full border p-2"
        />
        <label>Ride Time</label>
        <input
          placeholder="e.g : 8:00am"
          value={rideTime}
          onChange={(e) => setRideTime(e.target.value)}
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Ride
        </button>
      </form>
    </div>
  );
}

export default EditRide;
