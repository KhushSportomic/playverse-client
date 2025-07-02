import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate, // Add Navigate for redirection
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EventDetails from "./components/EventDetails";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignUpPage";
import ContactUs from "./pages/ContactUs";
import DownloadExcel from "./components/DownloadExcel";
import { Analytics } from "@vercel/analytics/react";
import AdminDashboard from "./pages/AdminDashboard";
import HeaderAdmin from "./components/HeaderAdmin";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { AdminProvider, useAdmin } from "./contexts/AdminContext.jsx"; // Add useAdmin to imports
import ProtectedRoute from "./components/ProtectedRoute";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics.js";
import Inquiries from "./components/Inquiries.jsx";
import VenueManagement from "./pages/VenueManagement.jsx";
import VenueDetailsPage from "./pages/VenueDetailsPage.jsx";
import RefundEvents from "./pages/RefundEvents";

// Component to handle login route redirection
const PrivateLoginRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while verifying token
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />; // Redirect to /admin if logged in
  }

  return children; // Render login page if not logged in
};

const HeaderWrapper = () => {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/add-event" ||
    location.pathname === "/download" ||
    location.pathname === "/venues" ||
    location.pathname === "/inquiries";
  return isAdminRoute ? <HeaderAdmin /> : <Header />;
};

// Create a new component to handle analytics
const AppContent = () => {
  useGoogleAnalytics();

  return (
    <>
      <HeaderWrapper />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/" element={<Events />} />
          <Route path="/event/:slug" element={<EventDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={
              <PrivateLoginRoute>
                <Login />
              </PrivateLoginRoute>
            }
          />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-event"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/download"
            element={
              <ProtectedRoute>
                <DownloadExcel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inquiries"
            element={
              <ProtectedRoute>
                <Inquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/venues"
            element={
              <ProtectedRoute>
                <VenueManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/venue/:venueId"
            element={
              <ProtectedRoute>
                <VenueDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refunds"
            element={
              <ProtectedRoute>
                <RefundEvents />
              </ProtectedRoute>
            }
          />

          {/* Optional: Catch-all route */}
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </>
  );
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminProvider>
  );
}

export default App;
