import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmer, 
  FaSnowflake, FaKitchen, FaTv, FaWind, FaFire, FaShare, 
  FaHeart, FaChevronLeft, FaChevronRight, FaBed, FaBath, 
  FaUser, FaCalendarAlt, FaClock, FaDog, FaSmoking, 
  FaMusic, FaCamera, FaArrowLeft, FaRegHeart, FaRegBookmark,
  FaCheck, FaTimes, FaPlus, FaMinus
} from 'react-icons/fa';
import { BiBed, BiBath, BiUser } from 'react-icons/bi';
import { MdOutlineKitchen, MdLocalParking, MdPool, MdOutlineSecurity } from 'react-icons/md';
import { GiFireplace, GiSmokeBomb, GiFirstAidKit } from 'react-icons/gi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './PropertyPage.css';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Booking states
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  
  // Date availability (mock data - in real app, fetch from backend)
  const [bookedDates, setBookedDates] = useState([
    new Date(2024, 2, 5), new Date(2024, 2, 6), new Date(2024, 2, 7),
    new Date(2024, 2, 15), new Date(2024, 2, 16), new Date(2024, 2, 17)
  ]);

  useEffect(() => {
    fetchPropertyDetails();
    fetchSimilarProperties();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(response.data.property);
      setOwner(response.data.owner);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
    setLoading(false);
  };

  const fetchSimilarProperties = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}/similar`);
      setSimilarProperties(response.data);
    } catch (error) {
      console.error('Error fetching similar properties:', error);
    }
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const nights = calculateNights();
  const subtotal = nights * (property?.price || 0);
  const serviceFee = subtotal * 0.14; // 14% service fee
  const totalPrice = subtotal + serviceFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Kitchen': <MdOutlineKitchen />,
      'TV': <FaTv />,
      'Air conditioning': <FaWind />,
      'Heating': <FaFire />,
      'Wifi': <FaWifi />,
      'Parking': <MdLocalParking />,
      'Pool': <MdPool />,
      'Washer': <FaKitchen />,
      'Dryer': <FaWind />,
      'Workspace': <FaKitchen />,
      'Smoke alarm': <GiSmokeBomb />,
      'Fire extinguisher': <GiFireplace />,
      'First aid kit': <GiFirstAidKit />,
      'Security cameras': <MdOutlineSecurity />,
      'Pet friendly': <FaDog />,
      'Smoking allowed': <FaSmoking />,
      'Events allowed': <FaMusic />
    };
    return icons[amenity] || <FaCheck />;
  };

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <h2>Property not found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="property-page">
      {/* Navigation Bar */}
      <div className="property-nav">
        <div className="nav-container">
          <button onClick={() => navigate(-1)} className="nav-back-btn">
            <FaArrowLeft /> Back to search
          </button>
          <div className="nav-actions">
            <button className="nav-action-btn" onClick={() => setIsSaved(!isSaved)}>
              {isSaved ? <FaHeart className="saved" /> : <FaRegHeart />} Save
            </button>
            <button className="nav-action-btn">
              <FaShare /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Property Header */}
        <div className="property-header">
          <h1>{property.title}</h1>
          <div className="header-meta">
            <div className="rating-location">
              <span className="rating">
                <FaStar /> {property.averageRating?.toFixed(2) || 'New'}
              </span>
              <span className="dot">·</span>
              <span className="reviews">{property.totalReviews || 0} reviews</span>
              <span className="dot">·</span>
              <span className="location">
                <FaMapMarkerAlt /> {property.location}
              </span>
            </div>
            {property.isGuestFavourite && (
              <span className="guest-favourite-badge">
                ⭐ Guest favourite
              </span>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-container">
            <img 
              src={property.images?.[selectedImage] || 'https://via.placeholder.com/1200x800'} 
              alt={property.title}
              className="main-image"
            />
            {property.images?.length > 1 && (
              <>
                <button 
                  className="gallery-nav prev"
                  onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : property.images.length - 1))}
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="gallery-nav next"
                  onClick={() => setSelectedImage(prev => (prev < property.images.length - 1 ? prev + 1 : 0))}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
          
          <div className="thumbnail-grid">
            {property.images?.slice(0, 5).map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`View ${index + 1}`} />
              </div>
            ))}
            {property.images?.length > 5 && (
              <div className="more-images" onClick={() => setShowAllImages(true)}>
                <FaCamera />
                <span>+{property.images.length - 5} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Property Info */}
          <div className="info-column">
            {/* Host Info */}
            <div className="host-section">
              <div>
                <h2>Entire rental unit hosted by {owner?.fullName || property.ownerName}</h2>
                <p className="guest-capacity">
                  {property.maxGuests || 2} guests · {property.bedrooms || 1} bedrooms · 
                  {property.beds || 1} bed · {property.bathrooms || 1} bathroom
                </p>
              </div>
              <img 
                src={owner?.image || 'https://via.placeholder.com/60'} 
                alt="Host" 
                className="host-image"
              />
            </div>

            {/* Key Features */}
            <div className="key-features">
              <div className="feature">
                <FaRegBookmark />
                <div>
                  <strong>Self check-in</strong>
                  <p>Check yourself in with the smartlock</p>
                </div>
              </div>
              <div className="feature">
                <FaStar />
                <div>
                  <strong>{owner?.fullName || property.ownerName} is a Superhost</strong>
                  <p>Superhosts are experienced, highly rated hosts</p>
                </div>
              </div>
              <div className="feature">
                <FaCalendarAlt />
                <div>
                  <strong>Free cancellation</strong>
                  <p>Cancel within 48 hours of booking</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <p className="description">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>What this place offers</h2>
              <div className="amenities-grid">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
                    <span className="amenity-name">{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="show-all-btn">
                Show all {property.amenities?.length} amenities
              </button>
            </div>

            {/* Availability Calendar */}
            <div className="calendar-section">
              <h2>Availability</h2>
              <div className="calendar-grid">
                {[...Array(6)].map((_, monthOffset) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() + monthOffset);
                  const monthName = getMonthName(date.getMonth());
                  const year = date.getFullYear();
                  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
                  const firstDay = new Date(year, date.getMonth(), 1).getDay();

                  return (
                    <div key={monthOffset} className="calendar-month">
                      <h3>{monthName} {year}</h3>
                      <div className="calendar-weekdays">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
                        <span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="calendar-days">
                        {[...Array(firstDay)].map((_, i) => (
                          <div key={`empty-${i}`} className="empty-day"></div>
                        ))}
                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;
                          const currentDate = new Date(year, date.getMonth(), day);
                          const isBooked = isDateBooked(currentDate);
                          
                          return (
                            <div 
                              key={day} 
                              className={`calendar-day ${isBooked ? 'booked' : 'available'}`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="calendar-legend">
                <span><span className="dot available"></span> Available</span>
                <span><span className="dot booked"></span> Booked</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h2>
                <FaStar /> {property.averageRating?.toFixed(2) || 'New'} · {property.totalReviews || 0} reviews
              </h2>
              
              <div className="reviews-grid">
                {reviews.slice(0, 6).map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <img 
                        src={review.userId?.image || 'https://via.placeholder.com/40'} 
                        alt={review.userId?.fullName}
                        className="reviewer-image"
                      />
                      <div>
                        <h4>{review.userId?.fullName || 'Anonymous'}</h4>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? '#ff385c' : '#ddd'} />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>

              {reviews.length > 6 && (
                <button className="show-all-reviews">
                  Show all {reviews.length} reviews
                </button>
              )}
            </div>

            {/* Location Section */}
            <div className="location-section">
              <h2>Where you'll be</h2>
              <div className="map-placeholder">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(property.location)}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(property.location)}&key=YOUR_API_KEY`}
                  alt="Map"
                  className="map-image"
                />
              </div>
              <p className="location-detail">{property.exactLocation || property.location}</p>
            </div>

            {/* House Rules */}
            <div className="rules-section">
              <h2>House rules</h2>
              <div className="rules-grid">
                <div className="rule-item">
                  <FaClock />
                  <div>
                    <strong>Check-in</strong>
                    <p>{property.checkInTime || '3:00 PM - 10:00 PM'}</p>
                  </div>
                </div>
                <div className="rule-item">
                  <FaClock />
                  <div>
                    <strong>Check-out</strong>
                    <p>{property.checkOutTime || '11:00 AM'}</p>
                  </div>
                </div>
                <div className="rule-item">
                  <BiUser />
                  <div>
                    <strong>Maximum guests</strong>
                    <p>{property.maxGuests || 2} guests</p>
                  </div>
                </div>
                <div className="rule-item">
                  <FaDog />
                  <div>
                    <strong>Pets</strong>
                    <p>{property.petsAllowed ? 'Allowed' : 'Not allowed'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="booking-column">
            <div className="booking-card">
              <div className="booking-header">
                <span className="price">
                  {formatPrice(property.price)} <span>night</span>
                </span>
                {property.averageRating > 0 && (
                  <span className="rating">
                    <FaStar /> {property.averageRating.toFixed(2)} · {property.totalReviews} reviews
                  </span>
                )}
              </div>

              <div className="date-picker">
                <div className="date-input">
                  <label>CHECK-IN</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={date => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Add date"
                    excludeDates={bookedDates}
                  />
                </div>
                <div className="date-input">
                  <label>CHECK-OUT</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={date => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Add date"
                    excludeDates={bookedDates}
                  />
                </div>
              </div>

              <div className="guest-selector">
                <label>GUESTS</label>
                <button 
                  className="guest-dropdown-btn"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </button>
                {showGuestDropdown && (
                  <div className="guest-dropdown">
                    <div className="guest-counter">
                      <span>Adults</span>
                      <div className="counter-controls">
                        <button onClick={() => setGuests(prev => Math.max(1, prev - 1))}>
                          <FaMinus />
                        </button>
                        <span>{guests}</span>
                        <button onClick={() => setGuests(prev => prev + 1)}>
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="reserve-btn">
                Reserve
              </button>

              <p className="charge-note">You won't be charged yet</p>

              {nights > 0 && (
                <div className="price-breakdown">
                  <div className="breakdown-item">
                    <span>{formatPrice(property.price)} × {nights} nights</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Service fee</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="breakdown-item total">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="similar-properties">
            <h2>Similar places to stay</h2>
            <div className="similar-grid">
              {similarProperties.map(prop => (
                <Link to={`/property/${prop._id}`} key={prop._id} className="similar-card">
                  <img src={prop.images?.[0] || 'https://via.placeholder.com/200x150'} alt={prop.title} />
                  <div className="similar-info">
                    <h3>{prop.title}</h3>
                    <p>{prop.location}</p>
                    <div className="similar-rating">
                      <FaStar /> {prop.averageRating?.toFixed(2) || 'New'}
                      {prop.isGuestFavourite && <span className="favourite-badge">Guest favourite</span>}
                    </div>
                    <p className="similar-price">
                      {formatPrice(prop.price)} <span>night</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;