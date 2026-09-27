import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CarFront, Clock, Users } from "lucide-react";
import { showError, showSuccess } from "../utility/toast";
import { useAuth } from "../context/AuthContext";
import { formatRideTime } from "../utility/formatDate";
import CreateRideModal from "../components/CreateRideModal";
import VehicleDetailsModal from "../components/VehicleDetailsModel";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import ConfirmDialog from "../components/ui/ConfirmDialog";

function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const navigate = useNavigate();
  const { token, canOfferRide } = useAuth();

  const fetchMyRides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rides/myrides`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRides(res.data.data);
    } catch (error) {
      console.log(error);
      showError("Failed to fetch your rides");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  const handleDelete = (rideId) => setPendingDeleteId(rideId);

  const confirmDelete = async () => {
    const rideId = pendingDeleteId;
    try {
      setDeletingId(rideId);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rides/${rideId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRides((prev) => prev.filter((r) => r._id !== rideId));
      showSuccess("Ride deleted");
    } catch (error) {
      console.log(error);
      showError("Failed to delete ride");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const handleOfferRide = () => {
    if (canOfferRide) {
      setActiveModal("create");
    } else {
      setActiveModal("vehicle");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
            My Rides
          </h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
            Manage the rides you've created
          </p>
        </div>
        <Button onClick={handleOfferRide} className="w-full sm:w-auto">
          <span className="text-lg leading-none">+</span> Create Ride
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : rides.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title="No rides created yet"
          description="Start sharing rides with your campus community"
          action={
            <Button onClick={handleOfferRide}>Create Your First Ride</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rides.map((ride) => (
            <Card key={ride._id} className="p-5 transition hover:shadow-raised">
              {/* Route + fare */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 break-words text-base font-semibold text-ink dark:text-ink-dark">
                  {ride.from} → {ride.to}
                </h3>
                <span className="shrink-0 text-sm font-semibold text-ink dark:text-ink-dark">
                  ₹{ride.rideFare}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft dark:text-ink-dark-soft">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRideTime(ride.rideTime)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {ride.availableSeats} available
                  {ride.passengers?.length > 0 &&
                    ` · ${ride.passengers.length} booked`}
                </span>
              </div>

              {/* Status */}
              <div className="mt-3">
                {ride.availableSeats > 0 ? (
                  <Badge tone="success">● Seats available</Badge>
                ) : (
                  <Badge tone="danger">● Full</Badge>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/ride/${ride._id}`)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/edit-ride/${ride._id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deletingId === ride._id}
                  onClick={() => handleDelete(ride._id)}
                >
                  {deletingId === ride._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeModal === "vehicle" && (
        <VehicleDetailsModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal("create")}
        />
      )}
      {activeModal === "create" && (
        <CreateRideModal
          onClose={() => setActiveModal(null)}
          onCreated={fetchMyRides}
        />
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Delete this ride?"
          description="Passengers will lose their booking. This action cannot be undone."
          confirmLabel="Delete"
          loading={deletingId === pendingDeleteId}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}

export default MyRides;
