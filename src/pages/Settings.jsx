import React from 'react';

const Settings = () => {
  return (
    <div className="container section">
      <h1>Account Settings</h1>
      <p>Manage your account preferences and settings.</p>
      
      <div style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Language</h3>
          <select className="form-input" style={{ maxWidth: '300px' }}>
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Currency</h3>
          <select className="form-input" style={{ maxWidth: '300px' }}>
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
          </select>
        </div>

        <button className="btn btn-primary">Save Settings</button>
      </div>
    </div>
  );
};

export default Settings;