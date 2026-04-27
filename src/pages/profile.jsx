import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaUserCircle, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        mobile: user.mobile || ''
      });
    }
    setLoading(false);
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setErrorMessage('');
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error);
    }
    
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      mobile: user?.mobile || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Profile Header */}
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <FaUserCircle style={styles.avatar} />
          </div>
          <h2 style={styles.title}>My Profile</h2>
          <p style={styles.subtitle}>Manage your account information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={styles.successMessage}>
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorMessage}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Profile Information */}
        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>
              <FaUser style={styles.infoIcon} />
              <span>Username</span>
            </div>
            <div style={styles.infoValue}>
              {user.username}
            </div>
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>
              <FaEnvelope style={styles.infoIcon} />
              <span>Email</span>
            </div>
            <div style={styles.infoValue}>
              {user.email}
            </div>
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>
              <FaPhone style={styles.infoIcon} />
              <span>Mobile Number</span>
            </div>
            {isEditing ? (
              <div style={styles.editField}>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={styles.editInput}
                  maxLength="10"
                  placeholder="Enter mobile number"
                />
                {errors.mobile && <span style={styles.fieldError}>{errors.mobile}</span>}
              </div>
            ) : (
              <div style={styles.infoValue}>
                {user.mobile}
              </div>
            )}
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>
              <FaUser style={styles.infoIcon} />
              <span>Full Name</span>
            </div>
            {isEditing ? (
              <div style={styles.editField}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={styles.editInput}
                  placeholder="Enter full name"
                />
                {errors.fullName && <span style={styles.fieldError}>{errors.fullName}</span>}
              </div>
            ) : (
              <div style={styles.infoValue}>
                {user.fullName}
              </div>
            )}
          </div>

          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>
              <FaCalendarAlt style={styles.infoIcon} />
              <span>Member Since</span>
            </div>
            <div style={styles.infoValue}>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Recent'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                style={{...styles.button, ...styles.saveButton}}
                disabled={saving}
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel} 
                style={{...styles.button, ...styles.cancelButton}}
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                style={{...styles.button, ...styles.editButton}}
              >
                <FaEdit /> Edit Profile
              </button>
              <button 
                onClick={handleLogout} 
                style={{...styles.button, ...styles.logoutButton}}
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)',
    backgroundColor: '#F7F7F7',
    padding: '48px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  avatarContainer: {
    marginBottom: '16px'
  },
  avatar: {
    fontSize: '80px',
    color: '#222'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#717171'
  },
  successMessage: {
    backgroundColor: '#E8F7F5',
    border: '1px solid #00A699',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#00A699',
    fontSize: '14px',
    textAlign: 'center'
  },
  errorMessage: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FF5A5F',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#FF5A5F',
    fontSize: '14px',
    textAlign: 'center'
  },
  infoSection: {
    marginBottom: '32px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 0',
    borderBottom: '1px solid #EBEBEB',
    flexWrap: 'wrap',
    gap: '12px'
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500',
    color: '#222',
    minWidth: '140px'
  },
  infoIcon: {
    fontSize: '16px',
    color: '#717171'
  },
  infoValue: {
    color: '#222',
    flex: 1,
    wordBreak: 'break-word'
  },
  editField: {
    flex: 1,
    width: '100%'
  },
  editInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #DDD',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  fieldError: {
    display: 'block',
    color: '#FF5A5F',
    fontSize: '12px',
    marginTop: '6px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  editButton: {
    backgroundColor: '#222',
    color: 'white'
  },
  saveButton: {
    backgroundColor: '#00A699',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#717171',
    color: 'white'
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    color: 'white'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #F0F0F0',
    borderTop: '3px solid #222',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  }
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #222;
    box-shadow: 0 0 0 2px rgba(34, 34, 34, 0.1);
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;
document.head.appendChild(styleSheet);

export default Profile;