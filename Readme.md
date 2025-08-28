# E-Summit Controls & Verification Portal

![E-Summit Controls Banner](https://placehold.co/1200x300/0f172a/a78bfa?text=E-Summit%20Controls%20Portal)

A full-stack web application designed to streamline the participant check-in process for E-Summit, the annual entrepreneurship summit organized by E-Cell IIITR. This portal automates participant verification, ID card printing, and provides real-time event statistics, replacing a previously manual and time-consuming process.

---

## 🚀 The Problem

During E-Summit, the on-campus registration process involved manually verifying each participant's payment ID against a spreadsheet, checking their ticket details, and then individually printing an ID card. This process was slow, prone to human error, and led to long queues, creating a poor first impression for attendees.

## ✨ The Solution

This application automates the entire workflow:
1.  Participants receive a QR code containing their unique Payment ID upon ticket purchase.
2.  At the event, the Controls Team scans this QR code using the web portal.
3.  The system instantly fetches the participant's data from a centralized Google Sheet.
4.  The team verifies the details on-screen and prints a professional ID card with a single click.
5.  The Google Sheet is automatically updated with the participant's check-in status, the team member who checked them in, and a timestamp.

---

## 📋 Features

- **Secure Authentication**: A JWT-based login system ensures only authorized E-Cell team members can access the portal.
- **QR Code Verification**: Supports QR code image uploads for robust verification.
- **Real-time Data Integration**: Securely connects to a Google Sheet as the single source of truth for all participant data.
- **Instant ID Card Preview & Printing**: Generates a clean, professional ID card preview on-screen and uses a print-optimized stylesheet for perfect printing.
- **Live Dashboard**: Provides the team with real-time statistics on total participants, number of check-ins, and pending arrivals.
- **Check-in History**: A searchable log on the dashboard shows which participant was checked in by which team member and at what time.

---

## 🛠️ Tech Stack

| Category         | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| **Frontend** | [React](https://reactjs.org/) (with Vite), [Tailwind CSS](https://tailwindcss.com/), [React Router](https://reactrouter.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) |
| **Database** | [Google Sheets API](https://developers.google.com/sheets/api)           |
| **Authentication** | JSON Web Tokens (JWT)                                                   |

---

## ⚙️ Setup and Installation

This project is a monorepo containing both the `frontend` and `backend` in one repository.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd <your-repo-name>
```

### 2. Backend Setup

First, set up the server which connects to the Google Sheet.

```bash
# Navigate into the server directory
cd server

# Install dependencies
npm install
```

Next, configure your environment variables:
1.  **Create Credentials**: Follow the Google Cloud setup steps to create a Service Account and download the `credentials.json` key file. Place this file inside the `/server` directory.
2.  **Share Your Sheet**: Share your Google Sheet with the `client_email` found in your `credentials.json` file, giving it **Editor** permissions.
3.  **Create `.env` file**: Create a file named `.env` in the `/server` directory and add the following variables:

    ```env
    # The ID from the URL of your Google Sheet
    GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID_HERE

    # A long, random, secret string for securing login tokens
    JWT_SECRET=YOUR_SUPER_SECRET_KEY_HERE
    ```

### 3. Frontend Setup

Now, set up the React client in a separate terminal.

```bash
# Navigate into the frontend directory from the project root
cd frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

You need to have both the backend and frontend servers running simultaneously in two separate terminals.

**Terminal 1: Start the Backend Server**
```bash
# In your /server directory terminal
npm run dev
```
The server will start on `http://localhost:3001`.

**Terminal 2: Start the Frontend Client**
```bash
# In your /frontend directory terminal
npm run dev
```
The React application will start on `http://localhost:5173`. You can now open this URL in your browser.

---

## 📸 Screenshots

![Login Page](https://i.imgur.com/example.png)
![Scan Page](https://i.imgur.com/example.png)
