import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateListing.css';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://localhost:5000';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Apartment',
    location: '',
    city: '',
    state: 'Karnataka',
    country: 'India',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to create a listing');
        setLoading(false);
        return;
      }

      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guests: Number(formData.guests),
        cleaningFee: 500,
        serviceFee: 300,
        securityDeposit: 1500,
        weeklyDiscount: 8,
        monthlyDiscount: 15,
        beds: Number(formData.bedrooms),
        squareFeet: 1000,
        location: `${formData.location}, ${formData.city}, ${formData.state}`,
        coordinates: { lat: 0, lng: 0 },
        images: [formData.image],
        amenities: [
          { name: "Washing Machine", category: "Basic" },
          { name: "WiFi", category: "Basic" },
          { name: "TV", category: "Entertainment" },
          { name: "Air conditioning", category: "Basic" },
          { name: "Kitchen", category: "Kitchen" },
          { name: "Free parking on premises", category: "Basic" }
        ],
        keyAmenities: ["WiFi", "Kitchen", "Air conditioning", "Free parking", "Washing machine", "TV"],
        houseRules: {
          checkIn: "Flexible",
          checkOut: "11:00 AM",
          minStay: 1,
          maxStay: 30,
          smoking: false,
          pets: false,
          parties: false,
          children: true,
          quietHours: { start: "22:00", end: "08:00" }
        },
        safetyFeatures: [
          { name: "Fire extinguisher", icon: "fire" },
          { name: "First aid kit", icon: "medical" }
        ],
        tags: ["family-friendly", "business-travel", "central-location"],
        categories: ["Apartment", "Family", "Business"],
        nearbyPlaces: [],
        highlights: [
          "Designed for staying cool - Beat the heat with the A/C and ceiling fan",
          "Park for free - One of the few places in the area with free parking"
        ],
        languages: ["English", "Hindi"]
      };

      const response = await fetch(`${API_URL}/properties/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Property listed successfully!');
        setTimeout(() => {
          navigate('/my-listings');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <div className="create-listing-header">
        <h1>List Your Property</h1>
        <p>Start earning by sharing your space with travelers</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="create-listing-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label>Property Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Cozy 2BHK Apartment in Koramangala"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your property, amenities, and what makes it special..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Property Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Cottage">Cottage</option>
                <option value="Farm Stay">Farm Stay</option>
              </select>
            </div>

            <div className="form-group">
              <label>City *</label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="">Select City</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Goa">Goa</option>
                <option value="Pune">Pune</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Mysore">Mysore</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Area/Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Koramangala, Indiranagar, Whitefield"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Rooms & Capacity</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                min="1"
                max="10"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label>Max Guests *</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Pricing</h2>
          
          <div className="form-group">
            <label>Price per Night (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="500"
              step="100"
              placeholder="e.g., 3500"
            />
          </div>

          <div className="form-group">
            <label>Main Image URL *</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="/assets/images/your-image.avif"
            />
            <small>Place images in /public/assets/images/ folder</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'List Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;