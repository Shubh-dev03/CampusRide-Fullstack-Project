import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      alert("Login successful!");
      console.log("Login successful:", res.data);

      // Store JWT token in localStorage
      localStorage.setItem("token", res.data.token);

      const role = res.data.user.role;

      // Store user role in localStorage
      localStorage.setItem("role", role);

      if (role === "driver") {
        window.location.href = "/";
      } else {
        window.location.href = "/rider";
      }
    } catch (error) {
      console.log("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
        </div>
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Login
        </button>
        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
