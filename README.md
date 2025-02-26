# 🏥 BabySteps Appointment Booking System

## 📌 Overview
The **BabySteps Appointment Booking System** is a full-stack application for scheduling prenatal care appointments. Built using **Node.js/Express (backend), MongoDB (database), and React (frontend)**, the system allows users to:

✅ View doctors and their available time slots.
✅ Book appointments without conflicts.
✅ Manage appointments (view, update, cancel).

## 🛠️ Tech Stack
- **Frontend:** React, React Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Libraries:** date-fns, axios

## 🚀 Features
- **Doctor Selection**: View available doctors.
- **Dynamic Slot Calculation**: Compute available time slots based on working hours and existing bookings.
- **Appointment Booking**: Book an appointment with validation.
- **Appointment Management**: View, edit, and cancel appointments.
- **Error Handling**: Proper validation and error messages.

## 📂 Folder Structure
```
📁 babysteps-app
 ┣ 📂 backend
 ┃ ┣ 📜 server.js
 ┃ ┣ 📂 models
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 middleware
 ┣ 📂 frontend
 ┃ ┣ 📜 App.js
 ┃ ┣ 📂 components
 ┃ ┣ 📂 pages
 ┃ ┣ 📂 services
 ┗ 📜 README.md
```

## ⚙️ Installation & Setup
### Clone the Repository
```sh
git clone https://github.com/yourusername/babysteps-appointment.git
cd babysteps-appointment
```

### Backend Setup
```sh
cd backend
npm install
npm start
```
- The backend runs on `http://localhost:5000`.

### Frontend Setup
```sh
cd frontend
npm install
npm start
```
- The frontend runs on `http://localhost:3000`.

## 📡 API Endpoints
### 👩‍⚕️ Doctor API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Retrieve all doctors |
| GET | `/doctors/:id/slots?date=YYYY-MM-DD` | Get available slots |

### 📅 Appointment API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | Retrieve all appointments |
| GET | `/appointments/:id` | Get appointment details |
| POST | `/appointments` | Book an appointment |
| PUT | `/appointments/:id` | Update an appointment |
| DELETE | `/appointments/:id` | Cancel an appointment |

## 🛡️ Validation & Error Handling
- Ensures no overlapping appointments.
- Handles invalid date formats.
- Gracefully handles server errors.

## 🎯 Future Enhancements
🔹 Real-time updates for slot availability.
🔹 Improved UI with a third-party calendar.
🔹 Email notifications for appointments.

## 📜 License
This project is open-source under the [MIT License](LICENSE).

