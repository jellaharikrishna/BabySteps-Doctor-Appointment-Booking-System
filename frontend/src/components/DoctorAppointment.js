import React, { useState, useEffect } from "react";
import {Row, Col, Card, Form, Button, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const durationList = [30, 45, 60];

const appointmentTypeList = [
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

const DoctorAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [formData, setFormData] = useState({ patientName: "", duration: "", appointmentType: "", notes: "" });
    const [editAppointment, setEditAppointment] = useState(null);
    const [viewAppointment, setViewAppointment] = useState(null);

    const url = 'https://babysteps-doctor-appointment-booking.onrender.com'

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${url}/doctors`);
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${url}/appointments`);
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    const handleDoctorSelect = async (doctorId) => {
        const doctor = doctors.find(doc => doc._id === doctorId);
        setSelectedDoctor(doctor);
    };

    const handleDateSelect = async (date) => {
        setSelectedDate(date);
        try {
            const response = await axios.get(`${url}/doctors/${selectedDoctor._id}/slots?date=${date}`);
            setAvailableSlots(response.data);
            toast.success("fetching slots")
        } catch (error) {
            toast.error("Error fetching slots", error)
            console.error("Error fetching slots", error);
        }
    };


    const handleBookingSubmit = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.error("Please select both date and time.")
            return;
        }
        const combinedDateTime = new Date(`${selectedDate}T${selectedSlot}:00.000Z`);
        const isoDateTime = combinedDateTime.toISOString();

        try {
        if (editAppointment) {
            // Update existing appointment
            await axios.put(`${url}/appointments/${editAppointment._id}`, {
                date: isoDateTime,
                duration: formData.duration,
                appointmentType: formData.appointmentType,
                patientName: formData.patientName,
                notes: formData.notes,
            });
            toast.success("Appointment updated Successfully!");
        } else {
            // Create new appointment
            const response = await axios.post(`${url}/appointments`, {
                doctorId: selectedDoctor,
                date: isoDateTime,
                duration: formData.duration,
                appointmentType: formData.appointmentType,
                patientName: formData.patientName,
                notes: formData.notes,
            });
            setAppointments([...appointments, response.data]);
            toast.success("New Appointment Created Successfully!");
        }
        fetchAppointments();
        setShowModal(false);
        setEditAppointment(null);
    } catch (error) {
        toast.error("Error booking/updating appointment", error)
        console.error("Error booking/updating appointment", error);
    }
    };

    const openForm = (appointment = null) => {
        setShowModal(true);
        if (appointment) {
            setEditAppointment(appointment);
            setSelectedDate(appointment.date.split("T")[0]);
            setSelectedSlot(appointment.date.split("T")[1].split(":00.000Z")[0]);
            setFormData({
                patientName: appointment.patientName,
                duration: appointment.duration,
                appointmentType: appointment.appointmentType,
                notes: appointment.notes
            });
        } else {
            setEditAppointment(null);
            setSelectedDoctor(null);
            setSelectedDate("");
            setSelectedSlot("");
            setFormData({ patientName: "", duration: "", appointmentType: "", notes: "" });
        }
    }

    const openViewModal = (appointment) => {
        setViewAppointment(appointment);
        setViewModal(true);
    };

    const deleteAppointment = async (id) => {
        if (window.confirm("Are you sure you want to delete the appointment?")){
            try {
                let res = await axios.delete(`${url}/appointments/${id}`);
                if (res){
                  toast.success("Appointment Deleted Successfully!");
                  fetchAppointments();
                }
              } catch (err) {
                toast.error("Error deleting appointment:", err);
                console.error("Error deleting appointment:", err);
            }
        }
    }
    

    return (
        <div className="mt-4">
             <div style={{display: "flex", alignItems: "center"}}>
            <Col>
                <Col md={6} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Select a Doctor</Card.Title>
                            <Form.Select onChange={(e) => handleDoctorSelect(e.target.value)}>
                                <option>Select Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </Form.Select>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Select a Date</Card.Title>
                            <Form.Control type="date" onChange={(e) => handleDateSelect(e.target.value)} />
                        </Card.Body>
                    </Card>
                </Col>
            </Col>
            <div>
               <img style={{ width: "300px", height: "300px"}} src="https://res.cloudinary.com/dmogabwqz/image/upload/v1740539287/3914790_x2xtr8.jpg" alt="img" />
            </div>
            </div>
            {selectedDate && availableSlots.length > 0 && (
                <Row className="mt-3">
                    <Col>
                        <h4>Available Slots</h4>
                        <div className="d-flex flex-wrap gap-2">
                            {availableSlots.map((slot, index) => (
                                <Button key={index} variant="outline-success" onClick={() => { setSelectedSlot(slot); setShowModal(true); }}>
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editAppointment ? 'Edit Appointment' : 'Book Appointment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Select a Time Slot</Form.Label>
                            <Form.Control type="text" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Select a Duration</Form.Label>
                            <Form.Select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                               <option value="">Select duration</option> 
                                {durationList.map(eachDuration => (
                                    <option key={eachDuration} value={eachDuration}>{eachDuration}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Select an Appointment Type</Form.Label>
                            <Form.Select value={formData.appointmentType} onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}>
                                <option value="">Appointment type</option>
                                {appointmentTypeList.map(eachType => (
                                    <option key={eachType} value={eachType}>{eachType}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Patient Name</Form.Label>
                            <Form.Control value={formData.patientName} placeholder="Enter patient name" type="text" onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control value={formData.notes}  placeholder="Enter notes" as="textarea" rows={3} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleBookingSubmit}>{editAppointment ? 'Update Booking' : 'Confirm Booking'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={viewModal} onHide={() => setViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>View Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewAppointment && (
                        <>
                            <p><strong>DoctorId:</strong> {viewAppointment.doctorId._id}</p>
                            <p><strong>Doctor:</strong> {viewAppointment.doctorId.name}</p>
                            <p><strong>Date:</strong> {viewAppointment.date.split("T")[0]}</p>
                            <p><strong>Time:</strong> {viewAppointment.date.split("T")[1].split(":00.000Z")[0]}</p>
                            <p><strong>Duration:</strong> {viewAppointment.duration}</p>
                            <p><strong>Appointment Type:</strong> {viewAppointment.appointmentType}</p>
                            <p><strong>Patient Name:</strong> {viewAppointment.patientName}</p>
                            <p><strong>Notes:</strong> {viewAppointment.notes}</p>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {appointments.length !== 0 ?
            <Row className="mt-4">
                <Col>
                    <h4>Upcoming Appointments</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Doctor Id</th>
                                <th>Doctor Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Duration</th>
                                <th>Type</th>
                                <th>Patient Name</th>
                                <th>Notes</th>
                                <th style={{width: "200px"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.doctorId._id}</td>
                                    <td>{appointment.doctorId.name}</td>
                                    <td>{appointment.date.split("T")[0]}</td>
                                    <td>{appointment.date.split("T")[1].split(":00.000Z")}</td>
                                    <td>{appointment.duration}</td>
                                    <td>{appointment.appointmentType}</td>
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.notes}</td>
                                    <td>
                                        <Button onClick={() => openViewModal(appointment)} variant="info" size="sm m-1">View</Button>
                                        <Button onClick={() => openForm(appointment)} variant="warning" size="sm m-1">Edit</Button>
                                        <Button onClick={() => deleteAppointment(appointment._id)} variant="danger" size="sm m-1">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            :
            <h1 className="m-5 text-center">appointments list is empty...</h1>
            }
        </div>
    );
};

export default DoctorAppointment;
