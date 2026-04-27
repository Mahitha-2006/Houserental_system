import React from 'react';

const MyRentals = () => {
  return (
    <div className="container section">
      <h1>My Rentals</h1>
      <p>View and manage your current and past rentals.</p>
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No rentals found.</p>
        <button className="btn btn-primary" style={{ marginTop: '20px' }}>
          Browse Rentals
        </button>
      </div>
    </div>
  );
};

export default MyRentals;