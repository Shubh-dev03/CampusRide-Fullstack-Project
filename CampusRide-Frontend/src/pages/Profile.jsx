import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utility/toast";

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
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Profile</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage your account information
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          {/* Blue gradient header banner */}
          <div
            className="h-28"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            }}
          />

          {/* Avatar + name row */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-end -mt-12 mb-5">
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-3xl font-semibold shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                }}
              >
                {initial}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            <h2 className="text-xl font-semibold text-[#111827]">
              {user?.name}
            </h2>
            <p className="text-sm text-[#9CA3AF]">Member since {memberSince}</p>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#1E40AF]">
                    Rides Offered
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#2563EB]">
                  {statsLoading ? "—" : ridesOffered}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Total rides created
                </p>
              </div>

              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.8"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#166534]">
                    Rides Taken
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#16A34A]">
                  {statsLoading ? "—" : ridesTaken}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Total rides booked
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-[#F3F4F6] my-6" />

            {isEditing ? (
              /* ---- EDIT MODE ---- */
              <form onSubmit={handleSave} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-3 py-2.5 text-sm text-[#9CA3AF] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 (555) 000-0000"
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Vehicle Information section */}
                <div>
                  <hr className="border-[#F3F4F6] mb-5" />
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3 className="text-base font-semibold text-[#111827]">
                      Vehicle Information
                    </h3>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-4">
                    Add your vehicle details (optional, required to offer rides)
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">
                        Make
                      </label>
                      <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="e.g. Toyota"
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">
                        Model
                      </label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Camry"
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Seats"
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">
                        License Plate
                      </label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) =>
                          setLicensePlate(e.target.value.toUpperCase())
                        }
                        placeholder="e.g. MH12 AB1234"
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Save / Cancel buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#E5E7EB] text-[#374151] py-2.5 rounded-xl text-sm font-medium hover:bg-[#F9FAFB] transition"
                  >
                    <span>×</span> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              /* ---- VIEW MODE ---- */
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[#111827] mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium mb-1">
                        Full Name
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-[#111827] font-medium">
                          {user?.name ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium mb-1">
                        Email Address
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-[#111827] font-medium">
                          {user?.email ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium mb-1">
                        Phone Number
                      </p>
                      <div className="flex items-center gap-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.08 1.17 2 2 0 012.09 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm text-[#111827] font-medium">
                          {user?.phone ? `+${user.phone}` : "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle info — view mode */}
                {user?.vehicleDetails && (
                  <>
                    <hr className="border-[#F3F4F6]" />
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="1.8"
                        >
                          <path
                            d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h3 className="text-base font-semibold text-[#111827]">
                          Vehicle Information
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Make</p>
                          <p className="font-medium text-[#111827]">
                            {user.vehicleDetails.make}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Model</p>
                          <p className="font-medium text-[#111827]">
                            {user.vehicleDetails.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">
                            License Plate
                          </p>
                          <p className="font-medium text-[#111827]">
                            {user.vehicleDetails.licensePlate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Capacity</p>
                          <p className="font-medium text-[#111827]">
                            {user.vehicleDetails.capacity} seats
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!user?.vehicleDetails && (
                  <>
                    <hr className="border-[#F3F4F6]" />
                    <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4">
                      <p className="text-sm font-medium text-[#92400E]">
                        No vehicle added yet
                      </p>
                      <p className="text-xs text-[#B45309] mt-0.5">
                        Add your vehicle details to start offering rides.
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-3 text-xs font-medium text-[#D97706] underline"
                      >
                        Add vehicle →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
