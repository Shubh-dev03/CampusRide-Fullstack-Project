import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import CreateRide from "./pages/CreateRide";
import EditRide from "./pages/editRide";
import RiderHome from "./pages/riderHome";
import MyBookings from "./pages/MyBookings";
import RideDetails from "./pages/RideDetails";
// Toast
import { Toaster } from "react-hot-toast";
// Navbar
import Layout from "./components/Layout";
// Auth
import { useAuth } from "./context/AuthContext";

// Main App component with routing
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#111827",
            border: "1px solid #E5E7EB",
          },
        }}
      />

      <Routes>
        {/* PUBLIC ROUTES (no navbar) */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />

        {/* PROTECTED ROUTES (with navbar via Layout) */}

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/rider"
          element={
            isAuthenticated ? (
              <Layout>
                <RiderHome />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/my-bookings"
          element={
            isAuthenticated ? (
              <Layout>
                <MyBookings />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/ride/:rideId"
          element={
            isAuthenticated ? (
              <Layout>
                <RideDetails />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/create-ride"
          element={
            isAuthenticated ? (
              <Layout>
                <CreateRide />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/edit-ride/:id"
          element={
            isAuthenticated ? (
              <Layout>
                <EditRide />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
