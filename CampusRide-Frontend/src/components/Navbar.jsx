import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // Home page logic starts

  const handleHomeClick = () => {
    if (role === "rider") {
      navigate("/rider");
    } else if (role === "driver") {
      navigate("/");
    }
  };
  // Home page logic ends

  return (
    <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex justify-between items-center">
      <h1
        className="text-lg font-semibold text-[#111827] cursor-pointer"
        onClick={handleHomeClick}
      >
        CampusRide
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={handleHomeClick}
          className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
        >
          Home
        </button>

        {role === "rider" && (
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition"
          >
            My Bookings
          </button>
        )}
        {role === "driver" && (
          <button
            onClick={() => navigate("/create-ride")}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition"
          >
            Create Ride
          </button>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
