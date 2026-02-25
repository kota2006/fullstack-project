# Certification Tracking Platform

A full-stack React application for managing professional certifications. This project features user and admin roles, expiration tracking, and visual alerts for renewals.

## Features

* **Role-based Access**: Separate dashboards for Users and Administrators
* **Mock Authentication**: Simple local-storage based authentication
* **Certification Management**: Add, view, edit (admin), and delete (admin) certificates
* **Expiration Alerts**: Color-coded badges for active, expiring soon (<= 90 days), and expired certificates
* **Responsive Design**: Built with Tailwind CSS, fully responsive across devices

## Tech Stack

* React 18
* Vite
* React Router DOM v7
* Tailwind CSS
* Lucide React (Icons)
* React Hot Toast (Notifications)
* Date-fns (Date calculations)

## Getting Started

### Prerequisites

* Node.js (v16 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

### Demo Credentials

You can use the built-in demo buttons on the login screen, or use these credentials:

**Student/User Role:**
* Email: `student@certapp.com`
* Password: `password123`

**Admin Role:**
* Email: `admin@certapp.com`
* Password: `password123`

## Screenshots

![Login Screen](#)
![Dashboard](#)
![Admin Panel](#)

## Folder Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context (Auth)
├── data/             # Mock data initialized in Local Storage
├── pages/            # Main application views/pages
├── services/         # API abstraction
│   └── api.js        # Mock API methods
├── App.jsx           # Main routing
├── index.css         # Global Tailwind CSS
└── main.jsx          # App entry point
```
