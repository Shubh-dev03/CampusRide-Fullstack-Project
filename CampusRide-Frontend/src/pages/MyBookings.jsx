import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ArrowRight, Clock, Wallet, Users } from "lucide-react";
import { formatRideTime } from "../utility/formatDate";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import ConfirmDialog from "../components/ui/ConfirmDialog";

function MyBookings() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [pendingCancelId, setPendingCancelId] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/mybookings`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRides(res.data.data);
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = (rideId) => setPendingCancelId(rideId);

  const confirmCancel = async () => {
    const rideId = pendingCancelId;
    try {
      setCancellingId(rideId);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rides/cancel/${rideId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRides((prev) => prev.filter((ride) => ride._id !== rideId));
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancellingId(null);
      setPendingCancelId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
          View and manage your ride bookings
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      ) : rides.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Browse available rides and book your first trip"
          action={<Button onClick={() => navigate("/")}>Browse Rides</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rides.map((ride) => {
            const totalSeats =
              ride.availableSeats + (ride.passengers?.length ?? 0);
            const bookedSeats = ride.passengers?.length ?? 0;
            const isCompleted = new Date(ride.rideTime) < new Date();

            return (
              <Card key={ride._id} className="p-5 transition hover:shadow-raised">
                {/* Driver */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-ink-dark-soft">
                      Driver
                    </p>
                    <p className="mt-0.5 truncate text-base font-semibold leading-tight text-ink dark:text-ink-dark">
                      {ride.driver?.name ?? "Unknown"}
                    </p>
                  </div>

                  {isCompleted && <Badge>Completed</Badge>}
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

                {/* Meta row */}
                <div className="mb-4 flex flex-col gap-2 border-t border-border pt-3 text-sm dark:border-border-dark sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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

                {isCompleted ? (
                  <div className="text-center">
                    <Badge>Ride Completed</Badge>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    fullWidth
                    loading={cancellingId === ride._id}
                    onClick={() => handleCancel(ride._id)}
                  >
                    {cancellingId === ride._id ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {pendingCancelId && (
        <ConfirmDialog
          title="Cancel this booking?"
          description="You'll lose your seat on this ride. This action cannot be undone."
          confirmLabel="Cancel Booking"
          cancelLabel="Keep Booking"
          loading={cancellingId === pendingCancelId}
          onConfirm={confirmCancel}
          onCancel={() => setPendingCancelId(null)}
        />
      )}
    </div>
  );
}

export default MyBookings;
