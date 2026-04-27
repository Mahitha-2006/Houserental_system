import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaArrowLeft, FaWifi, FaParking, FaUtensils, FaWind, FaTv, FaSnowflake, FaCheckCircle, FaSwimmingPool, FaDumbbell, FaCoffee, FaHome, FaKey, FaHotTub, FaFilm, FaChevronLeft, FaChevronRight, FaHeart, FaShare } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
    
    // Load saved state from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setIsSaved(wishlist.some(item => item.id === id));
    }
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x500?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets')) return `${API_URL}${imagePath}`;
    return `${API_URL}/assets/images/${imagePath}`;
  };

  const getDescriptionBullets = (text) => {
    if (!text) return [];
    let sentences = text.split(/(?<=[.!?])\s+|\n+/);
    sentences = sentences.filter(s => s.trim().length > 10).map(s => s.trim());
    return sentences;
  };

  // Helper function to get amenity name from object or string
  const getAmenityName = (amenity) => {
    if (!amenity) return 'Unknown';
    if (typeof amenity === 'string') return amenity;
    if (typeof amenity === 'object') {
      return amenity.name || amenity.title || Object.values(amenity)[0] || 'Amenity';
    }
    return String(amenity);
  };

  // Fixed: Safe amenity icon function - handles both strings and objects
  const getAmenityIcon = (amenity) => {
    const amenityStr = getAmenityName(amenity).toLowerCase();
    
    if (amenityStr.includes('wifi')) return <FaWifi />;
    if (amenityStr.includes('parking')) return <FaParking />;
    if (amenityStr.includes('kitchen')) return <FaUtensils />;
    if (amenityStr.includes('washer') || amenityStr.includes('laundry')) return <FaWind />;
    if (amenityStr.includes('tv')) return <FaTv />;
    if (amenityStr.includes('air') || amenityStr.includes('ac') || amenityStr.includes('cooling')) return <FaSnowflake />;
    if (amenityStr.includes('pool')) return <FaSwimmingPool />;
    if (amenityStr.includes('gym') || amenityStr.includes('fitness')) return <FaDumbbell />;
    if (amenityStr.includes('coffee')) return <FaCoffee />;
    if (amenityStr.includes('balcony') || amenityStr.includes('rooftop') || amenityStr.includes('terrace')) return <FaHome />;
    if (amenityStr.includes('jacuzzi') || amenityStr.includes('hot tub') || amenityStr.includes('spa')) return <FaHotTub />;
    if (amenityStr.includes('theater') || amenityStr.includes('movie') || amenityStr.includes('cinema')) return <FaFilm />;
    if (amenityStr.includes('key')) return <FaKey />;
    return <FaCheckCircle />;
  };

  const handleSaveProperty = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    if (isSaved) {
      // Remove from wishlist
      wishlist = wishlist.filter(item => item.id !== property.id);
      setIsSaved(false);
    } else {
      // Add to wishlist
      wishlist.push({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.images?.[0] || 'https://via.placeholder.com/400x250?text=Property',
        rating: property.rating
      });
      setIsSaved(true);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/properties/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      let images = [];
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        images = data.images.map(img => getImageUrl(img));
      } else if (data.image) {
        images = [getImageUrl(data.image)];
      } else {
        images = [
          'https://images.unsplash.com/photo-1560448204-9d5e2e96f1b0?w=800',
          'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
        ];
      }
      
      const fullDescriptionText = data.longDescription || data.description || '';
      const descriptionBullets = getDescriptionBullets(fullDescriptionText);
      
      // Fixed: Ensure amenities are properly converted to strings
      let amenities = [];
      if (data.amenities && Array.isArray(data.amenities)) {
        amenities = data.amenities.map(a => {
          if (typeof a === 'string') return a;
          if (typeof a === 'object') return a.name || a.title || 'Amenity';
          return String(a);
        });
      } else if (data.keyAmenities && Array.isArray(data.keyAmenities)) {
        amenities = data.keyAmenities.map(a => String(a));
      } else {
        amenities = ["WiFi", "Air conditioning", "Free parking", "Kitchen", "TV", "Washer", "Dryer", "Heating"];
      }
      
      setProperty({
        id: data._id || id,
        title: data.title || "Beautiful Property",
        location: data.location || "Location",
        price: data.price || 5000,
        cleaningFee: data.cleaningFee || 700,
        serviceFee: data.serviceFee || 350,
        rating: data.rating || 4.8,
        reviewCount: data.reviewCount || 50,
        images: images,
        descriptionBullets: descriptionBullets,
        longDescription: fullDescriptionText,
        bedrooms: data.bedrooms || 2,
        bathrooms: data.bathrooms || 2,
        guests: data.guests || 4,
        beds: data.beds || 2,
        amenities: amenities,
        highlights: data.highlights || [],
        hostName: data.owner?.fullName || data.owner?.name || "Host",
        isSuperhost: data.isSuperhost || false,
        instantBook: data.instantBook || true,
        isGuestFavourite: data.isGuestFavourite || false
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const nextImage = () => {
    if (property && property.images && property.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images && property.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      return Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    }
    return 1;
  };

  const handleInstantBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/booking', { state: { property: property } });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={styles.errorContainer}>
        <h2>Property Not Found</h2>
        <p>{error || "The property you're looking for doesn't exist."}</p>
        <button onClick={() => navigate('/browse')} style={styles.backButton}>
          Browse Properties
        </button>
      </div>
    );
  }

  const totalNights = calculateNights();
  const subtotal = property.price * totalNights;
  const totalPrice = subtotal + (property.cleaningFee || 0) + (property.serviceFee || 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={styles.backLink}>
          <FaArrowLeft /> Back
        </button>

        {/* Title Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{property.title}</h1>
            <div style={styles.location}>
              <FaMapMarkerAlt style={styles.locationIcon} />
              <span>{property.location}</span>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.shareButton}><FaShare /> Share</button>
            <button onClick={handleSaveProperty} style={styles.saveButton}>
              <FaHeart style={{ color: isSaved ? '#FF385C' : '#222' }} /> {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Rating Row */}
        <div style={styles.ratingRow}>
          <FaStar style={styles.starIcon} />
          <span style={styles.ratingValue}>{property.rating}</span>
          <span style={styles.ratingSeparator}>·</span>
          <span style={styles.reviewText}>{property.reviewCount} reviews</span>
          {property.isSuperhost && (
            <>
              <span style={styles.ratingSeparator}>·</span>
              <span style={styles.superhostText}>Superhost</span>
            </>
          )}
        </div>

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <div style={styles.gallery}>
            <div style={styles.mainImageContainer}>
              <button onClick={prevImage} style={{...styles.galleryNav, left: '16px'}}>
                <FaChevronLeft />
              </button>
              <img 
                src={property.images[selectedImage]} 
                alt={property.title}
                style={styles.mainImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Available';
                }}
              />
              <button onClick={nextImage} style={{...styles.galleryNav, right: '16px'}}>
                <FaChevronRight />
              </button>
            </div>
            {property.images.length > 1 && (
              <div style={styles.thumbnailContainer}>
                {property.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      ...styles.thumbnail,
                      border: selectedImage === index ? '2px solid #222' : '2px solid transparent'
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} style={styles.thumbnailImage} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div style={styles.contentGrid}>
          {/* Left Column - Property Info */}
          <div style={styles.leftColumn}>
            {/* Host Info */}
            <div style={styles.hostSection}>
              <div>
                <h3 style={styles.hostName}>Entire property hosted by {property.hostName}</h3>
                <div style={styles.hostBadges}>
                  {property.isSuperhost && <span style={styles.hostBadge}>⭐ Superhost</span>}
                  {property.instantBook && <span style={styles.hostBadge}>⚡ Instant Book</span>}
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statItem}><FaUsers style={styles.statIcon} /> {property.guests} guests</div>
              <div style={styles.statItem}><FaBed style={styles.statIcon} /> {property.bedrooms} bedrooms</div>
              <div style={styles.statItem}><FaBed style={styles.statIcon} /> {property.beds} beds</div>
              <div style={styles.statItem}><FaBath style={styles.statIcon} /> {property.bathrooms} baths</div>
            </div>

            {/* About this place */}
            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>About this place</h3>
              <ul style={styles.bulletList}>
                {(showFullDescription ? property.descriptionBullets : property.descriptionBullets.slice(0, 6)).map((sentence, index) => (
                  <li key={index} style={styles.bulletItem}>
                    <span style={styles.bulletDot}>•</span>
                    <span>{sentence}</span>
                  </li>
                ))}
              </ul>
              {property.descriptionBullets.length > 6 && (
                <button onClick={() => setShowFullDescription(!showFullDescription)} style={styles.readMoreBtn}>
                  {showFullDescription ? 'Show less' : `Read more (${property.descriptionBullets.length - 6} more)`}
                </button>
              )}
            </div>

            {/* Amenities - Fixed to show proper names */}
            <div style={styles.amenitiesSection}>
              <h3 style={styles.sectionTitle}>What this place offers</h3>
              <div style={styles.amenitiesGrid}>
                {property.amenities && property.amenities.slice(0, 12).map((amenity, index) => (
                  <div key={index} style={styles.amenityItem}>
                    {getAmenityIcon(amenity)}
                    <span>{getAmenityName(amenity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div style={styles.rightColumn}>
            <div style={styles.bookingCard}>
              <div style={styles.priceSection}>
                <span style={styles.price}>{formatPrice(property.price)}</span>
                <span style={styles.perNight}> / night</span>
              </div>
              
              <div style={styles.bookingRating}>
                <FaStar style={styles.starIconSmall} />
                <span>{property.rating}</span>
                <span style={styles.reviewTextSmall}>· {property.reviewCount} reviews</span>
              </div>
              
              <div style={styles.dateSection}>
                <div style={styles.dateInput}>
                  <label style={styles.inputLabel}>CHECK-IN</label>
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={styles.inputField}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div style={styles.dateInput}>
                  <label style={styles.inputLabel}>CHECK-OUT</label>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={styles.inputField}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div style={styles.guestSection}>
                <label style={styles.inputLabel}>GUESTS</label>
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  style={styles.selectField}
                >
                  {[...Array(Math.min(property.guests, 16))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} guest{i === 0 ? '' : 's'}</option>
                  ))}
                </select>
              </div>
              
              <button onClick={handleInstantBook} style={styles.bookButton}>
                {property.instantBook ? 'Instant Book' : 'Request to Book'}
              </button>
              
              <div style={styles.priceBreakdown}>
                <div style={styles.priceRow}>
                  <span>{formatPrice(property.price)} x {totalNights} night{totalNights !== 1 ? 's' : ''}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {property.cleaningFee > 0 && (
                  <div style={styles.priceRow}>
                    <span>Cleaning fee</span>
                    <span>{formatPrice(property.cleaningFee)}</span>
                  </div>
                )}
                {property.serviceFee > 0 && (
                  <div style={styles.priceRow}>
                    <span>Service fee</span>
                    <span>{formatPrice(property.serviceFee)}</span>
                  </div>
                )}
                <div style={styles.totalRow}>
                  <span>Total (INR)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <p style={styles.bookingNote}>You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '24px 24px 48px'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    marginBottom: '24px',
    color: '#222',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '8px',
    lineHeight: '1.3'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#717171',
    fontSize: '14px'
  },
  locationIcon: {
    fontSize: '12px'
  },
  headerActions: {
    display: 'flex',
    gap: '16px'
  },
  shareButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#222',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#222',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  starIcon: {
    color: '#FF385C',
    fontSize: '14px'
  },
  ratingValue: {
    fontWeight: '500',
    color: '#222'
  },
  ratingSeparator: {
    color: '#DDD'
  },
  reviewText: {
    color: '#717171',
    fontSize: '14px',
    textDecoration: 'underline'
  },
  superhostText: {
    color: '#717171',
    fontSize: '14px'
  },
  starIconSmall: {
    color: '#FF385C',
    fontSize: '12px'
  },
  reviewTextSmall: {
    color: '#717171',
    fontSize: '12px'
  },
  gallery: {
    marginBottom: '32px'
  },
  mainImageContainer: {
    position: 'relative',
    width: '100%',
    height: '460px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '12px',
    backgroundColor: '#F7F7F7'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  galleryNav: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10
  },
  thumbnailContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px'
  },
  thumbnail: {
    height: '80px',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#F7F7F7'
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '48px'
  },
  leftColumn: {},
  rightColumn: {},
  hostSection: {
    paddingBottom: '24px',
    borderBottom: '1px solid #DDD',
    marginBottom: '24px'
  },
  hostName: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '8px'
  },
  hostBadges: {
    display: 'flex',
    gap: '12px'
  },
  hostBadge: {
    fontSize: '14px',
    color: '#717171'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    paddingBottom: '24px',
    borderBottom: '1px solid #DDD',
    marginBottom: '24px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#222'
  },
  statIcon: {
    color: '#222',
    fontSize: '18px'
  },
  descriptionSection: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#222'
  },
  bulletList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 0',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#222',
    borderBottom: '1px solid #F0F0F0'
  },
  bulletDot: {
    color: '#222',
    fontSize: '16px',
    flexShrink: 0
  },
  readMoreBtn: {
    background: 'none',
    border: 'none',
    color: '#222',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
    fontSize: '14px',
    textDecoration: 'underline'
  },
  amenitiesSection: {
    marginBottom: '32px'
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  amenityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    fontSize: '14px',
    color: '#222'
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DDD',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: '100px'
  },
  priceSection: {
    marginBottom: '8px'
  },
  price: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#222'
  },
  perNight: {
    fontSize: '14px',
    color: '#717171'
  },
  bookingRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #DDD'
  },
  dateSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },
  dateInput: {
    flex: 1
  },
  inputLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '6px',
    textTransform: 'uppercase'
  },
  inputField: {
    width: '100%',
    padding: '12px',
    border: '1px solid #DDD',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF'
  },
  guestSection: {
    marginBottom: '20px'
  },
  selectField: {
    width: '100%',
    padding: '12px',
    border: '1px solid #DDD',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background 0.2s'
  },
  priceBreakdown: {
    borderTop: '1px solid #DDD',
    paddingTop: '20px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#222',
    textDecoration: 'underline'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #DDD',
    fontWeight: '600',
    fontSize: '16px'
  },
  bookingNote: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#717171',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #DDD'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#FFFFFF'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #F0F0F0',
    borderTop: '3px solid #222',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#FFFFFF'
  },
  backButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#222',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default PropertyDetails;