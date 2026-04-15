import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  // State to hold the user's rides
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  //   Fetch the user's rides when the component mounts
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (role !== "driver") {
          return <p>Access Denied</p>;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/myrides`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRides(res.data.data);
        // console.log("Fetched rides:", res.data);
      } catch (error) {
        console.log("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);

  //Delete ride function
  const handleDelete = async (rideId) => {
    try {
      const token = localStorage.getItem("token");

      // Confirm before deleting the ride
      if (!window.confirm("Are you sure you want to delete this ride?")) {
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Remove the deleted ride from the state to update the UI
      setRides(rides.filter((ride) => ride._id !== rideId));
      alert("Ride deleted successfully.");
    } catch (error) {
      console.log("Error deleting ride:", error);
      alert("Failed to delete ride. Please try again.");
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Main Page
  return (
    <div className="min-h-screen bg-gray-100">
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
      {/* Main content */}
      <div className="max-w-2xl mx-auto p-4">
        {" "}
        <h2 className="text-2xl font-bold mb-4">My Rides</h2>
        {rides.length === 0 ? (
          <p className="text-gray-500">You have not created any rides yet.</p>
        ) : (
          <div>
            {rides &&
              rides.map((ride) => (
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
                    <span className="text-green-600">
                      &#8377;{ride.rideFare}
                    </span>
                  </div>

                  {/* Ride details */}
                  <div className="mt-2 text-gray-600 text-sm">
                    <p>Seats : {ride.availableSeats}</p>
                    <p>Time : {ride.rideTime}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/ride/${ride._id}`)}
                    className="mt-2 px-3 py-1 bg-purple-500 text-white rounded"
                  >
                    View passengers
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(ride._id)}
                    className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete{" "}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => navigate(`/edit-ride/${ride._id}`)}
                    className="z-15 relative mt-2 mr-2  px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </div>
              ))}
          </div>
        )}
        {/* create ride button */}
        {role === "driver" && (
          <button
            onClick={() => navigate("/create-ride")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            &#x002B; Create Ride
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
