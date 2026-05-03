import React from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

const HowItWorks = () => {
  const steps = [
    { 
      number: 1, 
      title: "Search for Properties", 
      description: "Browse through our extensive collection of properties across multiple cities. Use filters to narrow down your search by location, price, amenities, and more.", 
      icon: "🔍" 
    },
    { 
      number: 2, 
      title: "View Property Details", 
      description: "Check out detailed property information including photos, amenities, house rules, cancellation policies, and genuine guest reviews.", 
      icon: "🏠" 
    },
    { 
      number: 3, 
      title: "Book Your Stay", 
      description: "Select your dates, choose the number of guests, and confirm your booking. You'll receive instant confirmation via email.", 
      icon: "📅" 
    },
    { 
      number: 4, 
      title: "Contact Host", 
      description: "Have questions? Message the host directly through our platform. Hosts typically respond within an hour.", 
      icon: "💬" 
    },
    { 
      number: 5, 
      title: "Enjoy Your Trip", 
      description: "Check in, relax, and enjoy your stay. Leave a review after your trip to help other travelers.", 
      icon: "✨" 
    }
  ];

  const tips = [
    { text: "Always read the house rules before booking", icon: "📋" },
    { text: "Check cancellation policies for flexibility", icon: "🔄" },
    { text: "Contact host if you have special requirements", icon: "📞" },
    { text: "Verify your identity for faster check-in", icon: "✅" },
    { text: "Leave honest reviews to help the community", icon: "⭐" }
  ];

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>How It Works</h1>
        <p>Your complete guide to booking and staying with us</p>
      </div>

      <div className="how-it-works-container">
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="tips-section">
          <h2>Quick Tips for First-Time Users</h2>
          <div className="tips-grid">
            {tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">{tip.icon}</span>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="help-cta">
          <h2>Need Immediate Assistance?</h2>
          <p>Our support team is available 24/7 to help you with any issues or questions.</p>
          <Link to="/contact" className="help-contact-btn">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;