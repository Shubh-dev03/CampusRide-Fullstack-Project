import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RiderHome() {
  const [ride, setRide] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (role !== "rider") {
          return <p>Access Denied</p>;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/allrides`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRide(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRides();
  }, []);

  //   Booking Handler
  const handleBooking = async (rideId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token", token);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/book/${rideId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Ride Booked!!");

      // Refresh Rides
      setRide((prev) =>
        prev.map((ride) =>
          ride._id === rideId
            ? { ...ride, availableSeats: ride.availableSeats - 1 }
            : ride,
        ),
      );
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar below */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CampusRide</h1>

        <div className="space-x-3">
          {/* Navigation bar with links to Home, Create Ride, and Logout */}

          {/* Home button */}
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Home
          </button>

          {/* My Bookings  */}
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {" "}
            My bookings{" "}
          </button>

          {/* logout button */}
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Navbar above */}
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Available Rides</h2>
        {ride.length === 0 ? (
          <p>No rides available</p>
        ) : (
          ride &&
          ride.map((ride) => (
            // Display each ride in a card format with details and action buttons
            <div
              key={ride._id}
              className="bg-white rounded-xl shadow p-5 mb-4 hover:shadow-lg transition"
            >
              {/* Ride title and fare */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {ride.from} &#8594; {ride.to}
                </h3>
                <span className="text-green-600">&#8377;{ride.rideFare}</span>
              </div>

              {/* Ride details */}
              <div className="mt-2 text-gray-600 text-sm">
                <p>Seats : {ride.availableSeats}</p>
                <p>Time : {ride.rideTime}</p>
              </div>
              {/* Booking Button */}
              <button onClick={() => handleBooking(ride._id)}>Book</button>
            </div>
          ))
        )}{" "}
      </div>
    </div>
  );
}

export default RiderHome;
