import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import CreateRide from "./pages/CreateRide";
import EditRide from "./pages/editRide";
import RiderHome from "./pages/riderHome";
import MyBookings from "./pages/MyBookings";
import RideDetails from "./pages/RideDetails";

// Main App component with routing
function App() {
  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* {/* If user is authenticated, show Home page, otherwise show Login page */}
        <Route path="/" element={isAuthenticated() ? <Home /> : <Login />} />
        {/* Route for login page, redirect to Home if already authenticated */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Home /> : <Login />}
        />
        <Route path="/rider" element={<RiderHome />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/ride/:rideId" element={<RideDetails />} />

        <Route
          path="/signup"
          element={isAuthenticated() ? <Home /> : <Signup />}
        />
        <Route
          path="/create-ride"
          element={isAuthenticated() ? <CreateRide /> : <Login />}
        />
        <Route
          path="/edit-ride/:id"
          element={isAuthenticated() ? <EditRide /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
