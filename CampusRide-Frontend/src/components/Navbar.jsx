import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `text-sm font-medium transition cursor-pointer whitespace-nowrap ${
      location.pathname === path
        ? "text-[#2563EB]"
        : "text-[#4B5563] hover:text-[#111827]"
    }`;

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]">
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

          <span className="whitespace-nowrap text-base font-semibold text-[#111827]">
            CampusRide
          </span>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
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
        </nav>

        {/* Right: Notification + Profile + Logout */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center text-[#9CA3AF] transition hover:text-[#4B5563]"
          >
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

          {/* Profile */}
          <div
            className="flex cursor-pointer items-center"
            onClick={() => navigate("/profile")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7EB]">
              <span className="text-sm font-semibold text-[#4B5563]">
                {initial}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-[#9CA3AF] transition hover:text-[#EF4444]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-[#F3F4F6] md:hidden">
        <div className="overflow-x-auto px-4 py-2 sm:px-6">
          <div className="flex min-w-max items-center justify-center gap-6">
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
        </div>
      </div>
    </div>
  );
}

export default Navbar;
