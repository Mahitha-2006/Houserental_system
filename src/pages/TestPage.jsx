// src/pages/TestPage.jsx
import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>✅ Test Page - React is Working!</h1>
      <p>If you can see this, React is running correctly.</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          background: '#ff385c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

export default TestPage;