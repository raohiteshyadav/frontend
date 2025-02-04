import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home'; 
import ServiceRequestForm from './components/ServiceRequestForm';
import IncidentRequestForm from './components/IncidentRequestForm';
import ServiceRequestApproval from './components/ItHead';

function App() {
  return (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />} /> 
        <Route path="/service-request" element= {<ServiceRequestForm/>}/>
        <Route path="/incident-request" element={<IncidentRequestForm/>}/>
        <Route path="/approve" element={<ServiceRequestApproval/>}/>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
