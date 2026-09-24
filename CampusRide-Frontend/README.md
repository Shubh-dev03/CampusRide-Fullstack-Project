# CampusRide Frontend

React single-page application for CampusRide, a campus ride-sharing platform. It lets students register, log in, browse and search available rides, create rides as a driver, book/cancel rides as a passenger, manage their profile and vehicle details, and chat with an in-app AI assistant.

## 1. Project Overview

The frontend is the client-facing part of CampusRide. It talks to the CampusRide backend over a REST API and gives users:

- Authentication (sign up / log in) with session persistence
- A home feed of available rides with search by pickup location, destination, and date
- The ability to offer a ride (gated behind having vehicle details on file) and book existing rides
- A "My Rides" view (rides the user is driving) and "My Bookings" view (rides the user has booked)
- Profile management, including vehicle details
- An embedded AI chat assistant ("Ryde") that answers questions about using the app

## 2. Tech Stack

- **React 19** — UI library
- **Vite** — build tool and dev server
- **React Router (`react-router-dom`)** — client-side routing
- **React Context API** — authentication/session state (`AuthContext`)
- **Axios** — HTTP client for API requests
- **Tailwind CSS** — utility-first styling
- **react-hot-toast** — toast notifications
- **react-markdown** — renders Markdown in the AI assistant's replies
- **lucide-react** — icon set

## 3. Project Structure

CampusRide-Frontend/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx # Top navigation bar
│ │ ├── Layout.jsx # Page shell: Navbar + content + Ryde chat widget
│ │ ├── CreateRideModal.jsx # Modal form for creating a ride
│ │ ├── VehicleDetailsModel.jsx # Modal form for adding/updating vehicle details
│ │ └── Ryde.jsx # Floating AI chat assistant widget
│ ├── context/
│ │ └── AuthContext.jsx # Auth state: token, user, login/logout, canOfferRide
│ ├── pages/
│ │ ├── HomePage.jsx # Ride feed + search + create ride entry point
│ │ ├── MyRides.jsx # Rides created by the current user
│ │ ├── MyBookings.jsx # Rides booked by the current user
│ │ ├── Profile.jsx # User profile and vehicle details editor
│ │ ├── RideDetails.jsx # Single ride detail view
│ │ ├── editRide.jsx # Edit an existing ride (driver only)
│ │ ├── login.jsx # Login page
│ │ └── signUp.jsx # Registration page
│ ├── utility/
│ │ └── toast.js # Preconfigured success/error toast helpers
│ ├── App.jsx # Route definitions
│ └── main.jsx # App entry point, wraps App in AuthProvider
├── public/ # Static assets
├── index.html # Vite HTML entry
├── tailwind.config.js
├── vite.config.js
└── vercel.json # SPA rewrite rule for deployment

````

## 4. Main Features

- **Authentication**: `login.jsx` and `signUp.jsx` call the backend auth endpoints. On successful login, the JWT and user object are stored via `AuthContext` (and persisted to `localStorage`).
- **Ride feed & search** (`HomePage.jsx`): fetches available rides, filters out past rides on the client, and supports searching by `from`, `to`, and date, which are sent as query params to the backend search endpoint.
- **Create a ride**: clicking "Create Ride" opens `VehicleDetailsModal` first if the user has no vehicle on file, then `CreateRideModal`. This mirrors the backend's requirement that a user must have vehicle details before creating a ride.
- **Book / cancel rides**: users can book an available ride from the home feed, and cancel an existing booking from `MyBookings.jsx`.
- **My Rides / My Bookings**: separate pages list rides the user is driving versus rides they've booked as a passenger, each with loading and empty states.
- **Edit / delete rides**: drivers can edit ride details (`editRide.jsx`) or delete a ride they created from `MyRides.jsx`.
- **Profile management** (`Profile.jsx`): displays ride stats (rides offered vs. taken) and lets the user update their name, phone, and vehicle details.
- **Ryde AI assistant** (`Ryde.jsx`): a floating chat widget available on every authenticated page (rendered in `Layout.jsx`) that sends the conversation to the backend's `/api/chat` endpoint and renders Markdown-formatted replies.

## 5. Routing

Defined in `src/App.jsx` using `react-router-dom`:

| Path               | Page                | Access                                             |
| -----------------  | ----------------  | --------------------------------------------   |
| `/login`           | `login.jsx`       | Public (redirects to `/` if already logged in) |
| `/signup`          | `signUp.jsx`      | Public (redirects to `/` if already logged in) |
| `/`                | `HomePage.jsx`    | Protected                                      |
| `/my-rides`        | `MyRides.jsx`     | Protected                                      |
| `/my-bookings`     | `MyBookings.jsx`  | Protected                                      |
| `/profile`         | `Profile.jsx`     | Protected                                      |
| `/ride/:rideId`    | `RideDetails.jsx` | Protected                                      |
| `/edit-ride/:id`   | `editRide.jsx`    | Protected                                      |
| `/rider`           | —                 | Redirects to `/`                               |

Protected routes are wrapped in a `PrivateRoute` component that checks `isAuthenticated` from `AuthContext` and redirects unauthenticated users to `/login`. Protected pages are also wrapped in `Layout`, which renders the `Navbar` and the `Ryde` chat widget.

## 6. Backend/API Integration

- All API calls use **Axios**, made directly from page/component files against `${import.meta.env.VITE_API_URL}` plus the relevant backend path — there is no shared API client module.
- **Authentication flow**: on login, the backend's JWT and user object are stored in `AuthContext` and `localStorage` via the `login()` function. Protected requests attach the token as `Authorization: Bearer <token>` in the request headers.
- **Session handling**: `AuthContext` reads the token and user from `localStorage` on load, and `logout()` clears both. `updateUser()` refreshes the stored user (e.g., after saving vehicle details) without a full re-login.
- **Key protected requests**: creating/editing/deleting a ride, booking/cancelling a ride, fetching "My Rides"/"My Bookings", fetching/updating the user profile and vehicle details — all send the bearer token from `AuthContext`.
- **Public requests**: fetching all rides, searching rides, and the `/api/chat` assistant endpoint do not require a token.

## 7. Environment Variables

```env
VITE_API_URL=
````

- `VITE_API_URL` — base URL of the CampusRide backend API (e.g. `http://localhost:5000`), used as the prefix for every Axios request in the app.

## 8. Running Locally

```bash
git clone <repository-url>
cd CampusRide-Frontend
npm install
npm run dev
```

Create a `.env` file in `CampusRide-Frontend/` with `VITE_API_URL` pointing to a running instance of the backend before starting the dev server.

## 9. Build / Deployment

- `npm run build` produces a production build via Vite (`vite build`); `npm run preview` serves it locally.
- A `vercel.json` file is present with a catch-all rewrite (`/(.*)` → `/`), configuring the app for single-page-application routing on Vercel.
