/** Formats a ride's ISO/date-like time string, e.g. "2024-04-18T09:00" -> "Apr 18, 09:00" */
export function formatRideTime(rideTime) {
    if (!rideTime) return "";
    const date = new Date(rideTime);
    if (isNaN(date)) return rideTime;
    return (
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  }
  