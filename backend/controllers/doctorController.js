const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const { parseISO, format, addMinutes, isWithinInterval } = require("date-fns");

// Get all doctors
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get available slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: "Date is required" });

        const doctor = await Doctor.findById(id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        const appointments = await Appointment.find({
            doctorId: id,
            date: { $gte: new Date(date), $lt: new Date(date + "T23:59:59.999Z") }
        });

        const slots = [];
        let currentTime = parseISO(`${date}T${doctor.workingHours.start}:00`);
        const endTime = parseISO(`${date}T${doctor.workingHours.end}:00`);

        while (currentTime < endTime) {
            const slotEnd = addMinutes(currentTime, 30);
            const isBooked = appointments.some((appt) =>
                isWithinInterval(currentTime, { start: appt.date, end: addMinutes(appt.date, appt.duration) })
            );

            if (!isBooked) {
                slots.push(format(currentTime, "HH:mm"));
            }
            currentTime = slotEnd;
        }

        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
