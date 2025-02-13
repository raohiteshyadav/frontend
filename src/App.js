import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { AuthProvider, useAuth } from "./providers/authProvider";
import AppProviders from "./providers/appProvider";
import previewhead from "./components/previewhead";
import PreviewHead from "./components/previewhead";
import PreviewSerIt from "./components/previewserit";
import DashboardIt from "./components/dashboardit";
import PreviewIncSerIt from "./components/previewincserit";
import Footer from "./components/footer";

// Lazy loading components
const ServiceRequestForm = lazy(() =>
  import("./components/ServiceRequestForm")
);
const IncidentRequestForm = lazy(() =>
  import("./components/IncidentRequestForm")
);
const Dashboard = lazy(() => import("./components/dashboard"));
const Navbar = lazy(() => import("./components/Navbar"));
const Raise = lazy(() => import("./components/Raise"));
const Login = lazy(() => import("./components/login"));
const ContactUs = lazy(() => import("./components/contactus"));
const Approval = lazy(() => import("./components/Approval"));

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useAuth();
  if (!user) {
    return (
      <Box width="full">
        <Text color="red">Access Denied: User is not logged in</Text>
      </Box>
    );
  }
  if (!allowedRoles.includes(user.role)) {
    return (
      <Box width={"full"}>
        <Text color={"red"}>You don't have permission</Text>
      </Box>
    );
  }

  return children;
};
function App() {
  return (
    <Router>
      <AppProviders>
        <AuthProvider>
          <Suspense
            fallback={
              <Box
                width="full"
                height="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner
                  size="xl"
                  thickness="4px"
                  speed="0.65s"
                  color="blue.500"
                />
              </Box>
            }
          >
            <div className="App">
              <Navbar />
              <div>
                <Routes>
                  <Route
                    path="/service-request-form/:id"
                    element={<PreviewHead />}
                  />
                  <Route
                    path="/service-request-form-it/:id"
                    element={<PreviewSerIt />}
                  />
                   <Route
                    path="/service-request-form-dept/:id"
                    element={< PreviewIncSerIt />}
                  />
                  <Route path="/raise-a-ticket" element={<Raise />} />
                  <Route
                    path="/service-request"
                    element={<ServiceRequestForm />}
                  />
                  <Route
                    path="/incident-request"
                    element={<IncidentRequestForm />}
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute allowedRoles={["it"]}>
                        <DashboardIt />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route
                    path="/approval"
                    element={
                      <ProtectedRoute allowedRoles={["head", "IT", "admin"]}>
                        <Approval />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
            <Footer/>
          </Suspense>
        </AuthProvider>
      </AppProviders>
    </Router>
  );
}

export default App;
