import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal
} from 'react-icons/fa';

// Import Apple and Google icons from different packages
import { FaApple, FaGooglePlay } from 'react-icons/fa6'; // For newer icons
// OR use these if fa6 doesn't work:
// import { AiFillApple, AiFillGoogleCircle } from 'react-icons/ai';
// import { IoLogoApple, IoLogoGoogle } from 'react-icons/io';

import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <h3 className="footer-title">StayVista</h3>
              <p className="footer-description">
                Find your perfect stay anywhere in the world. From cozy apartments to luxury villas, we have it all.
              </p>
              <div className="contact-info">
                <p>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Business Ave, New York, NY 10001</span>
                </p>
                <p>
                  <FaPhone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </p>
                <p>
                  <FaEnvelope className="contact-icon" />
                  <span>support@stayvista.com</span>
                </p>
                <p>
                  <FaGlobe className="contact-icon" />
                  <span>www.stayvista.com</span>
                </p>
              </div>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
              </ul>
            </div>

            {/* Explore */}
            <div className="footer-section">
              <h3 className="footer-title">Explore</h3>
              <ul className="footer-links">
                <li><Link to="/browse?location=new-york">New York</Link></li>
                <li><Link to="/browse?location=los-angeles">Los Angeles</Link></li>
                <li><Link to="/browse?location=chicago">Chicago</Link></li>
                <li><Link to="/browse?location=miami">Miami</Link></li>
                <li><Link to="/browse?location=las-vegas">Las Vegas</Link></li>
                <li><Link to="/browse?type=beach">Beach Properties</Link></li>
                <li><Link to="/browse?type=mountain">Mountain Retreats</Link></li>
                <li><Link to="/browse?type=luxury">Luxury Stays</Link></li>
              </ul>
            </div>

            {/* For Hosts */}
            <div className="footer-section">
              <h3 className="footer-title">For Hosts</h3>
              <ul className="footer-links">
                <li><Link to="/become-host">Become a Host</Link></li>
                <li><Link to="/host-guide">Hosting Guide</Link></li>
                <li><Link to="/host-resources">Host Resources</Link></li>
                <li><Link to="/community">Community Forum</Link></li>
                <li><Link to="/insurance">Host Insurance</Link></li>
                <li><Link to="/refer">Refer a Host</Link></li>
              </ul>
            </div>

            {/* Download App */}
            <div className="footer-section">
              <h3 className="footer-title">Download Our App</h3>
              <p className="app-text">Book on the go with our mobile app</p>
              <div className="app-buttons">
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="app-button">
                  <FaApple className="app-icon" />
                  <div className="app-button-text">
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-button">
                  <FaGooglePlay className="app-icon" />
                  <div className="app-button-text">
                    <span>GET IT ON</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-section">
              <h3 className="footer-title">Newsletter</h3>
              <p className="newsletter-text">
                Subscribe to get special offers, free giveaways, and travel inspiration.
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="container">
          <div className="badges-grid">
            <div className="badge-item">
              <img src="https://via.placeholder.com/50x30" alt="Secure Payment" />
              <span>Secure Payments</span>
            </div>
            <div className="badge-item">
              <img src="https://via.placeholder.com/50x30" alt="Verified Hosts" />
              <span>Verified Hosts</span>
            </div>
            <div className="badge-item">
              <img src="https://via.placeholder.com/50x30" alt="24/7 Support" />
              <span>24/7 Support</span>
            </div>
            <div className="badge-item">
              <img src="https://via.placeholder.com/50x30" alt="Best Price Guarantee" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        <div className="container">
          <div className="payment-grid">
            <span>We Accept:</span>
            <FaCcVisa className="payment-icon" />
            <FaCcMastercard className="payment-icon" />
            <FaCcAmex className="payment-icon" />
            <FaCcPaypal className="payment-icon" />
            <img src="https://via.placeholder.com/40x25" alt="Discover" className="payment-icon" />
            <img src="https://via.placeholder.com/40x25" alt="JCB" className="payment-icon" />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} StayVista. All rights reserved. | Designed with ❤️ for travelers
            </p>
            <div className="footer-bottom-links">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/accessibility">Accessibility</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
            <div className="language-currency">
              <select className="footer-select">
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh">中文</option>
                <option value="hi">हिन्दी</option>
              </select>
              <select className="footer-select">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="jpy">JPY (¥)</option>
                <option value="inr">INR (₹)</option>
                <option value="aud">AUD ($)</option>
                <option value="cad">CAD ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;