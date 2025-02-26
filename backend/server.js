require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const doctorRoutes = require("./routes/doctorRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")
const Doctor = require("./models/doctorModel");


const app = express()
const PORT = process.env.PORT || 5500; 
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'

app.use(cors())

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// routes
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);


const doctors = [
   { name: "Dr. Emily Carter", workingHours: { start: "09:00", end: "17:00" }, specialization: "Obstetrics & Gynecology" },
   { name: "Dr. James Anderson", workingHours: { start: "08:00", end: "16:00" }, specialization: "Pediatrics" },
   { name: "Dr. Sophia Patel", workingHours: { start: "10:00", end: "18:00" }, specialization: "Cardiology" },
   { name: "Dr. Michael Chen", workingHours: { start: "07:30", end: "15:30" }, specialization: "Orthopedics" },
   { name: "Dr. Olivia Martinez", workingHours: { start: "11:00", end: "19:00" }, specialization: "Neurology" },
   { name: "Dr. William Thompson", workingHours: { start: "08:30", end: "16:30" }, specialization: "Dermatology" },
   { name: "Dr. Ava Rodriguez", workingHours: { start: "09:30", end: "17:30" }, specialization: "Endocrinology" },
   { name: "Dr. Daniel Lee", workingHours: { start: "07:00", end: "15:00" }, specialization: "General Surgery" },
   { name: "Dr. Isabella Singh", workingHours: { start: "10:30", end: "18:30" }, specialization: "Psychiatry" },
   { name: "Dr. Henry Wilson", workingHours: { start: "12:00", end: "20:00" }, specialization: "Urology" }
];

// mongoDB connection
mongoose.connect(MONGO_URL)
   .then(async () => {
      console.log('MongoDB connected...');

      const doctorsList = await Doctor.find();
      if (doctorsList.length === 0){
         return await Doctor.insertMany(doctors)
      }
})
   .catch(err => console.error("MongoDB connection error:", err))

// server connection
app.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));