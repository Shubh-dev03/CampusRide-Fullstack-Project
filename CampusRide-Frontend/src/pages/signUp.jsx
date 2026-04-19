import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        phone,
        // no role field — removed
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-[#111827] text-center mb-1">
          Create your account
        </h2>
        <p className="text-sm text-[#9CA3AF] text-center mb-6">
          Join CampusRide today
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Phone
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-[#6B7280] text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#2563EB] cursor-pointer font-medium hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
