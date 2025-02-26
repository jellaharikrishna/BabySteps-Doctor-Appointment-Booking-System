const mongoose = require("mongoose");

// Enum for duration (Allowed durations in minutes)
const durationEnum = [30, 45, 60];

// Enum for appointment types
const appointmentTypeEnum = [
    "Routine Check-Up",
    "Ultrasound",
    "Consultation",
    "Vaccination",
    "Therapy",
    "Prenatal Screening",
    "Postnatal Care",
    "Blood Test",
    "Nutritional Counseling",
    "Physical Therapy"
];


const AppointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true}, 
    date: { type: Date, required: true },
    duration: { type: Number, enum: durationEnum, required: true},
    appointmentType: { type: String, enum: appointmentTypeEnum, required: true},
    patientName: { type: String, required: true },
    notes: { type: String }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
