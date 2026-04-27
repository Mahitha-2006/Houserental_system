import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FaCheckCircle style={styles.icon} />
        <h1 style={styles.title}>Booking Confirmed!</h1>
        <p style={styles.message}>
          Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
        </p>
        
        {booking && (
          <div style={styles.bookingInfo}>
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>Property:</strong> {booking.propertyTitle}</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹{booking.totalPrice}</p>
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <Link to="/my-bookings" style={styles.bookingsButton}>
            View My Bookings
          </Link>
          <Link to="/browse" style={styles.browseButton}>
            Browse More Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#F7F7F7'
  },
  card: {
    maxWidth: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  icon: {
    fontSize: '64px',
    color: '#00A699',
    marginBottom: '20px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '16px'
  },
  message: {
    fontSize: '16px',
    color: '#717171',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  bookingInfo: {
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  bookingsButton: {
    padding: '12px 24px',
    backgroundColor: '#222',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500'
  },
  browseButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#222',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    border: '1px solid #ddd'
  }
};

export default BookingSuccess;