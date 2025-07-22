# BeautiSlot API Documentation

## Project Concept
BeautiSlot is a modern Beauty & Personal Care Booking Platform for barbers, stylists, makeup artists, nail techs, spas, and their clients. The backend is a robust Node.js/Express/MongoDB REST API supporting:
- Provider and client registration/login
- Provider profile, services, availability, and portfolio management
- Client search, booking, and review flows
- Email notifications (Nodemailer)
- Admin management (users, bookings, analytics)
- JWT authentication and role-based access

---

## User Roles & Authentication Flow

- **Roles:**
  - `admin`: Platform administrator. Can manage all users, bookings, and view analytics.
  - `provider`: Beauty professional. Can manage their profile, services, availability, portfolio, and received bookings.
  - `client`: Regular user. Can search providers, book appointments, and leave reviews.

- **Login:**
  - All users (admin, provider, client) use the same login endpoint (`/auth/login`).
  - The API response includes the user's role (e.g., `{ user: { ..., role: "provider" } }`).
  - The frontend should route the user to the appropriate dashboard based on the returned role.

- **JWT Authentication:**
  - All protected endpoints require a JWT token in the `Authorization: Bearer <token>` header.
  - After login, store the token securely (HttpOnly cookie or secure localStorage).

- **Role-Based Routing:**
  - After login, check the user's role and redirect:
    - `admin` → Admin dashboard
    - `provider` → Provider dashboard
    - `client` → Client dashboard

---

## Required .env Variables for Frontend

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```
- Set this in your Next.js `.env.local` file for API requests.

---

## Human-Readable API Endpoint Reference

### Auth

#### Register
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "provider" // or "client"
}
```
- **Response:**
```json
{
  "token": "<JWT>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "provider" }
}
```

#### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "token": "<JWT>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "provider" }
}
```

#### Forgot Password
- **POST** `/auth/forgot-password`
- **Body:**
```json
{
  "email": "jane@example.com"
}
```
- **Response:**
```json
{ "message": "Password reset email sent" }
```

#### Reset Password
- **POST** `/auth/reset-password`
- **Body:**
```json
{
  "token": "<resetToken>",
  "password": "newpassword123"
}
```
- **Response:**
```json
{ "message": "Password reset successful" }
```

---

### Provider Profile

#### Get Profile
- **GET** `/providers/profile` (auth: provider)
- **Response:**
```json
{
  "id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "provider",
  ...
}
```

#### Update Profile
- **PUT** `/providers/profile` (auth: provider)
- **Body:**
```json
{
  "name": "Jane Doe",
  "bio": "Experienced stylist",
  "location": "Lagos"
}
```
- **Response:**
```json
{
  "id": "...",
  "name": "Jane Doe",
  "bio": "Experienced stylist",
  "location": "Lagos",
  ...
}
```

---

### Bookings

#### Book Appointment
- **POST** `/bookings` (auth: client)
- **Body:**
```json
{
  "serviceId": "...",
  "date": "2024-06-01",
  "dayOfWeek": "Monday",
  "startTime": "10:00",
  "endTime": "11:00"
}
```
- **Response:**
```json
{
  "id": "...",
  "clientId": "...",
  "providerId": "...",
  "serviceId": "...",
  "date": "2024-06-01",
  "startTime": "10:00",
  "endTime": "11:00",
  "status": "pending",
  "paymentStatus": "unpaid"
}
```

#### Provider: Update Booking Status
- **PATCH** `/provider/bookings/{id}/status` (auth: provider)
- **Body:**
```json
{ "status": "confirmed" }
```
- **Response:**
```json
{ "id": "...", "status": "confirmed", ... }
```

---

### Reviews

#### Leave Review
- **POST** `/reviews` (auth: client)
- **Body:**
```json
{
  "appointmentId": "...",
  "rating": 5,
  "review": "Great service!"
}
```
- **Response:**
```json
{
  "id": "...",
  "appointmentId": "...",
  "clientId": "...",
  "providerId": "...",
  "rating": 5,
  "review": "Great service!",
  "createdAt": "2024-06-01T12:00:00Z"
}
```

---

## OpenAPI 3.0 (Swagger) JSON

```json
{
  "openapi": "3.0.0",
  ... (full Swagger JSON here) ...
}
```

---

**How to use:**
- Reference this file for all endpoint URLs, request/response bodies, and authentication requirements.
- See the Swagger UI for interactive testing and live examples. 