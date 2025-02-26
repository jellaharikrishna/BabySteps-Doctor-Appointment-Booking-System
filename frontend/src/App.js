import React from 'react'
import {Container} from "react-bootstrap";
import DoctorAppointment from "./components/DoctorAppointment";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => (
  <Container>
      <ToastContainer position="top-right" autoClose={4000} />
      <h1 className="my-3 mb-5 text-center">Doctor Appointment Booking System</h1>
      <DoctorAppointment />
  </Container>
)

export default App