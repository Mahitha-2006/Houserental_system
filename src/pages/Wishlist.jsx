import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaTrash, FaStar } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
    setLoading(false);
  };

  const removeFromWishlist = (propertyId) => {
    const updated = wishlist.filter(item => item.id !== propertyId);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price || 0);
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
      <h1 style={styles.title}>My Wishlist</h1>
      <p style={styles.subtitle}>Properties you've saved for later</p>
      
      {wishlist.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>❤️</div>
          <h3 style={styles.emptyTitle}>No saved properties yet</h3>
          <p style={styles.emptyText}>Start exploring and save properties you love!</p>
          <Link to="/browse" style={styles.browseButton}>
            Browse Properties
          </Link>
        </div>
      ) : (
        <>
          <p style={styles.countText}>{wishlist.length} saved properties</p>
          <div style={styles.grid}>
            {wishlist.map(property => (
              <div key={property.id} style={styles.card}>
                <Link to={`/property/${property.id}`} style={styles.cardLink}>
                  <div style={styles.imageContainer}>
                    <img 
                      src={property.image || 'https://via.placeholder.com/400x250?text=Property'}
                      alt={property.title}
                      style={styles.image}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=Property';
                      }}
                    />
                    {property.rating && (
                      <div style={styles.ratingBadge}>
                        <FaStar style={styles.starIcon} />
                        <span>{property.rating}</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.info}>
                    <h3 style={styles.propertyTitle}>{property.title}</h3>
                    <p style={styles.location}>{property.location}</p>
                    <div style={styles.priceRow}>
                      <p style={styles.price}>{formatPrice(property.price)}</p>
                      <span style={styles.perNight}>/ night</span>
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => removeFromWishlist(property.id)}
                  style={styles.removeButton}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
  countText: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '24px'
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
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EBEBEB',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#F7F7F7'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  ratingBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    backdropFilter: 'blur(4px)'
  },
  starIcon: {
    color: '#FF385C',
    fontSize: '10px'
  },
  info: {
    padding: '16px'
  },
  propertyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '6px',
    lineHeight: '1.3'
  },
  location: {
    fontSize: '14px',
    color: '#717171',
    marginBottom: '8px'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },
  price: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#222',
    margin: 0
  },
  perNight: {
    fontSize: '12px',
    color: '#717171'
  },
  removeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#222',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s',
    zIndex: 10
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .wishlist-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
  
  .wishlist-card:hover .wishlist-image {
    transform: scale(1.05);
  }
  
  .remove-button:hover {
    background-color: #FF5A5F;
    color: white;
  }
  
  .browse-button:hover {
    background-color: #444;
  }
`;
document.head.appendChild(styleSheet);

export default Wishlist;