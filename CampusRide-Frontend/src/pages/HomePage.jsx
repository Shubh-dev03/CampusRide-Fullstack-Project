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
      // Changes Below

      const activeRides = res.data.data.filter(
        (ride) => new Date(ride.rideTime) > new Date(),
      );

      setRides(activeRides);
      // Changes above
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
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827] sm:text-3xl">
              Available Rides
            </h1>

            <p className="mt-1 text-sm text-[#6B7280]">
              Find and book rides across campus
            </p>
          </div>

          <button
            onClick={handleOfferRide}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            <span className="text-lg leading-none">+</span>
            Create Ride
          </button>
        </div>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="mb-4 flex items-center gap-2">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B7280]">
                From
              </label>

              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B7280]">
                To
              </label>

              <input
                type="text"
                placeholder="Enter destination"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#6B7280]">
                Date
              </label>

              <input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Search
          </button>
        </form>

        {/* Ride cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
              >
                <div className="mb-3 h-4 w-1/2 rounded bg-[#F3F4F6]" />
                <div className="mb-4 h-5 w-3/4 rounded bg-[#F3F4F6]" />
                <div className="mb-2 h-4 w-full rounded bg-[#F3F4F6]" />
                <div className="mt-4 h-10 rounded-xl bg-[#F3F4F6]" />
              </div>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-10 text-center text-[#9CA3AF] sm:p-12">
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

            <p className="mt-1 text-sm">
              Try a different search or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {rides.map((ride) => {
              const isOwnRide =
                ride.driver?._id === user?.id || ride.driver?.id === user?.id;

              const totalSeats =
                ride.availableSeats + (ride.passengers?.length ?? 0);
              const bookedSeats = ride.passengers?.length ?? 0;

              return (
                <div
                  key={ride._id}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Driver row + badge */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
                        Driver
                      </p>

                      <p className="mt-0.5 truncate text-base font-semibold leading-tight text-[#111827]">
                        {ride.driver?.name ?? "Unknown"}
                      </p>
                    </div>

                    {isOwnRide && (
                      <span className="whitespace-nowrap rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#2563EB]">
                        Your ride
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="mb-5 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#9CA3AF]">From</p>

                      <p className="break-words text-sm font-semibold text-[#111827]">
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

                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-xs text-[#9CA3AF]">To</p>

                      <p className="break-words text-sm font-semibold text-[#111827]">
                        {ride.to}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col gap-2 border-t border-[#F3F4F6] pt-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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

                  {!isOwnRide && ride.availableSeats > 0 && (
                    <button
                      disabled={bookingId === ride._id}
                      onClick={() => handleBooking(ride._id)}
                      className="mt-5 w-full rounded-xl bg-[#16A34A] py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
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
