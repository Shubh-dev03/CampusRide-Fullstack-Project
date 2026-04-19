// Navabar
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Active link underline - matches screenshot
  const linkClass = (path) =>
    `text-sm font-medium pb-0.5 transition cursor-pointer ${
      location.pathname === path
        ? "text-[#2563EB] border-b-2 border-[#2563EB]"
        : "text-[#4B5563] hover:text-[#111827]"
    }`;

  // First letter of name for avatar
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 100 4 2 2 0 000-4zm-5 0a2 2 0 100 4 2 2 0 000-4z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[#111827] font-semibold text-base">
          CampusRide
        </span>
      </div>

      {/* Center nav links - same for all users */}
      <div className="flex items-center gap-7">
        <span className={linkClass("/")} onClick={() => navigate("/")}>
          Home
        </span>
        <span
          className={linkClass("/my-rides")}
          onClick={() => navigate("/my-rides")}
        >
          My Rides
        </span>
        <span
          className={linkClass("/my-bookings")}
          onClick={() => navigate("/my-bookings")}
        >
          My Bookings
        </span>
        <span
          className={linkClass("/profile")}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>
      </div>

      {/* Right: Bell + Avatar + Name */}
      <div className="flex items-center gap-3">
        {/* Bell icon */}
        <button className="text-[#9CA3AF] hover:text-[#4B5563] transition">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Avatar + name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <svg
              width="16"
              height="16"
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
          </div>
          <span className="text-sm font-medium text-[#111827]">
            {user?.name ?? "User"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-[#9CA3AF] hover:text-[#EF4444] transition ml-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
