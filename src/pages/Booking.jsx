import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaCalendarAlt, FaUsers, FaBed, FaBath, FaCreditCard, FaMobile, 
  FaUniversity, FaArrowLeft, FaWifi, FaParking, FaUtensils, FaTv, 
  FaSnowflake, FaQrcode, FaCoffee, FaRegCreditCard, FaShieldAlt,
  FaClock, FaMoneyBillWave, FaWhatsapp, FaCopy, FaCheck
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

// YOUR OWN UPI DETAILS - UPDATE THESE
const YOUR_UPI_ID = '8247543654@ibl'; // Replace with your UPI ID
const YOUR_UPI_NAME = 'Mahitha'; // Replace with your name
const YOUR_QR_CODE_PATH = '/assets/images/upi-qr.png';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUpiScanner, setShowUpiScanner] = useState(false);
  const [upiPaymentStatus, setUpiPaymentStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'card',
    specialRequests: '',
    upiId: YOUR_UPI_ID
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const propertyData = location.state?.property;
    if (!propertyData) {
      navigate('/browse');
      return;
    }

    setProperty(propertyData);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setBooking(prev => ({
      ...prev,
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
      upiId: YOUR_UPI_ID
    }));
    
    setLoading(false);
  }, [location, isAuthenticated, navigate]);

  const calculateNights = () => {
    if (booking.checkIn && booking.checkOut) {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const calculateTotal = () => {
    if (!property) return 0;
    const nights = calculateNights();
    const subtotal = property.price * nights;
    const cleaningFee = property.cleaningFee || 700;
    const serviceFee = property.serviceFee || 350;
    return subtotal + cleaningFee + serviceFee;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!booking.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!booking.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (new Date(booking.checkIn) >= new Date(booking.checkOut)) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }
    if (booking.guests < 1) newErrors.guests = 'At least 1 guest required';
    if (!booking.paymentMethod) newErrors.paymentMethod = 'Payment method required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/120x80?text=Property';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets')) return `${API_URL}${imagePath}`;
    return `${API_URL}/assets/images/${imagePath}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const proceedWithBooking = async () => {
    if (!validateForm()) return;
    if (!property) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);

    const nights = calculateNights();
    const subtotal = property.price * nights;
    const cleaningFee = property.cleaningFee || 700;
    const serviceFee = property.serviceFee || 350;
    const totalPrice = subtotal + cleaningFee + serviceFee;

    let imageUrl = '';
    if (property.images && property.images.length > 0) {
      imageUrl = getImageUrl(property.images[0]);
    } else if (property.image) {
      imageUrl = getImageUrl(property.image);
    } else {
      imageUrl = 'https://via.placeholder.com/400x300?text=Property';
    }

    const bookingData = {
      propertyId: property.id || property._id,
      propertyTitle: property.title,
      propertyImage: imageUrl,
      propertyLocation: property.location,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: parseInt(booking.guests),
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      pricePerNight: property.price,
      totalPrice: totalPrice,
      cleaningFee: cleaningFee,
      serviceFee: serviceFee,
      paymentMethod: booking.paymentMethod,
      specialRequests: booking.specialRequests || '',
      guestName: user.fullName || user.username,
      guestEmail: user.email,
      guestPhone: user.mobile || 'Not provided'
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/bookings/success', { state: { booking: data.booking } });
      } else {
        setErrors({ submit: data.error || 'Booking failed. Please try again.' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
      setShowUpiScanner(false);
      setUpiPaymentStatus(null);
    }
  };

  const handlePaymentSubmit = () => {
    if (booking.paymentMethod === 'upi') {
      setShowUpiScanner(true);
    } else {
      proceedWithBooking();
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>No property selected</h2>
          <button onClick={() => navigate('/browse')} style={styles.backButton}>
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const subtotal = property.price * nights;
  const cleaningFee = property.cleaningFee || 700;
  const serviceFee = property.serviceFee || 350;
  const totalPrice = subtotal + cleaningFee + serviceFee;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backNav}>
        <FaArrowLeft /> Back
      </button>

      {/* UPI Scanner Modal */}
      {showUpiScanner && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.modalClose} onClick={() => setShowUpiScanner(false)}>×</button>
            <h3 style={styles.modalTitle}>Scan QR Code to Pay</h3>
            
            {upiPaymentStatus === 'processing' && (
              <div style={styles.paymentProcessing}>
                <div style={styles.spinnerSmall}></div>
                <p>Verifying payment...</p>
              </div>
            )}
            
            {upiPaymentStatus === 'success' && (
              <div style={styles.paymentSuccess}>
                <FaCheckCircle style={styles.successIcon} />
                <p>Payment successful! Confirming booking...</p>
              </div>
            )}
            
            {!upiPaymentStatus && (
              <>
                {/* YOUR OWN QR CODE IMAGE */}
                <div style={styles.qrCodeContainer}>
                  <img 
                    src={YOUR_QR_CODE_PATH}
                    alt="UPI QR Code"
                    style={styles.qrImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{ ...styles.qrPlaceholder, display: 'none' }}>
                    <FaQrcode style={styles.qrIcon} />
                    <p>QR Code Placeholder</p>
                    <p style={styles.qrNote}>Place your QR code at: public/assets/images/upi-qr.png</p>
                  </div>
                </div>
                
                {/* UPI Details */}
                <div style={styles.upiDetails}>
                  <p style={styles.payToLabel}>Pay to:</p>
                  <div style={styles.upiCard}>
                    <div style={styles.upiInfoRow}>
                      <span style={styles.upiLabel}>UPI ID:</span>
                      <code style={styles.upiCode}>{YOUR_UPI_ID}</code>
                      <button 
                        style={styles.copyBtn}
                        onClick={() => copyToClipboard(YOUR_UPI_ID)}
                      >
                        {copied ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                    <div style={styles.upiInfoRow}>
                      <span style={styles.upiLabel}>Name:</span>
                      <span>{YOUR_UPI_NAME}</span>
                    </div>
                  </div>
                </div>
                
                <div style={styles.paymentAmountCard}>
                  <p>Amount to Pay: <strong style={styles.amountHighlight}>₹{totalPrice}</strong></p>
                </div>
                
                <div style={styles.paymentInstructions}>
                  <p>📱 How to pay:</p>
                  <ol style={styles.instructionsList}>
                    <li>Open any UPI app (Google Pay, PhonePe, Paytm)</li>
                    <li>Scan the QR code above</li>
                    <li>Enter amount: <strong>₹{totalPrice}</strong></li>
                    <li>Make the payment</li>
                    <li>Click "I've Completed Payment" below</li>
                  </ol>
                </div>
                
                <div style={styles.modalButtons}>
                  <button 
                    style={styles.cancelPayBtn}
                    onClick={() => setShowUpiScanner(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    style={styles.confirmPayBtn}
                    onClick={proceedWithBooking}
                    disabled={submitting}
                  >
                    {submitting ? 'Processing...' : 'I\'ve Completed Payment'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {/* Left Column - Booking Form */}
        <div style={styles.formColumn}>
          <h1 style={styles.title}>Confirm and book</h1>
          
          <form onSubmit={(e) => { e.preventDefault(); handlePaymentSubmit(); }}>
            {/* Dates Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <FaCalendarAlt style={styles.sectionIcon} /> Your trip dates
              </h3>
              <div style={styles.dateGrid}>
                <div style={styles.dateInput}>
                  <label>CHECK-IN</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={booking.checkIn}
                    onChange={handleChange}
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkIn && <span style={styles.error}>{errors.checkIn}</span>}
                </div>
                <div style={styles.dateInput}>
                  <label>CHECK-OUT</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={booking.checkOut}
                    onChange={handleChange}
                    style={styles.input}
                    min={booking.checkIn}
                  />
                  {errors.checkOut && <span style={styles.error}>{errors.checkOut}</span>}
                </div>
              </div>
              <div style={styles.nightCount}>
                <FaClock /> {nights} night{nights !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Guests Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <FaUsers style={styles.sectionIcon} /> Guests
              </h3>
              <div style={styles.guestWrapper}>
                <div style={styles.guestContent}>
                  <input
                    type="number"
                    name="guests"
                    value={booking.guests}
                    onChange={handleChange}
                    min="1"
                    max={property.guests || 10}
                    style={styles.guestInput}
                  />
                </div>
              </div>
              <div style={styles.guestInfo}>
                <span>Maximum {property.guests || 10} guests</span>
              </div>
              {errors.guests && <span style={styles.error}>{errors.guests}</span>}
            </div>

            {/* Payment Method */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <FaMoneyBillWave style={styles.sectionIcon} /> Payment method
              </h3>
              <div style={styles.paymentOptions}>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={booking.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <FaRegCreditCard /> Credit/Debit Card
                </label>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={booking.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />
                  <FaMobile /> UPI (QR Code)
                </label>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={booking.paymentMethod === 'netbanking'}
                    onChange={handleChange}
                  />
                  <FaUniversity /> Net Banking
                </label>
              </div>
              {booking.paymentMethod === 'upi' && (
                <div style={styles.upiInfoBox}>
                  <FaQrcode style={styles.qrInfoIcon} />
                  <span>You'll see a QR code to scan and pay</span>
                </div>
              )}
              {errors.paymentMethod && <span style={styles.error}>{errors.paymentMethod}</span>}
            </div>

            {/* Special Requests */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Special requests (optional)</h3>
              <textarea
                name="specialRequests"
                value={booking.specialRequests}
                onChange={handleChange}
                placeholder="Let the host know if you have any special requests..."
                rows={3}
                style={styles.textarea}
              />
            </div>

            {errors.submit && (
              <div style={styles.submitError}>{errors.submit}</div>
            )}

            <button type="submit" disabled={submitting} style={styles.confirmButton}>
              {submitting ? 'Processing...' : 'Confirm and book'}
            </button>
          </form>
        </div>

        {/* Right Column - Price Summary */}
        <div style={styles.summaryColumn}>
          <div style={styles.summaryCard}>
            <div style={styles.propertyInfo}>
              <img 
                src={property.images?.[0] ? getImageUrl(property.images[0]) : 'https://via.placeholder.com/120x80?text=Property'}
                alt={property.title}
                style={styles.propertyImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/120x80?text=Property';
                }}
              />
              <div style={styles.propertyDetails}>
                <h4 style={styles.propertyTitle}>{property.title}</h4>
                <p style={styles.propertyLocation}>{property.location}</p>
                <div style={styles.rating}>
                  <span>★</span> {property.rating || 4.5} ({property.reviewCount || 0} reviews)
                </div>
              </div>
            </div>

            <div style={styles.priceBreakdown}>
              <div style={styles.priceRow}>
                <span>₹{property.price} x {nights} nights</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Cleaning fee</span>
                <span>₹{cleaningFee}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Service fee</span>
                <span>₹{serviceFee}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Total (INR)</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <div style={styles.securityNote}>
              <FaShieldAlt style={styles.securityIcon} />
              <p>Your payment is secure. No charge until confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #ff385c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  spinnerSmall: {
    width: '30px',
    height: '30px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #ff385c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  backNav: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#222',
    cursor: 'pointer',
    marginBottom: '24px',
    padding: '8px 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '48px'
  },
  formColumn: {
    maxWidth: '600px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '24px'
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #EBEBEB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#222',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sectionIcon: {
    color: '#ff385c',
    fontSize: '16px'
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  dateInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '14px',
    border: '1px solid #DDD',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  nightCount: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#717171',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  guestWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  guestContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  guestInput: {
    width: '120px',
    padding: '12px',
    border: '1px solid #DDD',
    borderRadius: '12px',
    fontSize: '16px',
    textAlign: 'center',
    outline: 'none'
  },
  guestInfo: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#717171'
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    border: '1px solid #DDD',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'border-color 0.2s'
  },
  upiInfoBox: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#F0FDF4',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#166534'
  },
  qrInfoIcon: {
    fontSize: '18px'
  },
  textarea: {
    width: '100%',
    padding: '14px',
    border: '1px solid #DDD',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  error: {
    color: '#FF5A5F',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  submitError: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FF5A5F',
    borderRadius: '12px',
    padding: '12px',
    color: '#FF5A5F',
    fontSize: '14px',
    marginBottom: '16px'
  },
  confirmButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#ff385c',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'background-color 0.2s'
  },
  summaryColumn: {},
  summaryCard: {
    position: 'sticky',
    top: '100px',
    border: '1px solid #EBEBEB',
    borderRadius: '16px',
    padding: '24px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  propertyInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  propertyImage: {
    width: '120px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  propertyDetails: {
    flex: 1
  },
  propertyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '4px',
    color: '#222'
  },
  propertyLocation: {
    fontSize: '13px',
    color: '#717171',
    marginBottom: '4px'
  },
  rating: {
    fontSize: '13px',
    color: '#222'
  },
  priceBreakdown: {
    borderTop: '1px solid #EBEBEB',
    paddingTop: '16px',
    marginBottom: '16px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#222'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderTop: '1px solid #EBEBEB',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px'
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#717171',
    paddingTop: '16px',
    borderTop: '1px solid #EBEBEB',
    textAlign: 'center',
    justifyContent: 'center'
  },
  securityIcon: {
    color: '#00A699',
    fontSize: '14px'
  },
  errorCard: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  backButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#222',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    textAlign: 'center',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#717171'
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#222'
  },
  qrCodeContainer: {
    marginBottom: '24px'
  },
  qrImage: {
    width: '250px',
    height: '250px',
    margin: '0 auto',
    display: 'block',
    border: '1px solid #DDD',
    borderRadius: '16px',
    padding: '16px',
    backgroundColor: 'white'
  },
  qrPlaceholder: {
    width: '250px',
    height: '250px',
    backgroundColor: '#F7F7F7',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    border: '2px dashed #DDD'
  },
  qrIcon: {
    fontSize: '64px',
    color: '#222',
    marginBottom: '12px'
  },
  qrNote: {
    fontSize: '11px',
    color: '#717171',
    marginTop: '8px'
  },
  upiDetails: {
    marginBottom: '20px',
    textAlign: 'left',
    backgroundColor: '#F7F7F7',
    borderRadius: '12px',
    padding: '16px'
  },
  payToLabel: {
    fontSize: '13px',
    color: '#717171',
    marginBottom: '8px'
  },
  upiCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  upiInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  upiLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#222',
    minWidth: '45px'
  },
  upiCode: {
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    color: '#222'
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ff385c',
    fontSize: '14px',
    padding: '4px 8px'
  },
  paymentAmountCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  amountHighlight: {
    fontSize: '24px',
    color: '#166534'
  },
  paymentInstructions: {
    textAlign: 'left',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#F7F7F7',
    borderRadius: '12px'
  },
  instructionsList: {
    marginTop: '8px',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#222',
    lineHeight: '1.8'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px'
  },
  cancelPayBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#F7F7F7',
    border: 'none',
    borderRadius: '40px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#222'
  },
  confirmPayBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#ff385c',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  paymentProcessing: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  paymentSuccess: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  successIcon: {
    fontSize: '48px',
    color: '#00A699',
    marginBottom: '16px'
  }
};

// Add animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Booking;