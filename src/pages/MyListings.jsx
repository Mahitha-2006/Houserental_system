import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyListings.css';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = 'http://localhost:5000';

  // Demo data without images
  const demoListings = [
    {
      id: "1",
      title: "RAYN Oasis - Comfort 3BR Marble Home | Near NMDC/CARE",
      location: "Vijayanagar Colony, Hyderabad",
      city: "Hyderabad",
      price: 5000,
      bedrooms: 3,
      bathrooms: 3,
      guests: 7,
      status: "active"
    },
    {
      id: "2",
      title: "The Stonewood Sanctuary",
      location: "Hyderabad, India",
      city: "Hyderabad",
      price: 4500,
      bedrooms: 3,
      bathrooms: 2.5,
      guests: 6,
      status: "active"
    }
  ];

  // Fetch properties
  const fetchListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token - using demo data');
        setListings(demoListings);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        let allProperties = [];
        
        if (data.properties) {
          allProperties = data.properties;
        } else if (Array.isArray(data)) {
          allProperties = data;
        }
        
        if (allProperties.length > 0) {
          const formattedProperties = allProperties.slice(0, 2).map(prop => ({
            id: prop._id?.$oid || prop._id,
            title: prop.title,
            location: prop.location || `${prop.city}, ${prop.state}`,
            city: prop.city,
            price: prop.price,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            guests: prop.guests,
            status: prop.status || 'active'
          }));
          setListings(formattedProperties);
        } else {
          setListings(demoListings);
        }
      } else {
        setListings(demoListings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(demoListings);
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(listing => listing.id !== id));
      setMessage({ text: 'Listing deleted successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Toggle status
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, status: newStatus } : listing
    ));
    setMessage({ text: `Listing marked as ${newStatus}!`, type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    pending: listings.filter(l => l.status === 'pending').length,
    inactive: listings.filter(l => l.status === 'inactive').length
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="my-listings-container">
        <div className="loading-spinner">Loading your listings...</div>
      </div>
    );
  }

  return (
    <div className="my-listings-container">
      <div className="my-listings-header">
        <div>
          <h1>My Listings</h1>
          <p className="header-subtitle">Manage your properties and track their status</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h2>No listings yet</h2>
          <p>You haven't added any properties to your portfolio.</p>
          <Link to="/create-listing" className="empty-state-btn">
            + Add New Property
          </Link>
        </div>
      ) : (
        <>
          <div className="listings-stats">
            <div className="stat-card">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Listings</span>
            </div>
            <div className="stat-card active">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card inactive">
              <span className="stat-value">{stats.inactive}</span>
              <span className="stat-label">Inactive</span>
            </div>
          </div>

          <div className="listings-filter">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({stats.total})
            </button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
              Active ({stats.active})
            </button>
            <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              Pending ({stats.pending}
            </button>
            <button className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`} onClick={() => setFilter('inactive')}>
              Inactive ({stats.inactive})
            </button>
          </div>

          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="listing-card">
                {/* No image section - removed completely */}
                <div className="listing-details">
                  <div className={`status-badge ${listing.status}`}>
                    {listing.status}
                  </div>
                  <h3>{listing.title}</h3>
                  <p className="listing-location">
                    📍 {listing.location}
                  </p>
                  <p className="listing-price">
                    ₹{listing.price.toLocaleString()} <span>/ night</span>
                  </p>
                  <div className="listing-meta">
                    <span>🛏️ {listing.bedrooms} beds</span>
                    <span>🛁 {listing.bathrooms} baths</span>
                    <span>👥 {listing.guests} guests</span>
                  </div>
                  <div className="listing-actions">
                    <Link to={`/property/${listing.id}`} className="action-btn view-btn">
                      View
                    </Link>
                    <Link to={`/edit-listing/${listing.id}`} className="action-btn edit-btn">
                      Edit
                    </Link>
                    <button 
                      className="action-btn status-btn"
                      onClick={() => handleStatusToggle(listing.id, listing.status)}
                    >
                      {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(listing.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="add-more-section">
<Link to="/create-listing" className="add-more-btn">
  + Add New Property
</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;