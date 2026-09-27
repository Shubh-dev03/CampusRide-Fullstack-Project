import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MyRides from "./pages/MyRides";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import EditRide from "./pages/editRide";
import RideDetails from "./pages/RideDetails";
import Login from "./pages/login";
import Signup from "./pages/signUp";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#FFFFFF",
            color: "#1E2A28",
            border: "1px solid #DCE6E4",
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />

        {/* Root: public landing page when signed out, ride feed when signed in */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <HomePage />
              </Layout>
            ) : (
              <LandingPage />
            )
          }
        />

        <Route
          path="/my-rides"
          element={
            <PrivateRoute>
              <MyRides />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/ride/:rideId"
          element={
            <PrivateRoute>
              <RideDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-ride/:id"
          element={
            <PrivateRoute>
              <EditRide />
            </PrivateRoute>
          }
        />

        {/* Redirect old /rider route */}
        <Route path="/rider" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
