import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function RideDetails() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("ride Id: ", rideId);
        setRide(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRide();
  }, [rideId]);

  if (!ride) return <p>Loading...</p>;

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Below */}

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
          {/* Create Ride button for drivers */}
          {role === "driver" && (
            <button
              onClick={() => navigate("/create-ride")}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Ride
            </button>
          )}
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
        <h2 className="text-xl font-bold mb-4">
          {ride.from} → {ride.to}
        </h2>

        <h3 className="font-semibold mb-2">Passengers:</h3>

        {ride.passengers.length === 0 ? (
          <p>No passengers yet</p>
        ) : (
          ride.passengers.map((p, index) => (
            <div key={index} className="bg-white p-3 mb-2 shadow rounded">
              <p>Name: {p.name}</p>
              <p>Email: {p.email}</p>
              <p>Phone: {p.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RideDetails;
