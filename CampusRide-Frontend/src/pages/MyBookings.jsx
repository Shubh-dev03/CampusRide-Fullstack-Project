import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  // ✅ Memoized fetch function
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/mybookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRides(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ useEffect with stable dependency
  useEffect(() => {
    fetchBookings();
  }, []);

  // ❌ Cancel Booking
  const handleCancel = async (rideId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/cancel/${rideId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Booking cancelled");

      // 🔄 Re-fetch
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      {/* Navbar */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CampusRide</h1>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/rider")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            My bookings
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">My Bookings</h2>

        {rides.length === 0 ? (
          <p>No Bookings yet</p>
        ) : (
          rides.map((ride) => (
            <div key={ride._id} className="bg-white p-4 mb-3 shadow rounded">
              <h3>
                {ride.from} → {ride.to}
              </h3>
              <p>Fare: ₹{ride.rideFare}</p>
              <p>Driver: {ride.driver?.name}</p>

              <button
                onClick={() => handleCancel(ride._id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;
