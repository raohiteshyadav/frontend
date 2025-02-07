import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ServiceRequestForm from "./components/ServiceRequestForm";
import IncidentRequestForm from "./components/IncidentRequestForm";
import ServiceRequestApproval from "./components/ItHead";
import Dashboard from "./components/dashboard";
import Navbar from "./components/Navbar";
import Raise from "./components/Raise";
import Login from "./components/login";
import AppProviders from "./providers/appProvider";
import { AuthProvider } from "./providers/authProvider";
import ContactUs from "./components/contactus";

function App() {
  return (
    <Router>
      <AppProviders>
        <AuthProvider>
          <div className="App">
        <Navbar />
        <div >
          <Routes>
            <Route path="/raise-a-ticket" element={<Raise/>} />
            <Route path="/service-request" element={<ServiceRequestForm />} />
            <Route path="/incident-request" element={<IncidentRequestForm />} />
            <Route path="/approve" element={<ServiceRequestApproval />} />
            <Route path="/" element={<Dashboard/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/contact" element={<ContactUs/>} />
          </Routes>
        </div>
      </div>
        </AuthProvider>
      </AppProviders>
      
    </Router>
  );
}

export default App;
