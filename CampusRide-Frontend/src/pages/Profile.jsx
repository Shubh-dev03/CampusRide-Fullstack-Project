import { useState, useEffect } from "react";
import axios from "axios";
import {
  CarFront,
  Ticket,
  Pencil,
  X,
  Save,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";

function Profile() {
  const { token, user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [ridesOffered, setRidesOffered] = useState(0);
  const [ridesTaken, setRidesTaken] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  // Edit form state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [make, setMake] = useState(user?.vehicleDetails?.make ?? "");
  const [model, setModel] = useState(user?.vehicleDetails?.model ?? "");
  const [licensePlate, setLicensePlate] = useState(
    user?.vehicleDetails?.licensePlate ?? "",
  );
  const [capacity, setCapacity] = useState(
    user?.vehicleDetails?.capacity ?? "",
  );
  const [saving, setSaving] = useState(false);

  // Fetch ride stats for the profile cards
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [offeredRes, takenRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/rides/myrides`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/rides/mybookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRidesOffered(offeredRes.data.data.length);
        setRidesTaken(takenRes.data.data.length);
      } catch {
        // stats are non-critical, fail silently
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // Member since — from user createdAt or just the current month
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "April 2026";

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update vehicle details if provided
      if (make || model || licensePlate || capacity) {
        const res = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/users/vehicle-details`,
          { make, model, licensePlate, capacity: Number(capacity) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        updateUser(res.data.data);
      }
      showSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to current values
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setMake(user?.vehicleDetails?.make ?? "");
    setModel(user?.vehicleDetails?.model ?? "");
    setLicensePlate(user?.vehicleDetails?.licensePlate ?? "");
    setCapacity(user?.vehicleDetails?.capacity ?? "");
    setIsEditing(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page title */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl font-semibold text-ink dark:text-ink-dark sm:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
          Manage your account information
        </p>
      </div>

      <Card className="overflow-hidden">
        {/* Gradient header banner */}
        <div
          className="h-28"
          style={{ background: "linear-gradient(135deg, #3D8F86 0%, #2F6F68 100%)" }}
        />

        {/* Avatar + name row */}
        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-10 mb-5 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-semibold text-white shadow-raised sm:h-20 sm:w-20 sm:text-3xl"
              style={{ background: "linear-gradient(135deg, #3D8F86 0%, #2F6F68 100%)" }}
            >
              {initial}
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            )}
          </div>

          <h2 className="text-xl font-semibold text-ink dark:text-ink-dark sm:text-2xl">
            {user?.name}
          </h2>
          <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
            Member since {memberSince}
          </p>

          {/* Stats cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-primary/20 bg-primary-light p-5 dark:border-primary/25 dark:bg-surface-dark">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <CarFront className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-primary-hover dark:text-primary">
                  Rides Offered
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {statsLoading ? "—" : ridesOffered}
              </p>
              <p className="mt-1 text-xs text-ink-soft dark:text-ink-dark-soft">
                Total rides created
              </p>
            </div>

            <div className="rounded-card border border-success/25 bg-[#EAF5EC] p-5 dark:border-success/25 dark:bg-surface-dark">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
                  <Ticket className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[#3F6B48] dark:text-success">
                  Rides Taken
                </span>
              </div>
              <p className="text-3xl font-bold text-success">
                {statsLoading ? "—" : ridesTaken}
              </p>
              <p className="mt-1 text-xs text-ink-soft dark:text-ink-dark-soft">
                Total rides booked
              </p>
            </div>
          </div>

          <hr className="my-6 border-border dark:border-border-dark" />

          {isEditing ? (
            /* ---- EDIT MODE ---- */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Full Name"
                  inputProps={{
                    type: "text",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                  }}
                />
                <FormField
                  label="Email Address"
                  inputProps={{
                    type: "email",
                    value: user?.email ?? "",
                    disabled: true,
                    className: "cursor-not-allowed opacity-70",
                  }}
                />
              </div>

              <FormField
                label="Phone Number"
                inputProps={{
                  type: "tel",
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  placeholder: "+91 (555) 000-0000",
                }}
              />

              <div>
                <hr className="mb-5 border-border dark:border-border-dark" />
                <div className="mb-1 flex items-center gap-2">
                  <CarFront className="h-[18px] w-[18px] text-primary" />
                  <h3 className="text-base font-semibold text-ink dark:text-ink-dark">
                    Vehicle Information
                  </h3>
                </div>
                <p className="mb-4 text-xs text-ink-soft dark:text-ink-dark-soft">
                  Add your vehicle details (optional, required to offer rides)
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    label="Make"
                    inputProps={{
                      type: "text",
                      value: make,
                      onChange: (e) => setMake(e.target.value),
                      placeholder: "e.g. Toyota",
                    }}
                  />
                  <FormField
                    label="Model"
                    inputProps={{
                      type: "text",
                      value: model,
                      onChange: (e) => setModel(e.target.value),
                      placeholder: "e.g. Camry",
                    }}
                  />
                  <FormField
                    label="Capacity"
                    inputProps={{
                      type: "number",
                      min: 1,
                      max: 10,
                      value: capacity,
                      onChange: (e) => setCapacity(e.target.value),
                      placeholder: "Seats",
                    }}
                  />
                  <FormField
                    label="License Plate"
                    inputProps={{
                      type: "text",
                      value: licensePlate,
                      onChange: (e) => setLicensePlate(e.target.value.toUpperCase()),
                      placeholder: "e.g. MH12 AB1234",
                      className: "uppercase",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleCancelEdit}
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button type="submit" fullWidth loading={saving}>
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            /* ---- VIEW MODE ---- */
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-base font-semibold text-ink dark:text-ink-dark">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                      Full Name
                    </p>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-ink-soft dark:text-ink-dark-soft" />
                      <span className="text-sm font-medium text-ink dark:text-ink-dark">
                        {user?.name ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                      Email Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-ink-soft dark:text-ink-dark-soft" />
                      <span className="text-sm font-medium text-ink dark:text-ink-dark">
                        {user?.email ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-ink-soft dark:text-ink-dark-soft">
                      Phone Number
                    </p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-ink-soft dark:text-ink-dark-soft" />
                      <span className="text-sm font-medium text-ink dark:text-ink-dark">
                        {user?.phone ? `+${user.phone}` : "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle info — view mode */}
              {user?.vehicleDetails && (
                <>
                  <hr className="border-border dark:border-border-dark" />
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <CarFront className="h-4 w-4 text-primary" />
                      <h3 className="text-base font-semibold text-ink dark:text-ink-dark">
                        Vehicle Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-ink-soft dark:text-ink-dark-soft">Make</p>
                        <p className="font-medium text-ink dark:text-ink-dark">
                          {user.vehicleDetails.make}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft dark:text-ink-dark-soft">Model</p>
                        <p className="font-medium text-ink dark:text-ink-dark">
                          {user.vehicleDetails.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft dark:text-ink-dark-soft">
                          License Plate
                        </p>
                        <p className="font-medium text-ink dark:text-ink-dark">
                          {user.vehicleDetails.licensePlate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-soft dark:text-ink-dark-soft">Capacity</p>
                        <p className="font-medium text-ink dark:text-ink-dark">
                          {user.vehicleDetails.capacity} seats
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!user?.vehicleDetails && (
                <>
                  <hr className="border-border dark:border-border-dark" />
                  <div className="rounded-card border border-cta/30 bg-cta/10 p-5">
                    <p className="text-sm font-medium text-cta-hover">
                      No vehicle added yet
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft dark:text-ink-dark-soft">
                      Add your vehicle details to start offering rides.
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 inline-flex items-center text-sm font-medium text-cta transition hover:text-cta-hover"
                    >
                      Add vehicle →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Profile;
