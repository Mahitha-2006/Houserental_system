import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import './Register.css';

const API_URL = 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: 'Please enter your email address first' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: 'Enter a valid email address' });
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        startCountdown();
        setErrors({ ...errors, email: '' });
        alert('OTP sent to your email!');
      } else {
        setServerError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ ...errors, otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otp })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        setErrors({ ...errors, otp: '' });
        alert('Email verified successfully!');
      } else {
        setErrors({ ...errors, otp: data.error || 'Invalid OTP' });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 3) newErrors.fullName = 'Name must be at least 3 characters';
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Only letters, numbers, and underscore';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!otpVerified) newErrors.otp = 'Please verify your email first';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setServerError('');

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Create complete user object with all fields
        const userData = {
          id: data.user.id,
          fullName: data.user.fullName,
          username: data.user.username,
          email: data.user.email,
          mobile: data.user.mobile,
          createdAt: new Date().toISOString()
        };
        
        // Store user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Call login function from AuthContext
        login(userData, data.token);
        
        // Navigate to home
        navigate('/');
      } else {
        setServerError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setServerError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <Link to="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'left', marginBottom: '20px' }}>
          <FaArrowLeft style={{ color: '#ff385c' }} /> Back
        </Link>
        <h2>Create account</h2>
        <p>Join RentEase to book your perfect stay</p>
        
        {serverError && <div className="auth-error">{serverError}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="auth-error-text">{errors.fullName}</span>}
          
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="auth-error-text">{errors.username}</span>}
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={otpVerified}
              style={{ flex: 1, ...(otpVerified ? { backgroundColor: '#e8f5e9', borderColor: '#4caf50' } : {}) }}
            />
            {!otpVerified && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || countdown > 0 || !formData.email}
                className="auth-otp-btn"
              >
                {countdown > 0 ? `${countdown}s` : (otpSent ? 'Resend' : 'Send OTP')}
              </button>
            )}
            {otpVerified && <span style={{ color: '#4caf50', fontSize: '14px' }}>✓ Verified</span>}
          </div>
          {errors.email && <span className="auth-error-text">{errors.email}</span>}
          
          {otpSent && !otpVerified && (
            <>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  style={{ flex: 1, textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="auth-verify-btn"
                >
                  Verify
                </button>
              </div>
              {errors.otp && <span className="auth-error-text">{errors.otp}</span>}
              <p style={{ fontSize: '12px', color: '#666', marginTop: '-10px' }}>
                OTP sent to {formData.email}
              </p>
            </>
          )}
          
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile number (10 digits)"
            value={formData.mobile}
            onChange={handleChange}
            maxLength="10"
          />
          {errors.mobile && <span className="auth-error-text">{errors.mobile}</span>}
          
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <span className="auth-error-text">{errors.password}</span>}
          
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <span className="auth-error-text">{errors.confirmPassword}</span>}
          
          <button 
            type="submit" 
            disabled={loading || !otpVerified} 
            className="auth-btn"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;