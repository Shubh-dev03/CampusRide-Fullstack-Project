import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("rider"); // Default role is "rider"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        phone,
        role,
      });
      alert("Registration successful!");

      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.log("Sign up failed:", error);
      alert("Error in registration.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Phone:</label>
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>
          <input
            type="radio"
            value="driver"
            checked={role === "driver"}
            onChange={(e) => setRole(e.target.value)}
          />
          Driver
        </label>
        <label className="ml-2">
          <input
            type="radio"
            value="rider"
            checked={role === "rider"}
            onChange={(e) => setRole(e.target.value)}
          />
          Rider
        </label>
        <p className="className=mt-3 text-sm">
          Already have an account?
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </span>
        </p>
        <button className="ml-4" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
export default Signup;
