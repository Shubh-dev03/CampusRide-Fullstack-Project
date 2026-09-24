# CampusRide Backend

REST API server for CampusRide, a ride-sharing platform for college students. It handles user authentication, ride creation and booking, and powers an in-app AI assistant ("Ryde") for the frontend.

## 1. Project Overview

The backend is responsible for:

- User registration and login (email + password)
- Storing user profiles, including optional vehicle details
- Creating, editing, deleting, searching, and booking rides
- Enforcing who can offer rides (a user must have vehicle details on file)
- Proxying chat messages to an AI model (via Groq) for the "Ryde" assistant

It exposes a JSON REST API consumed by the CampusRide frontend (a React SPA). All ride and profile actions except viewing/searching rides require a valid JWT.

## 2. Tech Stack

- **Node.js** with **Express** (v4) — HTTP server and routing
- **MongoDB** with **Mongoose** — data storage and modeling
- **JWT** (`jsonwebtoken`) — session tokens for authentication
- **bcryptjs** — password hashing
- **cors** — cross-origin request support
- **dotenv** — environment variable loading
- **groq-sdk** — AI chat completions for the "Ryde" assistant

## 3. Project Structure

```text
CampusRide-Backend/
├── config/
│   └── db.js              # Mongoose connection setup
├── controllers/
│   ├── authController.js  # Register / login logic
│   ├── userController.js  # Get profile, update vehicle details
│   ├── rideController.js  # Create/search/book/edit/delete rides
│   ├── chatController.js  # Handles requests to the AI assistant
│   └── test.js            # Simple health-check controller (unused by routes)
├── middlewares/
│   ├── authMiddleware.js  # Verifies JWT, attaches req.user
│   ├── vehicleDetail.js   # Blocks ride creation without vehicle details
│   ├── asyncHandler.js    # Wraps async controllers for error forwarding
│   └── errorMiddleware.js # Central error handler
├── models/
│   ├── userModel.js       # User schema (with embedded vehicleDetails)
│   └── rideModel.js       # Ride schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── rideRoutes.js
│   └── chatRoutes.js
├── services/
│   └── groqService.js     # Groq SDK client instance
├── utils/
│   ├── customsError.js    # CustomError class (message + statusCode)
│   └── systemPrompt.js    # System prompt for the Ryde AI assistant
└── server.js               # App entry point, route mounting
```

## 4. Architecture / Request Flow

Client
↓
Route (routes/_.js)
↓
Middleware (authMiddleware, vehicleDetail — where applicable)
↓
Controller (controllers/_.js)
↓
Model (Mongoose) / External service (Groq)
↓
errorMiddleware (on thrown errors)

Most controllers are wrapped with `asyncHandler`, so any error (including a `CustomError` with a specific status code) is passed to `errorMiddleware`, which returns a consistent JSON error response.

## 5. API Endpoints

Base URL: `/api`

### Auth (`/api/auth`)

| Method | Endpoint    | Purpose                   | Authentication |
| ------ | ----------- | ------------------------- | -------------- |
| POST   | `/register` | Create a new user account | None           |
| POST   | `/login`    | Log in and receive a JWT  | None           |

**POST `/api/auth/login`** response:

```json
{
  "success": true,
  "message": "Login successfull!",
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "phone": "...",
    "vehicleDetails": null
  }
}
```

### Users (`/api/users`)

| Method | Endpoint           | Purpose                                  | Authentication |
| ------ | ------------------ | ---------------------------------------- | -------------- |
| GET    | `/getuser`         | Fetch the authenticated user's profile   | JWT required   |
| PATCH  | `/vehicle-details` | Add or update the user's vehicle details | JWT required   |

### Rides (`/api/rides`)

| Method | Endpoint          | Purpose                                       | Authentication                 |
| ------ | ----------------- | --------------------------------------------- | ------------------------------ |
| GET    | `/`               | List all rides with available seats           | None                           |
| GET    | `/search`         | Search rides by `from`, `to`, `rideTime`      | None                           |
| POST   | `/create`         | Create a new ride                             | JWT + vehicle details required |
| GET    | `/mybookings`     | List rides the user has booked as a passenger | JWT required                   |
| GET    | `/myrides`        | List rides the user has created as a driver   | JWT required                   |
| GET    | `/:rideId`        | Get a single ride (driver or passenger only)  | JWT required                   |
| POST   | `/cancel/:rideId` | Cancel a booking on a ride                    | JWT required                   |
| DELETE | `/:rideId`        | Delete a ride (driver only)                   | JWT required                   |
| PATCH  | `/edit/:rideId`   | Edit ride details (driver only)               | JWT required                   |
| POST   | `/book/:rideId`   | Book a seat on a ride                         | JWT required                   |

