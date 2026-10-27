# 🎬 IMovies - Movie Ticket Booking System

A full-stack modern cinema ticket booking web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), featuring real-time seat reservation, JWT authentication, role-based access control, an interactive seat matrix, mock payments, gate-ready digital tickets, and an administrative control suite.

---

## 🌟 Highlights & Key Features

### 1. 🔐 Authentication & Role-Based Authorization
- **JWT (JSON Web Tokens)** & **Bcrypt.js** password encryption.
- Role-based access control (`user` and `admin` roles).
- Session persistence and protected routes for booking, profile, and administrative dashboards.
- Quick-fill demo buttons on the Sign-In page for instant testing.

### 2. 🍿 Movie Catalog, Search & Dynamic Filtering
- Browse now-showing and upcoming movies.
- Real-time search across movie titles, descriptions, and directors.
- Multi-faceted filtering by genre (Action, Sci-Fi, Drama, Animation, etc.) and language.
- Sorting by Highest Rated, Latest Release, Longest Duration, and Title.
- Movie details page featuring high-res banners, duration, rating, director, star cast, and trailer preview.

### 3. 🗓️ Showtime & Screen Scheduling
- Multi-theatre support with screen amenities (IMAX Laser, Dolby Atmos, 4DX, Recliners).
- Date selector tabs (Today, Tomorrow, and subsequent days).
- Multiple daily showtimes per theatre with pricing tiers.

### 4. 💺 Interactive Seat Matrix & Real-Time Availability
- Curved visual cinema screen with radiant lighting effects.
- 3-tier seating structure:
  - **VIP Section (Recliner)**: Front rows with premium comfort.
  - **Premium Section**: Center sweet-spot viewing rows.
  - **Regular / Standard**: General seating rows.
- Dynamic states: **Available**, **Selected**, and **Booked/Sold**.
- Walkway / aisle spacing simulation.
- 8-seat maximum per transaction with real-time price tally and convenience fee calculation.

### 5. 💳 Mock Checkout & Gate-Ready Digital Ticket
- Multi-method checkout: Credit/Debit Cards, UPI (Google Pay, PhonePe), and Net Banking.
- Unique booking reference code generator (e.g. `IMV-748921`).
- Gate-ready digital pass with simulated QR code for contactless gate scanning.
- **Print / Save as PDF** support (`window.print()` formatted for receipts/boarding passes).

### 6. 🎟️ User History & Instant Ticket Cancellation
- View past and upcoming ticket reservations.
- One-click cancellation with immediate seat release and automated refund status update.

### 7. 🛠️ Administrative Control Center (`/admin`)
- **Executive Metrics**: Total Revenue, Total Bookings, Active Shows, Movies, and Users.
- **Movies Management**: Add new movies, edit existing movie details, or delete movies.
- **Show Scheduling**: Schedule shows by picking movie, theatre, date, time, and custom pricing tiers. Automatically provisions the full 60-seat layout.
- **All Bookings Monitor**: Real-time log of customer reservations with search, filtering, and manual override cancellation.
- **Theatres Overview**: View auditoriums, screen layouts, and amenities.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js, MongoDB (Mongoose ODM), JWT, Bcryptjs, Cors, Dotenv |
| **Database** | MongoDB with automatic In-Memory fallback via `mongodb-memory-server` |
| **Frontend** | React 18 (Vite), React Router v6, Tailwind CSS, Lucide React Icons, React Toastify |

> [!NOTE]
> **Zero Database Setup Required Out-of-the-Box**: The application embeds `mongodb-memory-server`. If you don't have a local MongoDB instance running or an external Atlas URI configured, the server automatically starts an in-memory database and seeds it with movies, theatres, shows, and demo accounts!

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation
Clone or navigate to the project directory and install all root, server, and client dependencies:

```bash
# In the root directory:
npm run install:all
```

*(Alternatively, run `npm install` inside both `server/` and `client/` directories.)*

### 2. Environment Variables (Optional)
The project comes pre-configured with default development settings. If you want to customize your environment:

- `server/.env`:
  ```env
  PORT=5001
  NODE_ENV=development
  JWT_SECRET=imovies_super_secret_jwt_key_2026

  # Optional: Uncomment if using a local or cloud MongoDB
  # MONGODB_URI=mongodb://127.0.0.1:27017/imovies
  ```

