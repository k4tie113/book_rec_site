import React from 'react';

const SearchButton = ({ onClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: '#ab938c',
          color: 'black',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '15px',
          fontWeight: 'bold',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'white'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ab938c'}
      >
        SEARCH
      </button>
    </div>
  );
};

export default SearchButton;
