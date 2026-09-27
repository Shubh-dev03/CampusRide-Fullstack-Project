import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, Leaf, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Card from "../components/ui/Card";
import CampusRideHero from "../components/illustrations/CampusRideHero";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Safe & Trusted" },
  { icon: Wallet, label: "Affordable & Convenient" },
  { icon: Leaf, label: "Eco Friendly" },
];

/**
 * Public entry point shown at "/" for signed-out visitors. Logged-in users
 * see HomePage at the same route instead (see App.jsx). Submitting the
 * quick-search card sends the visitor to sign in first, carrying their
 * from/to along as query params so it's waiting for them once they land
 * back on the real search (see login.jsx / HomePage.jsx).
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    const query = params.toString();
    navigate(`/login${query ? `?${query}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Public header */}
      <header className="border-b border-border bg-surface-raised dark:border-border-dark dark:bg-surface-dark-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #3D8F86 0%, #2F6F68 100%)" }}
            >
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
            <span className="text-base font-semibold text-ink dark:text-ink-dark">
              CampusRide
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy + search card */}
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-ink dark:text-ink-dark sm:text-4xl lg:text-[2.75rem]">
              Safe Rides. <span className="text-primary">Happy Campus.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-ink-soft dark:text-ink-dark-soft sm:text-base">
              Find or share rides with fellow students and travel around campus
              together — simple, friendly, and built for your college commute.
            </p>

            <Card className="mt-7 p-4 sm:p-5">
              <form onSubmit={handleSearch} className="space-y-3">
                <FormField
                  label="From"
                  inputProps={{
                    placeholder: "Enter pickup location",
                    value: from,
                    onChange: (e) => setFrom(e.target.value),
                  }}
                />
                <FormField
                  label="To"
                  inputProps={{
                    placeholder: "Enter destination",
                    value: to,
                    onChange: (e) => setTo(e.target.value),
                  }}
                />
                <Button type="submit" fullWidth className="mt-1">
                  Search Rides
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Card>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_POINTS.map((point) => (
                <div
                  key={point.label}
                  className="flex items-center gap-1.5 text-xs font-medium text-ink-soft dark:text-ink-dark-soft"
                >
                  <point.icon className="h-4 w-4 text-primary" />
                  {point.label}
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <CampusRideHero className="w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
