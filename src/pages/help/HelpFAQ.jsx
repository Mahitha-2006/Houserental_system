import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

const HelpFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "How do I search for properties?",
      answer: "You can search by city name, use filters for price range, number of bedrooms, amenities, and property type. The search bar is located at the top of the homepage."
    },
    {
      question: "How do I book a property?",
      answer: "After finding a property you like, select your check-in and check-out dates, number of guests, then click 'Book Now'. Follow the payment instructions to confirm your booking."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation policies vary by property. Most properties offer free cancellation within 48 hours of booking. Check the property's cancellation policy before booking."
    },
    {
      question: "How can I contact the host?",
      answer: "You can message hosts directly through our platform. Go to your booking details and click 'Contact Host'. Hosts typically respond within an hour."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments are processed through secure payment gateways. We use encryption to protect your financial information."
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "You can modify or cancel bookings from your 'My Bookings' page. Refund eligibility depends on the property's cancellation policy."
    },
    {
      question: "What documents are required for check-in?",
      answer: "All guests must provide a valid government-issued ID (Aadhar Card, Driving License, or Passport) at check-in as per government regulations."
    },
    {
      question: "Are pets allowed on the property?",
      answer: "Pet policies vary by property. Check the property's house rules for pet policy. Some properties are pet-friendly with additional fees."
    },
    {
      question: "How is the rating calculated?",
      answer: "Ratings are based on guest reviews across categories: cleanliness, accuracy, communication, location, check-in experience, and value for money."
    },
    {
      question: "What if I have an issue during my stay?",
      answer: "Contact the host immediately through our platform. If the issue isn't resolved, reach out to our customer support team for assistance."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to common questions</p>
      </div>

      <div className="faq-search">
        <input 
          type="text" 
          placeholder="Search FAQs..." 
          className="faq-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="faq-container">
        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="help-cta">
        <h2>Still have questions?</h2>
        <p>Can't find what you're looking for? Our support team is here to help.</p>
        <Link to="/contact" className="help-contact-btn">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default HelpFAQ;