import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCalendarAlt, FaHeart, FaQuestionCircle, FaChevronDown, FaListAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHelpMenu && !event.target.closest('.help-menu')) {
        setShowHelpMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showHelpMenu]);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>RentEase</span>
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/browse" style={styles.navLink}>
            <FaHome style={styles.navIcon} /> Browse
          </Link>
          
          {/* Help Dropdown */}
          <div className="help-menu" style={styles.dropdown}>
            <button 
              onClick={() => setShowHelpMenu(!showHelpMenu)} 
              style={styles.helpButton}
            >
              <FaQuestionCircle style={styles.navIcon} /> Help <FaChevronDown style={styles.dropdownIcon} />
            </button>
            {showHelpMenu && (
              <div style={styles.dropdownMenu}>
                <Link to="/how-it-works" style={styles.dropdownItem}>How it works</Link>
                <Link to="/faq" style={styles.dropdownItem}>FAQ</Link>
                <Link to="/contact" style={styles.dropdownItem}>Contact us</Link>
              </div>
            )}
          </div>
          
          {isAuthenticated && user ? (
            <>
              <Link to="/my-bookings" style={styles.navLink}>
                <FaCalendarAlt style={styles.navIcon} /> Bookings
              </Link>
              <Link to="/my-listings" style={styles.navLink}>
                <FaListAlt style={styles.navIcon} /> My Listings
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
            <div style={styles.authContainer}>
              <Link to="/register" style={styles.signupBtn}>Sign up</Link>
              <Link to="/login" style={styles.loginBtn}>Log in</Link>
            </div>
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
    gap: '24px',
    flexWrap: 'wrap'
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
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  signupBtn: {
    backgroundColor: '#222',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '32px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  loginBtn: {
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px'
  },
  dropdown: {
    position: 'relative'
  },
  helpButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#222',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 0'
  },
  dropdownIcon: {
    fontSize: '10px',
    marginLeft: '2px'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    border: '1px solid #EBEBEB',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    minWidth: '160px',
    marginTop: '12px',
    zIndex: 100,
    overflow: 'hidden'
  },
  dropdownItem: {
    display: 'block',
    padding: '12px 20px',
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background 0.2s'
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
    fontWeight: '500'
  }
};

// Add hover styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .dropdown-item:hover {
    background-color: #F7F7F7;
  }
  
  .help-button:hover {
    color: #717171;
  }
  
  .nav-link:hover {
    color: #717171;
  }
  
  .profile-link:hover {
    background-color: #F7F7F7;
    border-color: #222;
  }
  
  .signup-btn:hover {
    background-color: #444;
  }
  
  .login-btn:hover {
    color: #FF385C;
  }
  
  .logout-btn:hover {
    background-color: #dc2626;
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;