**POST `/api/rides/create`** request body:

```json
{
  "from": "Campus Gate",
  "to": "City Mall",
  "rideTime": "2026-10-01T09:00",
  "rideFare": 50,
  "availableSeats": 3
}
```

### Chat (`/api/chat`)

| Method | Endpoint | Purpose                                       | Authentication                          |
| ------ | -------- | --------------------------------------------- | --------------------------------------- |
| POST   | `/`      | Send conversation history to the AI assistant | None (no auth middleware on this route) |

Request body:

```json
{
  "messages": [{ "role": "user", "content": "How do I book a ride?" }]
}
```

Response: `{ "reply": "..." }`

## 6. Authentication & Authorization

- **Registration** (`registerController`): checks if the email is already registered, hashes the password with `bcryptjs` (10 salt rounds), and creates the user.
- **Login** (`loginController`): looks up the user by email, compares the password hash, and on success signs a JWT (`jsonwebtoken`) containing the user's ID, valid for 7 days.
- **`authMiddleware`**: reads the `Authorization: Bearer <token>` header, verifies the JWT with `JWT_SECRET`, loads the full user document (password excluded) from MongoDB, and attaches it to `req.user` (and the raw ID to `req.userId`). Returns `401` if the token is missing, invalid, or the user no longer exists.
- **`vehicleDetail` middleware**: used only on ride creation. It checks `req.user.vehicleDetails` and rejects the request with `400` and code `NO_VEHICLE_DETAILS` if the user hasn't added vehicle information yet.
- **Ownership checks**: ride editing and deletion controllers manually verify that `ride.driver` matches `req.userId` before allowing the action, returning `403` otherwise.

Passwords are never returned in API responses (`.select("-password")` is used where applicable).

## 7. Database

- **Database**: MongoDB, accessed through Mongoose.
- **Models**:
  - `User` (`models/userModel.js`): `name`, `email` (unique), `password` (hashed), `phone`, and an embedded `vehicleDetails` sub-document (`make`, `model`, `licensePlate`, `capacity`), defaulting to `null` until the user adds a vehicle.
  - `Ride` (`models/rideModel.js`): `driver` (ObjectId ref to `User`), `from`, `to`, `rideTime`, `rideFare`, `availableSeats`, and `passengers` (array of ObjectId refs to `User`). Both models use Mongoose `timestamps`.
- Ride queries use `.populate()` to include driver/passenger name, email, and phone where needed.

## 8. Middleware

| Middleware        | Purpose                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `authMiddleware`  | Verifies the JWT and attaches the authenticated user to the request                          |
| `vehicleDetail`   | Ensures a user has vehicle details before letting them create a ride                         |
| `asyncHandler`    | Wraps async controller functions and forwards thrown errors to `next()`                      |
| `errorMiddleware` | Global error handler; returns `{ success: false, message }` with the appropriate status code |

## 9. Services / External Integrations

- **Groq (`groq-sdk`)**: `services/groqService.js` creates a Groq client. `chatController.js` uses it to send the last 20 messages of a conversation, prefixed with a fixed system prompt (`utils/systemPrompt.js`), to the `openai/gpt-oss-120b` model and returns the assistant's reply. The system prompt restricts the assistant ("Ryde") to only describe CampusRide's actual features and instructs it not to invent data, bookings, or UI elements.
- The controller handles Groq-specific error cases (invalid request, rate limiting, auth failure) with tailored HTTP responses.

## 10. Environment Variables

```env
PORT=
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
```

- `PORT` — port the Express server listens on (defaults to `5000` if not set)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign and verify JWTs
- `GROQ_API_KEY` — API key for the Groq client used by the chat assistant

## 11. Running Locally

```bash
git clone <repository-url>
cd CampusRide-Backend
npm install
```

Create a `.env` file in `CampusRide-Backend/` with the variables listed above, then start MongoDB (locally or via a hosted connection string in `MONGO_URI`) and run:

```bash
npm start
```

This runs `node server.js`. The `package.json` does not define a `dev` script.

## 12. API Testing

No testing tools (Postman collection, Jest, Supertest) are configured in the repository.

## 13. Deployment

No deployment configuration (e.g. Dockerfile, CI workflow, platform-specific config) is present in the backend directory.
