import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCalendarAlt, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Log for debugging
  useEffect(() => {
    console.log('Navbar updated - isAuthenticated:', isAuthenticated, 'user:', user);
  }, [isAuthenticated, user]);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>RentEase</span>
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/browse" style={styles.navLink}>Browse</Link>
          
          {isAuthenticated && user ? (
            <>
              <Link to="/my-bookings" style={styles.navLink}>
                <FaCalendarAlt style={styles.navIcon} /> Bookings
              </Link>
              <Link to="/wishlist" style={styles.navLink}>
                <FaHeart style={styles.navIcon} /> Wishlist
              </Link>
              <div style={styles.userMenu}>
                <Link to="/profile" style={styles.profileLink}>
                  <FaUserCircle style={styles.userIcon} />
                  <span>{user?.fullName?.split(' ')[0] || user?.username || 'User'}</span>
                </Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginLink}>Log in</Link>
              <Link to="/register" style={styles.registerBtn}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    padding: '14px 80px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #EBEBEB'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  logoIcon: {
    fontSize: '26px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#222'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  navIcon: {
    fontSize: '14px'
  },
  loginLink: {
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px'
  },
  registerBtn: {
    backgroundColor: '#222',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '32px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '32px',
    border: '1px solid #DDD'
  },
  userIcon: {
    fontSize: '22px',
    color: '#717171'
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '32px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  }
};

export default Navbar;