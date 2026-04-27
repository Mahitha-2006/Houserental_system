import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Only letters, numbers, and underscore';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    const result = await register(formData);
    
    if (result.success) {
      // Force a page reload to ensure Navbar updates
      window.location.href = '/';
    } else {
      setServerError(result.error);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.backLink}>
            <FaArrowLeft /> Back to home
          </Link>
          <h1 style={styles.title}>Sign up</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>
        
        {serverError && (
          <div style={styles.serverError}>
            {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full name</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            {errors.username && <span style={styles.errorText}>{errors.username}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile number</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input
                type="tel"
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                style={styles.input}
              />
            </div>
            {errors.mobile && <span style={styles.errorText}>{errors.mobile}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            <p style={styles.hint}>Must be at least 6 characters</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={loading ? {...styles.submitButton, ...styles.submitButtonDisabled} : styles.submitButton}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.footerLink}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  card: {
    maxWidth: '520px',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '48px 40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  header: {
    marginBottom: '32px'
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '24px',
    color: '#222',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
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
    marginBottom: '0'
  },
  serverError: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FF5A5F',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '24px',
    color: '#FF5A5F',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#222'
  },
  hint: {
    fontSize: '12px',
    color: '#717171',
    marginTop: '4px'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#717171',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    border: '1px solid #DDD',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF'
  },
  eyeButton: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#717171'
  },
  errorText: {
    color: '#FF5A5F',
    fontSize: '12px',
    marginTop: '4px'
  },
  submitButton: {
    backgroundColor: '#222',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s'
  },
  submitButtonDisabled: {
    backgroundColor: '#DDD',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #EBEBEB'
  },
  footerText: {
    fontSize: '14px',
    color: '#717171'
  },
  footerLink: {
    color: '#222',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Register;