import React, { useState } from 'react';
import './Help.css';

const HelpContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    { icon: "📞", title: "Phone Support", detail: "+91 98765 43210", note: "Available 24/7" },
    { icon: "✉️", title: "Email Us", detail: "support@homerentalsystem.com", note: "Response within 24 hours" },
    { icon: "💬", title: "Live Chat", detail: "Chat with our support team", note: "Available 9 AM - 9 PM IST" },
    { icon: "📍", title: "Office Address", detail: "Bangalore, Karnataka, India - 560001", note: "Visit us Mon-Fri" }
  ];

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to our support team</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-method">
              <div className="contact-icon">{method.icon}</div>
              <div>
                <h3>{method.title}</h3>
                <p>{method.detail}</p>
                <small>{method.note}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Property Question">Property Question</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Partnership">Partnership / Business</option>
                <option value="Feedback">Feedback / Suggestion</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your issue or question in detail..."
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpContact;