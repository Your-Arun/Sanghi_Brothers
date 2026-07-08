# Sanghi Brothers Petrol Pump Management System
## Technical Handover & Documentation Manual

This document provides a comprehensive handover of the **Sanghi Brothers Petrol Pump Management System** codebase, architecture, configuration details, database schemas, and deployment workflows for the incoming development and operations teams.

---

## 🌎 Live Environment
* **Frontend Web App URL:** [https://sanghibros.vercel.app/](https://sanghibros.vercel.app/)
* **Backend API Base Address:** Configurable in development/production (e.g., cors configurations in [server.js](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Backend/server.js) are set to accept requests from the Vercel app domain).

---

## 🏛️ System Architecture

The project is designed using the **MERN (MongoDB, Express, React, Node.js)** architecture model.

```mermaid
graph TD
    A[React Web Client (Vite + Tailwind)] <-->|REST APIs via Axios| B[NodeJS/Express API Server]
    B <-->|Mongoose ODM| C[(MongoDB Atlas)]
    B -->|SMTP SMTP| D[Gmail Email Service]
    B -->|SMS API| E[Twilio SMS Service]
    B -->|Image/Doc Uploads| F[Cloudinary Storage]
    B -->|Task Scheduling| G[Node-Cron Scheduler]
```

### Key Integrations
1. **Database:** [MongoDB](https://www.mongodb.com/) (using Mongoose ODM) with connection pooling and session storage via `connect-mongo`.
2. **File Storage:** [Cloudinary](https://cloudinary.com/) (Multer Integration) to store user photos, excel sheets, and files.
3. **SMS Service:** [Twilio](https://www.twilio.com/) used to send daily automated shift pump duty schedules to staff members.
4. **Email Client:** [Nodemailer](https://nodemailer.com/) (SMTP Gmail) for sending secure OTP codes for password recovery.
5. **Autoscheduling:** `node-cron` triggers dynamic cron jobs according to administrative settings stored in the database.

---

## 🔑 Environment Variables (.env Configuration)

For security, credentials are not committed to git. Create a `.env` file in the `Backend/` directory with the following variables:

| Variable Name | Description | Example / Syntax |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://username:password@cluster...` |
| `JWT_SECRET` | Secret key for signing Auth JWT tokens | `any_strong_random_string` |
| `JWT_EXPIRE` | Expiry duration for JWT tokens | `7d` (7 days) |
| `SESSION_SECRET` | Secret key for express session encryption | `your_session_secret` |
| `NODE_ENV` | Environment context | `development` or `production` |
| `PORT` | Listening port for Express Backend | `5500` |
| `EMAIL_USER` | Gmail address for sending OTP emails | `example@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (not account password) | `abcd efgh ijkl mnop` |
| `VALID_INVITATION_CODES` | Allowed register codes for normal members | `SANGHI@2025,XYZ123456` |
| `VALID_INVITATION_CODES_FOR_STAFF` | Allowed register codes for staff members | `ABCD2025,STAFF2025` |
| `CLOUD_NAME` | Cloudinary Storage Account Name | `dvgzuzzsn` |
| `CLOUD_API_KEY` | Cloudinary API Key credential | `294445521664239` |
| `CLOUD_API_SECRET` | Cloudinary API Secret credential | `uwOnDRFxsFQKDJK-2g3y...` |
| `TWILIO_SID` | Twilio Account SID identifier | `AC993d1ec041f112...` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token credential | `225c7a14bcb7d...` |
| `TWILIO_PHONE_NUMBER` | Purchased Twilio virtual phone number | `+14784124261` |
| `GMAIL` | SuperAdmin login email fallback | `superadmin@gmail.com` |
| `PASSWORD` | SuperAdmin login password fallback | `AdminPasswordPass` |

---

## 📦 Database Schemas & Data Model

All Mongoose schemas are stored inside the [Backend/models](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Backend/models) directory. Here are the core data model specifications:

### 1. User (`models/user.js`)
Stores user profiles, roles/departments, password hashes, and OTP reset details.
* **Fields:** `name`, `username`, `email`, `phone`, `password` (bcrypt), `department` (manager, backoffice, accounts/finance, staff), `otp`, `otpExpires`, `photo` (avatar URL/base64), `aadhaar`, `designation`, `salary`, `joiningDate`.

### 2. Attendance (`models/attendancewala/Attendance.js`)
Tracks employee check-ins daily.
* **Fields:** `userId` (references User), `date` (YYYY-MM-DD), `status` (Present, Absent, Leave, Holiday, WFH).
* **Constraints:** Compound unique index on `{ userId: 1, date: 1 }`.

### 3. Shift Mapping Snapshot (`models/shifting/MapSnapshot.js`)
Maintains nozzle assignment details mapped during a specific date and shift.
* **Fields:** `date`, `shift` (Morning, Evening), `assignments` (map containing assignments for Nozzle 1-6, Supervisor, Air boy, Extra, Absent list), `caption`.

### 4. SMS Bot Settings (`models/shifting/Settings.js`)
Specifies active schedule times for SMS shift notifications.
* **Fields:** `morningTime` (Default: "05:00"), `eveningTime` (Default: "14:00").

### 5. Sales & Ledger Models
* **`models/pumpreport.js`**: Fuel pump report logging fuel transactions, tank levels, stock status.
* **`models/meterclose.js`**: Nozzle closing readings, sale liters, and density values per nozzle.
* **`models/lekha.js`**: General accounts ledger accounting entries (Lekha Jokha tracker).
* **`models/SalePaytm.js`**: Records Paytm sales logs.
* **`models/cashslipmodal.js`**: Cashier cash slips.

---

## 🤖 Shift Duty Scheduler & SMS Bot

The automated shift scheduler is located at [smsBot.js](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Backend/models/shifting/smsBot.js).

### How it works:
1. When the backend server boots up ([server.js](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Backend/server.js)), `restartScheduler()` is triggered.
2. It queries the `Settings` collection for the active `morningTime` and `eveningTime` rules.
3. Using the `node-cron` engine, it schedules two cron jobs dynamically in the `Asia/Kolkata` timezone.
4. When the cron fires, `sendShiftReport(shiftName)`:
   - Fetches the active `MapSnapshot` matching the current date and shift.
   - Formats a custom layout message listing assignments (e.g., Nozzle 1: Employee A, Supervisor: Employee B).
   - Iterates through the list of users in the `Members` collection and sends a personalized SMS broadcast via Twilio API.
5. If the manager updates the schedule times via the UI, `restartScheduler()` is executed again to clear previous cron jobs and apply new schedules dynamically.

---

## 🔐 Authentication, Authorization & Roles

* **SuperAdmin Panel:** Log in using the email/password defined by `GMAIL` and `PASSWORD` in the `.env` file. SuperAdmins possess global database editing capabilities.
* **Departments & Permissions:** Users select their department during registration:
  - **Manager / Backoffice:** Access to mastersheet inputs, shifting settings, nozzle allocations, and scheduling configurations.
  - **Accounts / Finance:** Comprehensive financial ledger inputs, Lekhajokha, bank flow reports (SB01, SB03 summaries).
  - **Staff:** Restricted dashboard displays, self attendance summaries, shift assignments lookup.
* **Registration Invitation Codes:** Users can only register if they provide a valid invitation code configured in the environment:
  - **Member/Manager/Backoffice Codes:** `SANGHI@2025`, `XYZ123456`, `COMPANY2025` (set in `VALID_INVITATION_CODES` env variable)
  - **Field Workers/Staff Codes:** `ABCD2025`, `STAFF2025` (set in `VALID_INVITATION_CODES_FOR_STAFF` env variable)

---

## 🛠️ Key API Handpoints (Endpoints Summary)

The backend routing layout handles multiple core domains:

| Endpoint Path | Method | Router File | Authentication | Description |
| :--- | :---: | :--- | :---: | :--- |
| `/login` | `POST` | `loginsignup.js` | Public | Standard email/phone & password login |
| `/signup` | `POST` | `loginsignup.js` | Public | Registrations with invitation code validation |
| `/verify-invite` | `POST` | `loginsignup.js` | Public | Validates invitation codes |
| `/forgot-password`| `POST` | `loginsignup.js` | Public | Password reset OTP request & verification |
| `/profile` | `GET/PUT`| `loginsignup.js` | JWT Cookie/Header| Fetch and update personal user profile |
| `/bank/sbi01` | Router | `sbo3flow.js` | JWT Cookie/Header| Bank inflow & outflow records (SBI01 section) |
| `/mastersheet/*` | Router | `/routes/mastersheet/*` | JWT Cookie/Header| Master checklists, purchases, lubricants, tank lorry logs |
| `/meterclose` | Router | `metercloseroute.js` | JWT Cookie/Header| Daily nozzle meter close calculations |
| `/newlekhajokha` | Router | `routelekhajokha.js` | JWT Cookie/Header| General accounting transactions (Lekha Jokha) |

---

## 🚢 Production Deployment Guide

### 1. Frontend Web App Deployment (Vercel)
The React application is fully configured for Vercel deployment.
1. Make sure you are in the `/Frontend` directory.
2. Ensure you have the `vercel.json` routing configuration setup to prevent `404 Not Found` issues when refreshing nested pages.
3. Configure the **Build Command** as: `npm run build`
4. Configure the **Output Directory** as: `dist`
5. Set environment variables if needed (such as custom Google Client ID).

### 2. Backend Server Deployment (Render / Railway / Cloud VPS)
To deploy the backend API server:
1. Set the root folder of the deploy service to `/Backend`.
2. Configure **Start Command** as: `npm run start` (uses `node server.js`).
3. Set the environment variables listed in the **Environment Variables** table in your cloud service configuration interface.
4. Ensure the port binding (usually defined by `process.env.PORT`) is open to public incoming traffic.
5. Set the domain name of your backend service inside the Frontend configuration code (e.g. your axios instance base URL) and white-list the Vercel domain in the CORS middleware inside `Backend/server.js`.

---

## 👨‍💻 Code Maintenance & Enhancement Guidelines

If you are a developer taking over the development of this codebase, keep the following principles in mind:
* **Route Protection:** Use the `authenticateUser` or `verifyToken` middleware in the route file to secure API endpoints.
* **Component Modularity:** Reusable UI components (like dates selectors, tables, inputs) should be added to the [Frontend/src/components](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Frontend/src/components) subdirectory.
* **State Management:** Core user state (such as login tokens, credentials, avatar info) is wrapped in the [UserContext.jsx](file:///e:/Products/Project%20Files/Products/SanghiBrothers/Frontend/src/components/Home%20Page/UserContext.jsx) React Context Provider. Ensure any route accessing profile data remains nested under this provider context.
* **Database Updates:** When modifying existing Mongoose schemas, ensure migrations are handled or field default values are configured correctly so existing records do not throw runtime validation errors.
