import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/profile';
import Browse from './pages/Browse';
import PropertyDetails from './pages/PropertyDetails';
import PropertyRentals from './pages/PropertyRentals';
import CreateListing from './pages/CreateListing';
import ServiceExplore from './pages/ServiceExplore';
import NearbyServices from './pages/NearbyServices';
import PayRent from './pages/PayRent';
import MyRentals from './pages/MyRentals';
import Wishlist from './pages/Wishlist';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import TestPage from './pages/TestPage';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import BookingSuccess from './pages/BookingSuccess';


// Import location pages
import HyderabadProperties from './pages/locations/HyderabadProperties';
import BengaluruProperties from './pages/locations/BengaluruProperties';
import MumbaiProperties from './pages/locations/MumbaiProperties';
import PuneProperties from './pages/locations/PuneProperties';
import GoaProperties from './pages/locations/GoaProperties';
import ChennaiProperties from './pages/locations/ChennaiProperties';
import VizagProperties from './pages/locations/VizagProperties';
import MysoreProperties from './pages/locations/MysoreProperties';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/rentals" element={<PropertyRentals />} />
            <Route path="/services" element={<ServiceExplore />} />
            <Route path="/nearby/:id" element={<NearbyServices />} />
            <Route path="/test" element={<TestPage />} />
            
            {/* Location Routes */}
            <Route path="/hyderabad" element={<HyderabadProperties />} />
            <Route path="/bengaluru" element={<BengaluruProperties />} />
            <Route path="/mumbai" element={<MumbaiProperties />} />
            <Route path="/pune" element={<PuneProperties />} />
            <Route path="/goa" element={<GoaProperties />} />
            <Route path="/chennai" element={<ChennaiProperties />} />
            <Route path="/vizag" element={<VizagProperties />} />
            <Route path="/mysore" element={<MysoreProperties />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/booking" element={
  <ProtectedRoute>
    <Booking />
  </ProtectedRoute>
} />
<Route path="/my-bookings" element={
  <ProtectedRoute>
    <MyBookings />
  </ProtectedRoute>
} />
<Route path="/bookings/success" element={
  <ProtectedRoute>
    <BookingSuccess />
  </ProtectedRoute>
} />
            
            {/* Protected Routes - Require Login */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/create-listing" element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/my-rentals" element={
              <ProtectedRoute>
                <MyRentals />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/pay-rent/:id" element={
              <ProtectedRoute>
                <PayRent />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// NotFound Component
function NotFound() {
  return (
    <div style={{textAlign: 'center', padding: '80px 20px', minHeight: '60vh'}}>
      <h1 style={{fontSize: '48px', marginBottom: '20px'}}>404 - Page Not Found</h1>
      <p style={{fontSize: '18px', color: '#666', marginBottom: '30px'}}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#667eea',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px'
      }}>Go Back Home</a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;