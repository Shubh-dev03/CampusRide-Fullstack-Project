import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Preserve a from/to search handed off from the landing page (?from=&to=)
  // so it lands back on HomePage's search once the user is signed in.
  const searchQuery = location.search;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
      );

      login(res.data.token, res.data.user);
      toast.success("Login successful!");
      navigate(`/${searchQuery}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6"
      style={{ background: "linear-gradient(135deg, #3D8F86 0%, #1E4C46 100%)" }}
    >
      <Card className="w-full max-w-md p-6 sm:p-8">
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl shadow-raised"
            style={{ background: "linear-gradient(135deg, #3D8F86 0%, #2F6F68 100%)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-7 0a2 2 0 100 4 2 2 0 000-4zm-5 0a2 2 0 100 4 2 2 0 000-4z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="mb-1 text-center text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
          Welcome Back
        </h2>

        <p className="mb-6 text-center text-sm text-ink-soft dark:text-ink-dark-soft">
          Sign in to continue to CampusRide
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Email Address"
            inputProps={{
              type: "email",
              placeholder: "you@campus.edu",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true,
            }}
          />

          <FormField label="Password">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-control border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          </FormField>

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft dark:text-ink-dark-soft">
          Don't have an account?{" "}
          <span
            onClick={() => navigate(`/signup${searchQuery}`)}
            className="cursor-pointer font-medium text-primary hover:underline"
          >
            Sign up
          </span>
        </p>
      </Card>
    </div>
  );
}
