import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = localStorage.getItem("user");
    
    setIsLoggedIn(loggedIn);
    if (loggedIn && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="nav-wrap">
        <div className="nav-inner">
          <div className="brand" onClick={() => handleNavigation('/')}>
            <div className="brand-icon">RW</div>
            <span className="brand-text">RentWheels</span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a 
              href="/bikes" 
              className={isActive('/bikes') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/bikes');
              }}
            >
              Bikes
            </a>
            <a 
              href="/cars" 
              className={isActive('/cars') ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/cars');
              }}
            >
              Cars
            </a>
            
            <div className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
              <span className="drop-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                More ▾
              </span>
              <div className="dropdown-menu">
                <a href="/how-it-works" onClick={(e) => { e.preventDefault(); handleNavigation('/how-it-works'); }}>How It Works</a>
                <a href="/faq" onClick={(e) => { e.preventDefault(); handleNavigation('/faq'); }}>FAQ</a>
                <a href="/support" onClick={(e) => { e.preventDefault(); handleNavigation('/support'); }}>Support</a>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="profile-container">
                <div className={`profile-dropdown ${profileDropdownOpen ? 'open' : ''}`}>
                  <div className="profile-btn" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                    <div className="profile-avatar">
                      {getInitials(user?.name || user?.email || 'User')}
                    </div>
                    <span className="profile-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
                    <span style={{ fontSize: '0.8rem' }}>▼</span>
                  </div>

                  <div className="profile-menu">
                    <div className="profile-header">
                      <h4>{user?.name || 'User'}</h4>
                      <p>{user?.email || ''}</p>
                    </div>

                    <a href="/profile" className="profile-menu-item" onClick={(e) => { e.preventDefault(); handleNavigation('/profile'); }}>
                      <span>👤</span> My Profile
                    </a>
                    <a href="/my-rentals" className="profile-menu-item" onClick={(e) => { e.preventDefault(); handleNavigation('/my-rentals'); }}>
                      <span>🚗</span> My Rentals
                    </a>
                    <a href="/bookings" className="profile-menu-item" onClick={(e) => { e.preventDefault(); handleNavigation('/bookings'); }}>
                      <span>📅</span> My Bookings
                    </a>
                    <a href="/wishlist" className="profile-menu-item" onClick={(e) => { e.preventDefault(); handleNavigation('/wishlist'); }}>
                      <span>❤️</span> Wishlist
                    </a>
                    
                    <div className="menu-divider"></div>
                    
                    <button onClick={handleLogout} className="profile-menu-item logout">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>

                <button className="btn-payrent" onClick={() => handleNavigation('/pay-rent')}>
                  Pay Rent
                </button>
              </div>
            ) : (
              <div className="nav-cta">
                <button className="btn-login" onClick={() => handleNavigation('/login')}>Login</button>
                <button className="btn-register" onClick={() => handleNavigation('/register')}>Register</button>
                <button className="btn-payrent" onClick={() => handleNavigation('/pay-rent')}>Pay Rent</button>
              </div>
            )}
          </div>

          <div className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {React.isValidElement(children) 
          ? React.cloneElement(children, { onLoginSuccess: handleLoginSuccess })
          : children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>RentWheels</h3>
            <p>Your trusted partner for bike and car rentals.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="/bikes" onClick={(e) => { e.preventDefault(); handleNavigation('/bikes'); }}>Bikes</a>
            <a href="/cars" onClick={(e) => { e.preventDefault(); handleNavigation('/cars'); }}>Cars</a>
            <a href="/how-it-works" onClick={(e) => { e.preventDefault(); handleNavigation('/how-it-works'); }}>How It Works</a>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>support@rentwheels.com</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 RentWheels. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;