import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Wallet, Users, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatRideTime } from "../utility/formatDate";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";

function RideDetails() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRide(res.data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId, token]);

  const isDriver = ride?.driver?._id === user?.id || ride?.driver?.id === user?.id;

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-5 w-24" />
        <Card className="space-y-4 p-5">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </Card>
        <Card className="space-y-3 p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon={MapPin}
          title="We couldn't load this ride"
          description="It may have been removed, or you may not have access to view it."
          action={
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Rides
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-primary dark:text-ink-dark-soft"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Ride information */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-ink-dark-soft">
              Route
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-ink dark:text-ink-dark sm:text-xl">
              {ride.from} <span className="text-ink-soft dark:text-ink-dark-soft">→</span> {ride.to}
            </h2>
          </div>
          {isDriver && <Badge tone="primary">Your ride</Badge>}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm dark:border-border-dark">
          <div className="flex items-center gap-1.5 text-ink-soft dark:text-ink-dark-soft">
            <Clock className="h-4 w-4" />
            {formatRideTime(ride.rideTime)}
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-success">
            <Wallet className="h-4 w-4" />₹{ride.rideFare}
          </div>
          <div className="flex items-center gap-1.5 text-ink-soft dark:text-ink-dark-soft">
            <Users className="h-4 w-4" />
            {ride.availableSeats} seat{ride.availableSeats === 1 ? "" : "s"} available
          </div>
        </div>
      </Card>

      {/* Driver information */}
      <Card className="mt-4 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-ink-dark-soft">
          Driver
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary dark:bg-surface-dark">
            {ride.driver?.name?.charAt(0).toUpperCase() ?? <User className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink dark:text-ink-dark">
              {ride.driver?.name ?? "Unknown"}
            </p>
            {ride.driver?.email && (
              <p className="truncate text-xs text-ink-soft dark:text-ink-dark-soft">
                {ride.driver.email}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Passengers */}
      <Card className="mt-4 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-ink-dark-soft">
          Passengers ({ride.passengers?.length ?? 0})
        </p>

        {!ride.passengers || ride.passengers.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-ink-dark-soft">
            No passengers yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {ride.passengers.map((p) => (
              <div
                key={p._id ?? p.email}
                className="flex items-center gap-3 rounded-control border border-border p-3 dark:border-border-dark"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary dark:bg-surface-dark">
                  {p.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-ink-soft dark:text-ink-dark-soft">
                    {p.email}
                    {p.phone ? ` · ${p.phone}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default RideDetails;
