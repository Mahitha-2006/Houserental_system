import React from 'react';

const Payments = () => {
  return (
    <div className="container section">
      <h1>Payment History</h1>
      <p>View your past payments and transactions.</p>
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No payment history found.</p>
      </div>
    </div>
  );
};

export default Payments;