import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaFilter, FaTimes, FaBed, FaBath, FaUsers } from 'react-icons/fa';
import './Browse.css';

const API_URL = 'http://localhost:5000';

function Browse() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('rating');
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    location: queryParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    city: queryParams.get('city') || ''
  });

  const [tempFilters, setTempFilters] = useState({ ...filters });

  const propertiesPerPage = 12;

  useEffect(() => {
    fetchProperties();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets')) return `${API_URL}${imagePath}`;
    return `${API_URL}/assets/images/${imagePath}`;
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.location) params.append('city', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.type) params.append('type', filters.type);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      
      params.append('limit', 100);
      params.append('page', 1);
      
      const response = await fetch(`${API_URL}/properties?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      
      let allProperties = data.properties || [];
      
      // Additional filtering for bathrooms (if backend doesn't support)
      if (filters.bathrooms) {
        allProperties = allProperties.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
      }
      
      setProperties(allProperties);
      applyFiltersAndSort(allProperties, filters, sortBy);
      
    } catch (err) {
      console.error('Error fetching properties:', err);
      // Fallback to empty array
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (props, filterParams, sort) => {
    let filtered = [...props];
    
    // Location filter (client-side for city variations)
    if (filterParams.location) {
      filtered = filtered.filter(p => 
        p.city?.toLowerCase().includes(filterParams.location.toLowerCase()) ||
        p.location?.toLowerCase().includes(filterParams.location.toLowerCase())
      );
    }
    
    // Price range filter
    if (filterParams.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filterParams.minPrice));
    }
    if (filterParams.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filterParams.maxPrice));
    }
    
    // Property type filter
    if (filterParams.type) {
      filtered = filtered.filter(p => p.type?.toLowerCase() === filterParams.type.toLowerCase());
    }
    
    // Bedrooms filter
    if (filterParams.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filterParams.bedrooms));
    }
    
    // Bathrooms filter
    if (filterParams.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filterParams.bathrooms));
    }
    
    // Sorting
    switch(sort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredProperties(filtered);
    setTotalResults(filtered.length);
    setTotalPages(Math.ceil(filtered.length / propertiesPerPage));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters({ ...tempFilters, [name]: value });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    applyFiltersAndSort(properties, tempFilters, sortBy);
    setShowFilters(false);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    applyFiltersAndSort(properties, filters, newSort);
  };

  const clearFilters = () => {
    const emptyFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      city: ''
    };
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
    applyFiltersAndSort(properties, emptyFilters, sortBy);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  // Get current page properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique property types from actual data
  const propertyTypes = [...new Set(properties.map(p => p.type).filter(Boolean))];
  const amenityOptions = ['wifi', 'kitchen', 'ac', 'parking', 'pool', 'gym', 'tv', 'washer', 'dryer'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
        <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="browse-container">
        {/* Filters Sidebar */}
        <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="filter-section">
            <h4>Location / City</h4>
            <input
              type="text"
              name="location"
              placeholder="Enter city or location"
              value={tempFilters.location}
              onChange={handleFilterChange}
              className="filter-input"
              list="cities"
            />
            <datalist id="cities">
              <option value="Hyderabad" />
              <option value="Bengaluru" />
              <option value="Mumbai" />
              <option value="Pune" />
              <option value="Goa" />
              <option value="Chennai" />
              <option value="Visakhapatnam" />
              <option value="Mysore" />
              <option value="Delhi" />
            </datalist>
          </div>

          <div className="filter-section">
            <h4>Price Range (per night)</h4>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={tempFilters.minPrice}
                onChange={handleFilterChange}
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={tempFilters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Property Type</h4>
            <select
              name="type"
              value={tempFilters.type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Bedrooms</h4>
            <select
              name="bedrooms"
              value={tempFilters.bedrooms}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Bathrooms</h4>
            <select
              name="bathrooms"
              value={tempFilters.bathrooms}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
            <button className="apply-filters" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <div>
              <h2>{totalResults} stays available</h2>
              {filters.location && <p>in {filters.location}</p>}
            </div>
            <select value={sortBy} onChange={handleSortChange} className="sort-select">
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {(filters.location || filters.minPrice || filters.maxPrice || filters.type || filters.bedrooms || filters.bathrooms) && (
            <div className="active-filters">
              {filters.location && (
                <span className="filter-tag">
                  Location: {filters.location}
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="filter-tag">
                  Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                </span>
              )}
              {filters.type && (
                <span className="filter-tag">
                  Type: {filters.type}
                </span>
              )}
              {filters.bedrooms && (
                <span className="filter-tag">
                  {filters.bedrooms}+ bedrooms
                </span>
              )}
              <button className="clear-all" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}

          <div className="properties-grid">
            {currentProperties.map(property => (
              <Link to={`/property/${property._id}`} key={property._id} className="property-card">
                <div className="property-image">
                  <img 
                    src={getImageUrl(property.image || property.images?.[0])} 
                    alt={property.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Property';
                    }}
                  />
                  {property.isGuestFavourite && (
                    <span className="guest-favourite">✨ Guest favourite</span>
                  )}
                  {property.isSuperhost && (
                    <span className="superhost-badge">⭐ Superhost</span>
                  )}
                </div>
                <div className="property-info">
                  <div className="property-header">
                    <h3>{property.title}</h3>
                    <div className="rating">
                      <FaStar className="star" />
                      <span>{property.rating || 'New'}</span>
                    </div>
                  </div>
                  <p className="location">
                    <FaMapMarkerAlt /> {property.location || property.city}
                  </p>
                  <div className="property-details">
                    <span><FaBed /> {property.bedrooms || 0} beds</span>
                    <span><FaBath /> {property.bathrooms || 0} baths</span>
                    <span><FaUsers /> {property.guests || 0} guests</span>
                  </div>
                  <p className="reviews">{property.reviewCount || 0} reviews</p>
                  <p className="price">
                    {formatPrice(property.price)} <span>night</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="no-results">
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Browse;