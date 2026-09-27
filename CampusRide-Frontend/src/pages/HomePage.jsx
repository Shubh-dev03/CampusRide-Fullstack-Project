import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Search, ArrowRight, Clock, Wallet, Users, CarFront } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../utility/toast";
import { formatRideTime } from "../utility/formatDate";
import CreateRideModal from "../components/CreateRideModal";
import VehicleDetailsModal from "../components/VehicleDetailsModel";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { RideCardSkeleton } from "../components/ui/Skeleton";

function HomePage() {
  const { token, user, canOfferRide } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  // Search state — prefilled from ?from=&to= if the visitor searched on the
  // landing page before signing in (see LandingPage.jsx + login.jsx)
  const [fromSearch, setFromSearch] = useState(searchParams.get("from") || "");
  const [toSearch, setToSearch] = useState(searchParams.get("to") || "");
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

      const activeRides = res.data.data.filter(
        (ride) => new Date(ride.rideTime) > new Date(),
      );

      setRides(activeRides);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  }, [fromSearch, toSearch, dateSearch]);

  useEffect(() => {
    fetchRides();
    // Clean the handed-off ?from=&to= out of the URL once it's been read into state
    if (searchParams.get("from") || searchParams.get("to")) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="mx-auto w-full max-w-6xl">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
            Available Rides
          </h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
            Find and book rides across campus
          </p>
        </div>

        <Button onClick={handleOfferRide} className="w-full sm:w-auto">
          <span className="text-lg leading-none">+</span>
          Create Ride
        </Button>
      </div>

      {/* Search Card */}
      <Card className="mb-6 p-4 sm:p-5">
        <form onSubmit={handleSearch}>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-[18px] w-[18px] text-ink-soft dark:text-ink-dark-soft" />
            <span className="font-semibold text-ink dark:text-ink-dark">
              Search Rides
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                From
              </label>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/25 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                To
              </label>
              <input
                type="text"
                placeholder="Enter destination"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/25 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                Date
              </label>
              <input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm text-ink-soft outline-none focus:ring-2 focus:ring-primary/25 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark-soft"
              />
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full sm:w-auto">
            Search
          </Button>
        </form>
      </Card>

      {/* Ride cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <RideCardSkeleton key={i} />
          ))}
        </div>
      ) : rides.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title="No rides available right now"
          description="Try a different search or check back later"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rides.map((ride) => {
            const isOwnRide =
              ride.driver?._id === user?.id || ride.driver?.id === user?.id;

            const totalSeats =
              ride.availableSeats + (ride.passengers?.length ?? 0);
            const bookedSeats = ride.passengers?.length ?? 0;

            return (
              <Card
                key={ride._id}
                className="p-5 transition hover:shadow-raised"
              >
                {/* Driver row + badge */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-ink-dark-soft">
                      Driver
                    </p>
                    <p className="mt-0.5 truncate text-base font-semibold leading-tight text-ink dark:text-ink-dark">
                      {ride.driver?.name ?? "Unknown"}
                    </p>
                  </div>

                  {isOwnRide && <Badge tone="primary">Your ride</Badge>}
                </div>

                {/* Route */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-soft dark:text-ink-dark-soft">From</p>
                    <p className="break-words text-sm font-semibold text-ink dark:text-ink-dark">
                      {ride.from}
                    </p>
                  </div>

                  <ArrowRight className="mt-4 h-[18px] w-[18px] shrink-0 text-primary" />

                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-xs text-ink-soft dark:text-ink-dark-soft">To</p>
                    <p className="break-words text-sm font-semibold text-ink dark:text-ink-dark">
                      {ride.to}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm dark:border-border-dark sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <div className="flex items-center gap-1 text-ink-soft dark:text-ink-dark-soft">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{formatRideTime(ride.rideTime)}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-success">
                    <Wallet className="h-3.5 w-3.5" />
                    <span className="text-xs">₹{ride.rideFare}</span>
                  </div>

                  <div className="flex items-center gap-1 text-ink-soft dark:text-ink-dark-soft">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs">
                      {bookedSeats}/{totalSeats} seats
                    </span>
                  </div>
                </div>

                {!isOwnRide && ride.availableSeats > 0 && (
                  <Button
                    fullWidth
                    className="mt-5"
                    loading={bookingId === ride._id}
                    onClick={() => handleBooking(ride._id)}
                  >
                    {bookingId === ride._id ? "Booking..." : "Book Ride"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

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
