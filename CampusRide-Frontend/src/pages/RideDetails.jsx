import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RideDetails() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRide = async () => {
      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setRide(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading ride details...</p>;
  }

  if (!ride) {
    return <p className="text-red-500 text-sm">Failed to load ride</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Ride Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {ride.from} → {ride.to}
          </h2>
          <span className="text-blue-600 font-medium">₹{ride.rideFare}</span>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          <p>Seats: {ride.availableSeats}</p>
          <p>Time: {ride.rideTime}</p>
        </div>
      </div>

      {/* Passengers Section */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Passengers</h3>

      {ride.passengers.length === 0 ? (
        <p className="text-gray-500 text-sm">No passengers yet.</p>
      ) : (
        <div className="space-y-3">
          {ride.passengers.map((p, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <p className="text-sm text-gray-900 font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">{p.email}</p>
              <p className="text-sm text-gray-600">{p.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RideDetails;
