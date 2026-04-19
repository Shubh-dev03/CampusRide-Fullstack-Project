import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../utility/toast";
import CreateRideModal from "../components/CreateRideModal";
import VehicleDetailsModal from "../components/VehicleDetailsModel";

// Formats "2024-04-18T09:00" → "Apr 18, 09:00"
const formatRideTime = (rideTime) => {
  if (!rideTime) return "";
  const date = new Date(rideTime);
  if (isNaN(date)) return rideTime;
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
};

const isPast = (rideTime) => new Date(rideTime) < new Date();

function HomePage() {
  const { token, user, canOfferRide } = useAuth();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  // Search state
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  // Modal state
  // "vehicle" → show vehicle details gate first
  // "create"  → show create ride form
  // null      → no modal
  const [activeModal, setActiveModal] = useState(null);

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fromSearch.trim()) params.append("from", fromSearch.trim());
      if (toSearch.trim()) params.append("to", toSearch.trim());
      if (dateSearch) params.append("rideTime", dateSearch);

      const hasSearch = fromSearch || toSearch || dateSearch;
      const url = hasSearch
        ? `${import.meta.env.VITE_API_URL}/api/rides/search?${params}`
        : `${import.meta.env.VITE_API_URL}/api/rides`;

      const res = await axios.get(url);
      setRides(res.data.data);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  }, [fromSearch, toSearch, dateSearch]);

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides();
  };

  const handleBooking = async (rideId) => {
    if (!token) return;
    try {
      setBookingId(rideId);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/book/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showSuccess("Ride booked successfully!");
      // Optimistically update seats
      setRides((prev) =>
        prev.map((r) =>
          r._id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r,
        ),
      );
    } catch (error) {
      showError(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  // Smart gate: if no vehicle → show vehicle modal, else → create ride modal
  const handleOfferRide = () => {
    if (canOfferRide) {
      setActiveModal("create");
    } else {
      setActiveModal("vehicle");
    }
  };

  // Called when vehicle details saved successfully → proceed to create ride
  const handleVehicleSaved = () => {
    setActiveModal("create");
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">
              Available Rides
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Find and book rides across campus
            </p>
          </div>
          <button
            onClick={handleOfferRide}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <span className="text-lg leading-none">+</span> Create Ride
          </button>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-[#111827]">Search Rides</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">
                From
              </label>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">
                To
              </label>
              <input
                type="text"
                placeholder="Enter destination"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">
                Date
              </label>
              <input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#6B7280]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#2563EB] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Ride cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 animate-pulse"
              >
                <div className="h-4 bg-[#F3F4F6] rounded w-1/2 mb-3" />
                <div className="h-5 bg-[#F3F4F6] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#F3F4F6] rounded w-full mb-2" />
                <div className="h-10 bg-[#F3F4F6] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <svg
              className="mx-auto mb-3"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            >
              <path
                d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-medium text-[#6B7280]">
              No rides available right now
            </p>
            <p className="text-sm mt-1">
              Try a different search or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rides.map((ride) => {
              const isOwnRide =
                ride.driver?._id === user?.id || ride.driver?.id === user?.id;
              const completed = isPast(ride.rideTime);
              const totalSeats =
                ride.availableSeats + (ride.passengers?.length ?? 0);
              const bookedSeats = ride.passengers?.length ?? 0;

              return (
                <div
                  key={ride._id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {/* Driver row + badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide">
                        Driver
                      </p>
                      <p className="text-[#111827] font-semibold text-base leading-tight mt-0.5">
                        {ride.driver?.name ?? "Unknown"}
                      </p>
                    </div>
                    {completed && (
                      <span className="text-xs bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full font-medium">
                        Completed
                      </span>
                    )}
                    {isOwnRide && !completed && (
                      <span className="text-xs bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded-full font-medium">
                        Your ride
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-3 mb-4">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">From</p>
                      <p className="text-[#111827] font-semibold text-sm">
                        {ride.from}
                      </p>
                    </div>
                    <svg
                      className="mt-4 flex-shrink-0"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p className="text-xs text-[#9CA3AF]">To</p>
                      <p className="text-[#111827] font-semibold text-sm">
                        {ride.to}
                      </p>
                    </div>
                  </div>

                  {/* Meta row: time, fare, seats */}
                  <div className="flex items-center gap-4 text-sm border-t border-[#F3F4F6] pt-3">
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-xs">
                        {formatRideTime(ride.rideTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#10B981]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      <span className="text-xs font-semibold">
                        ₹{ride.rideFare}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs">
                        {bookedSeats}/{totalSeats} seats
                      </span>
                    </div>
                  </div>

                  {/* Book Ride button — hidden for own rides or completed rides */}
                  {!isOwnRide && !completed && ride.availableSeats > 0 && (
                    <button
                      disabled={bookingId === ride._id}
                      onClick={() => handleBooking(ride._id)}
                      className="mt-4 w-full bg-[#16A34A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {bookingId === ride._id ? "Booking..." : "Book Ride"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === "vehicle" && (
        <VehicleDetailsModal
          onClose={closeModal}
          onSuccess={handleVehicleSaved}
        />
      )}
      {activeModal === "create" && (
        <CreateRideModal onClose={closeModal} onCreated={fetchRides} />
      )}
    </div>
  );
}

export default HomePage;
