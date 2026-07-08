# Sanghi Brothers - Petrol Pump Management System

Welcome to the **Sanghi Brothers Petrol Pump Management System**. This repository contains a full-stack, production-grade management suite tailored for managing fuel station daily operations, sales, purchases, shifts, cashier logs, attendance, and reports.

## 🚀 Live Application
- **Frontend URL:** [https://sanghibros.vercel.app/](https://sanghibros.vercel.app/)

---

## 📂 Project Structure

The project is structured as a monorepo containing two main parts:

```
SanghiBrothers/
├── Backend/          # Node.js + Express API Server
│   ├── config/       # Configurations (Database, Integrations)
│   ├── models/       # Mongoose Schemas (User, Attendance, Shift, Reports, etc.)
│   ├── routes/       # API Route Endpoints
│   ├── server.js     # Entry point for backend server
│   ├── .env          # Server Configuration & Secrets (gitignored)
│   └── package.json  # Backend Node dependencies
└── Frontend/         # React SPA (Vite + Tailwind CSS)
    ├── src/          # Source files (Components, Contexts, Styles)
    │   ├── components/  # React components grouped by module
    │   ├── App.jsx   # App router & layout definitions
    │   ├── main.jsx  # React DOM entry point
    │   └── index.css # Tailwind & base style rules
    ├── public/       # Public static assets
    ├── index.html    # Single-page HTML skeleton
    ├── vercel.json   # Vercel SPA routing configurations
    ├── vite.config.js # Vite configuration
    └── package.json  # Frontend Node dependencies
```

---

## 🛠️ Tech Stack & Key Libraries

### Backend (Server)
* **Core:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
* **Session & Auth:** `express-session`, `connect-mongo` (MongoDB session store), `jsonwebtoken` (JWT), `bcryptjs`
* **Third-Party Services:**
  - [Cloudinary](https://cloudinary.com/) (Multer Storage for document & image uploads)
  - [Twilio SDK](https://www.twilio.com/) (For automated Shift Reports over SMS)
  - [Nodemailer](https://nodemailer.com/) (SMTP Gmail OTP verification for password resets)
* **Automation:** `node-cron` (For shift assignment notifications)
* **Excel Processing:** `xlsx` parser library

### Frontend (Client)
* **Framework:** [React 18](https://react.dev/)
* **Build System:** [Vite](https://vite.dev/)
* **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
* **Routing:** `react-router-dom` (v7 SPA Routing)
* **Libraries:**
  - `@dnd-kit` (Drag & drop list/layout management)
  - `lucide-react` & `react-icons` (Icon system)
  - `recharts` (Data visualization, graphs, and stats)
  - `html2canvas` & `jspdf` / `jspdf-autotable` (PDF exports)
  - `react-toastify` (Alert notifications)
  - `react-datepicker` (Date picking calendars)

---

## ⚙️ Local Development & Setup

Follow these steps to run the complete environment locally:

### Prerequisites
Make sure you have [Node.js (v18+)](https://nodejs.org/) and a running instance of [MongoDB](https://www.mongodb.com/) installed on your machine.

---

### Step 1: Clone and Configure the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend/` directory by copying the template below:

   ```env
   # Database & Server settings
   MONGODB_URI=your_mongodb_connection_uri
   SESSION_SECRET=your_express_session_secret
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   PORT=5500

   # Nodemailer Gmail Credentials (for OTPs)
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password

   # Invitation Codes (for authorization)
   VALID_INVITATION_CODES=your_member_invitation_codes
   VALID_INVITATION_CODES_FOR_STAFF=your_staff_invitation_codes

   # Cloudinary Media Storage
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret

   # Twilio Credentials (for SMS Shift reports)
   TWILIO_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_from_phone_number

   # Admin Super Credentials
   GMAIL=admin_email_for_super_panel
   PASSWORD=admin_password
   ```

4. Start the backend development server (with nodemon auto-restart):
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5500](http://localhost:5500) by default.*

---

### Step 2: Configure and Run the Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The app runs on [http://localhost:5173](http://localhost:5173) by default.*

---

## ⚡ Production & Deployment

### Backend Deployment
Ensure all `.env` environment variables are loaded in your deployment panel (e.g. Render, Railway, AWS, or Heroku). Remember to adjust `NODE_ENV=production` and ensure the frontend CORS domain is white-listed in `Backend/server.js`.

### Frontend Deployment (Vercel)
The project includes a `vercel.json` file to handle route-rewriting for single-page routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` from the `Frontend/` folder and follow the interactive prompts.

---

## 📄 Handover Documentation
For a deep dive into API endpoints, database schemas, cron job schedulers, features breakdown, and administrative guidelines, please refer to the detailed [Project_Handover_Documentation.md](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Project_Handover_Documentation.md) file.
