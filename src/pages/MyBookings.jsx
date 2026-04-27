import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaUsers, FaBed, FaBath, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(bookingId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: '#00A699', bg: '#E8F7F5', text: 'Confirmed' },
      cancelled: { color: '#FF5A5F', bg: '#FFF5F5', text: 'Cancelled' },
      completed: { color: '#222', bg: '#F7F7F7', text: 'Completed' },
      pending: { color: '#FC642D', bg: '#FFF5EB', text: 'Pending' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>
      <p style={styles.subtitle}>Manage your upcoming and past stays</p>
      
      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏠</div>
          <h3 style={styles.emptyTitle}>No bookings yet</h3>
          <p style={styles.emptyText}>Start exploring and book your first stay!</p>
          <Link to="/browse" style={styles.browseButton}>
            Browse Properties
          </Link>
        </div>
      ) : (
        <div style={styles.bookingsList}>
          {bookings.map(booking => (
            <div key={booking._id} style={styles.bookingCard}>
              <div style={styles.bookingImage}>
                <img 
                  src={booking.propertyImage?.startsWith('http') ? booking.propertyImage : `${API_URL}${booking.propertyImage}`}
                  alt={booking.propertyTitle}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x150?text=Property';
                  }}
                />
              </div>
              
              <div style={styles.bookingDetails}>
                <div style={styles.bookingHeader}>
                  <h3 style={styles.propertyTitle}>{booking.propertyTitle}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                
                <p style={styles.propertyLocation}>
                  <FaMapMarkerAlt style={styles.icon} /> {booking.propertyLocation}
                </p>
                
                <div style={styles.details}>
                  <span><FaCalendarAlt style={styles.icon} /> {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                  <span><FaUsers style={styles.icon} /> {booking.guests} guests</span>
                  <span><FaBed style={styles.icon} /> {booking.bedrooms} beds</span>
                  <span><FaBath style={styles.icon} /> {booking.bathrooms} baths</span>
                </div>
                
                <div style={styles.priceSection}>
                  <div>
                    <span style={styles.totalPrice}>₹{booking.totalPrice}</span>
                    <span style={styles.totalLabel}> total</span>
                  </div>
                  <div style={styles.priceBreakdown}>
                    ₹{booking.pricePerNight} × {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                  </div>
                </div>
                
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancelling === booking._id}
                    style={styles.cancelButton}
                  >
                    <FaTimes /> {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '48px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: 'calc(100vh - 200px)'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #222',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#717171',
    marginBottom: '32px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#F7F7F7',
    borderRadius: '12px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#222',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '24px'
  },
  browseButton: {
    display: 'inline-block',
    padding: '12px 32px',
    backgroundColor: '#222',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '500'
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  bookingCard: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    border: '1px solid #EBEBEB',
    borderRadius: '12px',
    overflow: 'hidden',
    padding: '20px'
  },
  bookingImage: {
    width: '200px',
    flexShrink: 0
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  bookingDetails: {
    flex: 1
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  propertyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#222',
    margin: 0
  },
  propertyLocation: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#717171'
  },
  icon: {
    marginRight: '6px',
    fontSize: '12px'
  },
  priceSection: {
    marginBottom: '16px'
  },
  totalPrice: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#222'
  },
  totalLabel: {
    fontSize: '14px',
    color: '#717171'
  },
  priceBreakdown: {
    fontSize: '13px',
    color: '#717171',
    marginTop: '4px'
  },
  cancelButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    border: '1px solid #FF5A5F',
    color: '#FF5A5F',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px'
  }
};

export default MyBookings;