### 3. Run the Full Application
Start both the backend API server and the Vite frontend simultaneously:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5001](http://localhost:5001)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔑 Default Demo Credentials

Pre-seeded accounts are provided for testing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `admin123` | Full access to Admin Panel, movie CRUD, show scheduling, all bookings |
| **Customer User** | `user@imovies.com` | `user123` | Standard booking, seat selection, personal ticket history & cancellation |

*(Quick-fill buttons for both accounts are available on the `/login` screen).*

---

## 📁 Project Structure

```text
├── package.json               # Root scripts (concurrent execution)
├── README.md                  # System documentation
│
├── server/                    # Node.js + Express Backend
│   ├── package.json
│   ├── .env
│   ├── src/
│   │   ├── server.js          # Express app entry & routing
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connector with In-Memory fallback
│   │   ├── models/            # Mongoose Schemas (User, Movie, Theatre, Show, Seat, Booking)
│   │   ├── controllers/       # Business logic for auth, movies, shows, bookings, admin
│   │   ├── routes/            # REST API route endpoints
│   │   ├── middleware/        # JWT auth & admin guard middleware
│   │   ├── data/              # Initial seed datasets (movies, theatres, shows)
│   │   └── utils/             # Database seeder scripts
│
└── client/                    # React 18 + Vite Frontend
    ├── package.json
    ├── vite.config.js         # Vite configuration with API proxy
    ├── tailwind.config.js     # Cinema-themed color palette
    ├── index.html
    └── src/
        ├── main.jsx           # App entry with BrowserRouter & AuthProvider
        ├── App.jsx            # Application routes & layout
        ├── index.css          # Tailwind base & ticket print media styles
        ├── context/           # AuthContext (JWT management & session restore)
        ├── services/          # Axios instance with interceptors
        ├── components/        # Navbar, Footer, MovieCard, SeatGrid, TicketModal, ProtectedRoute
        └── pages/             # Home, Movies, MovieDetails, Booking, Success, Profile, Login, Admin
```

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Fetch authenticated user profile
- `PUT /api/auth/profile` - Update name and phone number

### Movies
- `GET /api/movies` - List movies with search & filter query params (`?search=&genre=&language=`)
- `GET /api/movies/:id` - Get movie details and upcoming showtimes
- `POST /api/movies` - Create a new movie *(Admin only)*
- `PUT /api/movies/:id` - Update movie *(Admin only)*
- `DELETE /api/movies/:id` - Delete movie & associated shows *(Admin only)*

### Shows & Seats
- `GET /api/shows` - List shows (`?movieId=&theatreId=&date=`)
- `GET /api/shows/:id/seats` - Get show details and live seat availability layout
- `POST /api/shows` - Schedule show and auto-provision seats *(Admin only)*
- `DELETE /api/shows/:id` - Delete show & its seat map *(Admin only)*

### Bookings & Tickets
- `POST /api/bookings` - Reserve seats and complete mock payment
- `GET /api/bookings/my-bookings` - Fetch current user's booking history
- `GET /api/bookings/:id` - Fetch single ticket boarding pass
- `PUT /api/bookings/:id/cancel` - Cancel ticket, refund, and release seats

### Admin Dashboard
- `GET /api/admin/stats` - Total metrics & revenue analytics
- `GET /api/admin/bookings` - View all customer bookings
- `GET /api/admin/users` - View registered user accounts

---

## 🧪 Testing Verification Checklist

1. **Authentication**:
   - Log in with `user@imovies.com` / `user123`.
   - Log out and log in with `admin@imovies.com` / `admin123`.
   - Register a brand new user account.
2. **Movie Discovery**:
   - Use the search bar to find "Dune" or "Oppenheimer".
   - Filter by genre ("Sci-Fi", "Action") and language.
3. **Seat Booking**:
   - Select a movie -> pick a date & showtime.
   - Choose seats across VIP, Premium, and Regular tiers.
   - Verify dynamic total calculation and click "Confirm & Pay".
   - View generated boarding pass with booking code and QR simulation.
   - Test "Print / Save PDF".
4. **Cancellation**:
   - Go to "My Tickets" in profile.
   - Click "Cancel Ticket" on a booking; verify that seats are released.
5. **Admin Capabilities**:
   - Navigate to `/admin`.
   - Add a new movie or edit an existing one.
   - Schedule a new show for any date.
   - Inspect the global bookings table.

---

## 🎓 Academic Submission Note
Developed for the college project *"IMovies - Movie Ticket Booking System"*. Meets all requirements for stack architecture, database models, interactive seat selection, payment workflows, and admin controls.
