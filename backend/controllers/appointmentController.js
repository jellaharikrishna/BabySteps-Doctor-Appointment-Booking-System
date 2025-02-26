const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("doctorId", "name");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
};
 
// Get specific appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id).populate("doctorId", "name");

        if (!appointment) return res.status(404).json({ error: "Appointment not found" });

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Create an new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
        console.log(req.body)
        
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        const newAppointment = new Appointment({ doctorId, date, duration, appointmentType, patientName, notes });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


// UPDATE an existing appointment
exports.updateAppointment = async (req, res) => {
    try {
        const { date, duration, appointmentType, patientName, notes } = req.body;
        const appointmentId = req.params.id;

        // Find the appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });


        // Find the doctor
        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        // Update appointment details
        appointment.date = date;
        appointment.duration = duration;
        appointment.appointmentType = appointmentType;
        appointment.patientName = patientName;
        appointment.notes = notes;

        await appointment.save();
        res.status(200).json(appointment);
    } catch (error) {
        console.error("Update Appointment Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};


// DELETE an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });

        await appointment.deleteOne();
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};