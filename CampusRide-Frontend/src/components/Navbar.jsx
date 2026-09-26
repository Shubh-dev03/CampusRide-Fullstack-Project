// Navbar
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const linkClass = (path) =>
    `text-sm font-medium transition cursor-pointer whitespace-nowrap ${
      location.pathname === path
        ? "text-[#3D8F86]"
        : "text-[#1E2A28]/70 hover:text-[#3D8F86]"
    }`;

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="sticky top-0 z-50 border-b border-[#DCE6E4] bg-white shadow-sm">
      <div className="px-4 py-3 sm:px-6">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleNavigation("/")}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, #179eff 0%, #5b92ff 100%)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 100 4 2 2 0 000-4zm-5 0a2 2 0 100 4 2 2 0 000-4z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="text-base font-semibold text-[#1E2A28]">
              CampusRide
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <span
              className={linkClass("/")}
              onClick={() => handleNavigation("/")}
            >
              Home
            </span>

            <span
              className={linkClass("/my-rides")}
              onClick={() => handleNavigation("/my-rides")}
            >
              My Rides
            </span>

            <span
              className={linkClass("/my-bookings")}
              onClick={() => handleNavigation("/my-bookings")}
            >
              My Bookings
            </span>

            <span
              className={linkClass("/profile")}
              onClick={() => handleNavigation("/profile")}
            >
              Profile
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification */}
            <button className="hidden text-[#1E2A28]/40 transition hover:text-[#3D8F86] sm:block">
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
              className="flex cursor-pointer items-center gap-2"
              onClick={() => handleNavigation("/profile")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DCE6E4]">
                <span className="text-sm font-semibold text-[#2F6F68]">
                  {initial}
                </span>
              </div>

              <span className="hidden text-sm font-medium text-[#1E2A28] sm:block">
                {user?.name}
              </span>
            </div>

            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="ml-1 hidden text-sm text-[#1E2A28]/50 transition hover:text-[#C15C4C] sm:block"
            >
              Logout
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1E2A28] transition hover:bg-[#F7F9F8] md:hidden"
            >
              {isMenuOpen ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-3 border-t border-[#DCE6E4] pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleNavigation("/")}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  location.pathname === "/"
                    ? "bg-[#E8F3F1] text-[#3D8F86]"
                    : "text-[#1E2A28]/70 hover:bg-[#F7F9F8] hover:text-[#3D8F86]"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavigation("/my-rides")}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  location.pathname === "/my-rides"
                    ? "bg-[#E8F3F1] text-[#3D8F86]"
                    : "text-[#1E2A28]/70 hover:bg-[#F7F9F8] hover:text-[#3D8F86]"
                }`}
              >
                My Rides
              </button>

              <button
                onClick={() => handleNavigation("/my-bookings")}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  location.pathname === "/my-bookings"
                    ? "bg-[#E8F3F1] text-[#3D8F86]"
                    : "text-[#1E2A28]/70 hover:bg-[#F7F9F8] hover:text-[#3D8F86]"
                }`}
              >
                My Bookings
              </button>

              <button
                onClick={() => handleNavigation("/profile")}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  location.pathname === "/profile"
                    ? "bg-[#E8F3F1] text-[#3D8F86]"
                    : "text-[#1E2A28]/70 hover:bg-[#F7F9F8] hover:text-[#3D8F86]"
                }`}
              >
                Profile
              </button>

              <div className="my-1 border-t border-[#DCE6E4]" />

              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#C15C4C] transition hover:bg-[#FFF4F1]"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;