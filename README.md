# BeautiSlot

BeautiSlot is a modern web platform that makes it easy for people to book beauty and personal care services online. It connects clients with beauty professionals (like barbers, stylists, makeup artists, nail technicians, and spas) and helps providers manage their business efficiently.

---

## Table of Contents
- [Introduction](#introduction)
- [Problem Solved](#problem-solved)
- [Main Features](#main-features)
- [How to Use the App](#how-to-use-the-app)
- [Navigation Guide](#navigation-guide)
- [Demo Login Credentials](#demo-login-credentials)
- [Tech Stack & Tools Used](#tech-stack--tools-used)
- [How to Run the Project Locally](#how-to-run-the-project-locally)
- [License](#license)

---

## Introduction
BeautiSlot is designed to make booking beauty appointments simple and stress-free. Whether you are a client looking for a service or a provider managing your business, BeautiSlot offers a smooth experience for everyone.

## Problem Solved
Many people struggle to find and book beauty services easily. Beauty professionals also need a better way to manage their schedules, services, and clients. BeautiSlot solves these problems by providing:
- A simple way for clients to search, book, and review services.
- Powerful tools for providers to manage their business online.
- An admin dashboard to keep the platform running smoothly.

## Main Features

### For Clients
- **Easy Registration & Login:** Sign up or log in as a client.
- **Search Providers:** Find beauty professionals by name, category, or location.
- **Book Appointments:** Choose a provider, pick a service, and book a time slot.
- **View Bookings:** See all your upcoming and past appointments.
- **Leave Reviews:** Share your experience and rate providers.

### For Providers
- **Provider Registration & Login:** Sign up or log in as a provider.
- **Profile Management:** Update your profile, bio, and contact details.
- **Service Management:** Add, edit, or remove the services you offer.
- **Set Availability:** Choose when clients can book you.
- **Manage Bookings:** View and update the status of all your appointments.
- **Portfolio:** Showcase your work with photos.

### For Admins
- **Admin Login:** Secure login for platform administrators.
- **User Management:** View and manage all users (clients and providers).
- **Booking Management:** See all bookings on the platform.
- **Analytics Dashboard:** View platform statistics and growth.
- **Platform Settings:** Manage platform-wide settings.

### General Features
- **Secure Authentication:** JWT-based login for all users.
- **Role-Based Dashboards:** Each user type sees their own dashboard and features.
- **Responsive Design:** Works well on computers, tablets, and phones.
- **Email Notifications:** Get updates about bookings and important actions.

---

## How to Use the App

### 1. Login
Use the demo credentials below or register as a new user. After logging in, you will be taken to your dashboard based on your role (admin, provider, or client).

### 2. For Clients
- **Search for Providers:** Use the search page to find beauty professionals.
- **Book an Appointment:** Click on a provider, view their services, and book a slot.
- **View Your Bookings:** Go to the "Bookings" page to see all your appointments.
- **Leave a Review:** After your appointment, visit the "Reviews" page to rate your experience.

### 3. For Providers
- **Update Your Profile:** Go to your profile page to add your bio and contact info.
- **Add Services:** List the services you offer and set prices.
- **Set Your Availability:** Choose when clients can book you.
- **Manage Bookings:** View all your bookings and update their status (e.g., confirm, complete).
- **Showcase Your Work:** Add photos to your portfolio.

### 4. For Admins
- **View Users:** See all registered clients and providers.
- **Manage Bookings:** Oversee all appointments on the platform.
- **View Analytics:** Check platform statistics and growth trends.
- **Change Settings:** Update platform-wide settings as needed.

### 5. Logging Out
Click the "Logout" button at the top right of your dashboard to securely log out and return to the login page.

---

## Navigation Guide
- **Login/Register:** `/auth/login` or `/auth/register`
- **Client Dashboard:** `/client/dashboard`
- **Provider Dashboard:** `/provider/dashboard`
- **Admin Dashboard:** `/admin/dashboard`
- **Search Providers:** `/client/search`
- **Book Appointment:** `/client/book`
- **View Bookings:** `/client/bookings` or `/provider/bookings`
- **Reviews:** `/client/reviews`
- **Provider Profile:** `/provider/profile`
- **Provider Services:** `/provider/services`
- **Provider Portfolio:** `/provider/portfolio`
- **Admin Users:** `/admin/users`
- **Admin Bookings:** `/admin/bookings`
- **Admin Analytics:** `/admin/analytics`
- **Admin Settings:** `/admin/settings`

---

## Demo Login Credentials

**Admin:**
- Email: `admin@gmail.com`
- Password: `1234admin`

**Provider:**
- Email: `basit@gmail.com`
- Password: `basit123`

**Client/User:**
- Email: `adam@gmail.com`
- Password: `adam123`

---

## Tech Stack & Tools Used

### Frontend
- **Next.js** (React framework for server-side rendering and routing)
- **React** (UI library)
- **Tailwind CSS** (for fast, responsive styling)
- **Radix UI** (for accessible UI components)
- **Framer Motion** (for animations)
- **Lucide React** (for icons)
- **React Hook Form** (for forms)
- **Zod** (for form validation)
- **Other tools:** date-fns, recharts, embla-carousel, and more

### Backend
- **Node.js** (JavaScript runtime)
- **Express.js** (web server framework)
- **MongoDB** (database)
- **Mongoose** (MongoDB ORM)
- **JWT** (authentication)
- **Nodemailer** (for sending emails)
- **Cloudinary** (for image uploads)
- **Swagger** (API documentation)
- **Other tools:** bcryptjs, multer, helmet, joi, cors, dotenv, morgan

---

## How to Run the Project Locally

### 1. Clone the Repository
```
git clone <your-repo-url>
cd BeautiSlot
```

### 2. Set Up the Backend
```
cd backend
npm install
# Create a .env file and set your MongoDB URI and other secrets
npm run dev
```

### 3. Set Up the Frontend
```
cd ../frontend
npm install
# Create a .env.local file and set NEXT_PUBLIC_API_BASE_URL (see API docs)
npm run dev
```

### 4. Open the App
Go to [http://localhost:3000](http://localhost:3000) in your browser.

---
# Preview of the App Interface (Screenshots)


![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-auth-register-2025-07-22-15_24_10.png)
Registration page


![screenshot](/frontend/public/screenshots/login%20(2).png)
Login Page
![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-admin-analytics-2025-07-22-15_41_07.png)
Admin analytics page showing the stats
![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-admin-dashboard-2025-07-22-15_40_23.png)
Admin dashboard

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-admin-settings-2025-07-22-15_41_32.png)
Admin settings page


![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-client-dashboard-2025-07-22-15_38_47.png)

Client dashboard

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-client-book-2025-07-22-15_27_14.png)
Client booking appointment page


![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-client-providers-687d0382a0d0e601bfd9797e-2025-07-22-15_25_59.png)

Client page - service providers view

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-dashboard-2025-07-22-15_38_03%20(1).png)
Service provider dashboard 

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-availability-2025-07-22-15_34_05.png)
Provider time availability setup modal


![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-portfolio-2025-07-22-15_35_58.png)
Image portfolio modal for provider

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-portfolio-2025-07-22-15_36_07.png)
Image portfolio page for provider of service 

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-profile-2025-07-22-15_37_37.png)
Provider profile page

![screenshot](/frontend/public/screenshots/screencapture-localhost-3000-provider-services-2025-07-22-15_32_56.png)

Provider services page (a modal to add types and description of services)









---

## License
This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
