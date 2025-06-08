import React from 'react';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const location = useLocation();
  const recs = location.state?.recommendations || [];

  return (
    <div style={{ padding: '40px', color: 'white', fontFamily: 'Monaco' }}>
      <h1 style={{ marginBottom: '30px' }}>Your Book Recommendations</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '30px' 
      }}>
        {recs.map((book, idx) => {
          const cleanTitle = book.title.replace(/\s*\([^)]*\)\s*$/, '');

          return (
            <div 
              key={idx} 
              style={{ 
                backgroundColor: '#222', 
                padding: '20px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' 
              }}
            >
              {book.image_url ? (
              <img
                src={book.image_url}
                alt={cleanTitle}
                style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    borderRadius: '8px', 
                    marginBottom: '12px',
                    maxHeight: '320px' 
                }}
                />
                ) : (
                  <div style={{ 
                    height: '320px', 
                    background: '#444', 
                    borderRadius: '8px', 
                    marginBottom: '12px' 
                }} />
                )}

              <h3 style={{ marginBottom: '10px' }}>{cleanTitle}</h3>


              <p style={{ fontSize: '14px', color: '#ccc' }}>
                {book.description ? `${book.description.slice(0, 500)}...` : 'No description available.'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
