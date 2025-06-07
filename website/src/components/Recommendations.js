import React from 'react';

const Recommendations = () => {
  return (
    <div style={{
      marginTop: '40px',
      backgroundColor: '#d9c1a4',
      padding: '30px',
      borderRadius: '20px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ textAlign: 'center' }}>Your Recommendations</h2>
      <p style={{ textAlign: 'center' }}>This is where personalized book recommendations will appear.</p>
    </div>
  );
};

export default Recommendations;
