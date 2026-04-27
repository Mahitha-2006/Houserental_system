import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaHeart, 
  FaSearch, FaFilter, FaSort, FaTimes, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const ChennaiProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    type: '',
    sortBy: 'rating',
    order: 'desc'
  });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, [filters, currentPage]);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,  // Changed from 50 to 9 properties per page
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.order && { order: filters.order }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters.type && { type: filters.type })
      });
      
      const response = await fetch(`${API_URL}/properties/city/Chennai?${params}`);
      
      if (!response.ok) throw new Error('Failed to fetch properties');
      
      const data = await response.json();
      console.log('Chennai properties fetched:', data.properties.length, 'Total:', data.pagination?.totalProperties);
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/cities/Chennai/types`);
      if (response.ok) {
        const data = await response.json();
        setPropertyTypes(data);
      }
    } catch (err) {
      console.error('Error fetching property types:', err);
    }
  };
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets')) return `${API_URL}${imagePath}`;
    return `${API_URL}/assets/images/${imagePath}`;
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      type: '',
      sortBy: 'rating',
      order: 'desc'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  const hasActiveFilters = () => {
    return filters.minPrice || filters.maxPrice || filters.bedrooms || filters.type;
  };
  
  const filteredBySearch = properties.filter(prop => 
    searchTerm === '' || 
    prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate page info for display
  const startItem = ((currentPage - 1) * 9) + 1;
  const endItem = Math.min(currentPage * 9, pagination?.totalProperties || 0);
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading Chennai properties...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error Loading Properties</h2>
        <p>{error}</p>
        <button onClick={fetchProperties} style={styles.retryButton}>Retry</button>
      </div>
    );
  }
  
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Properties in Chennai</h1>
        <p style={styles.count}>{pagination?.totalProperties || 0} properties available</p>
        {pagination && pagination.totalProperties > 0 && (
          <p style={styles.pageInfo}>
            Showing {startItem} - {endItem} of {pagination.totalProperties} properties
          </p>
        )}
      </div>
      
      {/* Search Bar */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>
            <FaSearch />
          </div>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search by property name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button style={styles.clearSearch} onClick={() => setSearchTerm('')}>
              <FaTimes />
            </button>
          )}
        </div>
        {searchTerm && (
          <div style={styles.searchStats}>
            Found {filteredBySearch.length} results for "{searchTerm}"
          </div>
        )}
      </div>
      
      {/* Filters Bar */}
      <div style={styles.filtersBar}>
        <button style={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
          {hasActiveFilters() && <span style={styles.filterBadge}>●</span>}
        </button>
        
        <div style={styles.sortSection}>
          <FaSort />
          <select 
            style={styles.sortSelect} 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="rating">Top Rated</option>
            <option value="price">Price</option>
            <option value="reviewCount">Most Reviewed</option>
            <option value="createdAt">Newest</option>
          </select>
          {filters.sortBy === 'price' && (
            <select 
              style={styles.sortOrderSelect}
              value={filters.order}
              onChange={(e) => handleFilterChange('order', e.target.value)}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          )}
        </div>
        
        {hasActiveFilters() && (
          <button style={styles.clearFiltersBtn} onClick={clearFilters}>
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Property Type</label>
            <div style={styles.filterButtons}>
              <button 
                style={{...styles.filterChip, ...(!filters.type ? styles.filterChipActive : {})}}
                onClick={() => handleFilterChange('type', '')}
              >
                All ({pagination?.totalProperties || 0})
              </button>
              {propertyTypes.map(type => (
                <button 
                  key={type._id}
                  style={{...styles.filterChip, ...(filters.type === type._id ? styles.filterChipActive : {})}}
                  onClick={() => handleFilterChange('type', type._id)}
                >
                  {type._id}s ({type.count})
                </button>
              ))}
            </div>
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Price Range (per night)</label>
            <div style={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                style={styles.priceInput}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span style={styles.priceDash}>-</span>
              <input
                type="number"
                placeholder="Max"
                style={styles.priceInput}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Bedrooms</label>
            <div style={styles.bedroomButtons}>
              {[0, 1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  style={{...styles.bedroomChip, ...(parseInt(filters.bedrooms) === num ? styles.bedroomChipActive : {})}}
                  onClick={() => handleFilterChange('bedrooms', num === 0 ? '' : num)}
                >
                  {num === 0 ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Properties Grid */}
      {filteredBySearch.length === 0 ? (
        <div style={styles.noResults}>
          <div style={styles.noResultsIcon}>🏠</div>
          <h3>No properties found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={clearFilters} style={styles.clearFiltersBtn}>Clear All Filters</button>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {filteredBySearch.map(property => (
              <Link to={`/property/${property._id}`} key={property._id} style={styles.cardLink}>
                <div style={styles.card} className="property-card">
                  <div style={styles.imageContainer}>
                    <img 
                      src={getImageUrl(property.image || property.images?.[0])} 
                      alt={property.title}
                      style={styles.image}
                      className="property-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <span style={styles.locationBadge}>
                      <FaMapMarkerAlt /> {property.location?.split(',')[0] || 'Chennai'}
                    </span>
                    {property.isGuestFavourite && (
                      <span style={styles.favouriteBadge}>✨ Guest favourite</span>
                    )}
                    {property.isSuperhost && (
                      <span style={styles.superhostBadge}>⭐ Superhost</span>
                    )}
                    <button style={styles.saveButton} className="save-button" onClick={(e) => e.preventDefault()}>
                      <FaHeart />
                    </button>
                  </div>
                  <div style={styles.info}>
                    <div style={styles.titleRow}>
                      <h3 style={styles.cardTitle}>{property.title}</h3>
                      {property.rating > 0 && (
                        <div style={styles.rating}>
                          <FaStar style={styles.star} />
                          <span>{property.rating}</span>
                          <span style={styles.reviews}>({property.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <p style={styles.locationText}>
                      <FaMapMarkerAlt style={styles.smallIcon} /> {property.location}
                    </p>
                    <p style={styles.description}>{property.description?.substring(0, 100)}...</p>
                    <div style={styles.details}>
                      <span><FaBed /> {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
                      <span><FaBath /> {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
                      <span><FaUsers /> {property.guests} guests</span>
                    </div>
                    <div style={styles.priceRow}>
                      <div style={styles.price}>
                        {formatPrice(property.price)} <span style={styles.priceSpan}>night</span>
                      </div>
                      <span style={styles.totalPrice}>
                        {formatPrice(property.price + (property.cleaningFee || 0) + (property.serviceFee || 0))} total
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button 
                style={{...styles.pageButton, ...(currentPage === 1 ? styles.pageButtonDisabled : {})}}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft /> Previous
              </button>
              <div style={styles.pageNumbers}>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      style={{...styles.pageNumber, ...(currentPage === pageNum ? styles.pageNumberActive : {})}}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button 
                style={{...styles.pageButton, ...(currentPage === pagination.totalPages ? styles.pageButtonDisabled : {})}}
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
          
          {/* Page Size Indicator */}
          <div style={styles.pageSizeIndicator}>
            <span>Showing 9 properties per page</span>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px 80px',
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#222222',
    marginBottom: '8px'
  },
  count: {
    color: '#717171',
    fontSize: '16px'
  },
  pageInfo: {
    color: '#717171',
    fontSize: '14px',
    marginTop: '4px'
  },
  searchSection: {
    marginBottom: '24px'
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%'
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    color: '#717171',
    fontSize: '18px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '16px 50px 16px 50px',
    fontSize: '16px',
    border: '1px solid #dddddd',
    borderRadius: '40px',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'white'
  },
  clearSearch: {
    position: 'absolute',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#717171',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  searchStats: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#717171'
  },
  filtersBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  filterBadge: {
    color: '#ff385c',
    fontSize: '10px',
    marginLeft: '4px'
  },
  sortSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '40px'
  },
  sortSelect: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none'
  },
  sortOrderSelect: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    color: '#ff385c'
  },
  clearFiltersBtn: {
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    color: '#ff385c',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filtersPanel: {
    background: '#ffffff',
    border: '1px solid #dddddd',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '32px'
  },
  filterGroup: {
    marginBottom: '24px'
  },
  filterLabel: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#222'
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  filterChip: {
    padding: '8px 18px',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  filterChipActive: {
    background: '#222',
    color: 'white',
    borderColor: '#222'
  },
  priceInputs: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  priceInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #dddddd',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  priceDash: {
    color: '#717171'
  },
  bedroomButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  bedroomChip: {
    padding: '8px 18px',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  bedroomChipActive: {
    background: '#222',
    color: 'white',
    borderColor: '#222'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  },
  card: {
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    background: 'white',
    cursor: 'pointer'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '66.67%',
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: '#f7f7f7'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  locationBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backdropFilter: 'blur(4px)',
    zIndex: 2
  },
  favouriteBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '12px',
    backdropFilter: 'blur(4px)',
    zIndex: 2
  },
  superhostBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#ffd700',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '12px',
    backdropFilter: 'blur(4px)',
    zIndex: 2
  },
  saveButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    zIndex: 2
  },
  info: {
    padding: '12px 8px 8px 8px'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    lineHeight: '1.3',
    flex: 1,
    paddingRight: '10px',
    color: '#222',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  star: {
    color: '#222222'
  },
  reviews: {
    color: '#717171'
  },
  locationText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#717171',
    fontSize: '13px',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  smallIcon: {
    fontSize: '11px'
  },
  description: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '12px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  details: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#717171',
    marginBottom: '8px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '4px'
  },
  price: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222'
  },
  priceSpan: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#717171'
  },
  totalPrice: {
    fontSize: '13px',
    color: '#717171',
    textDecoration: 'underline'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #f0f0f0',
    borderTop: '3px solid #ff385c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  retryButton: {
    marginTop: '20px',
    padding: '12px 24px',
    background: '#ff385c',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500'
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  noResultsIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '48px',
    padding: '20px 0'
  },
  pageButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  pageNumbers: {
    display: 'flex',
    gap: '8px'
  },
  pageNumber: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    border: '1px solid #dddddd',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  pageNumberActive: {
    background: '#222',
    color: 'white',
    borderColor: '#222'
  },
  pageSizeIndicator: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '10px',
    color: '#717171',
    fontSize: '13px',
    borderTop: '1px solid #eeeeee'
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .property-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
  .property-card:hover .property-image {
    transform: scale(1.03);
  }
  
  input:focus {
    border-color: #222222 !important;
    box-shadow: 0 0 0 1px #222222;
  }
  
  .filter-toggle:hover, .sort-section:hover, .clear-filters-btn:hover {
    border-color: #222222 !important;
  }
  
  .filter-chip:hover, .bedroom-chip:hover {
    border-color: #222222;
    transform: scale(1.02);
  }
  
  .save-button:hover {
    transform: scale(1.08);
  }
  
  .page-button:hover:not(:disabled), .page-number:hover {
    border-color: #222222;
    transform: translateY(-2px);
  }
  
  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .page {
      padding: 16px 20px !important;
    }
    .grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .title {
      font-size: 24px !important;
    }
    .filters-bar {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .sort-section {
      justify-content: center !important;
    }
    .pagination {
      flex-wrap: wrap !important;
    }
  }
  
  /* Tablet view */
  @media (min-width: 769px) and (max-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ChennaiProperties;