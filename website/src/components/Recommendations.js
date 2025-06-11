import React from 'react';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../images/bookrates.png';
import dividerLogo from '../images/logo.png'
const Recommendations = () => {
  const location = useLocation();
  const recs = location.state?.recommendations?.slice(0, 5) || [];

  return (
    <div
      style={{
        padding: '70px',
        fontFamily: 'Monaco',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <div style={{
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px', // spacing between logo and text
    marginBottom: '20px'
}}>
  <img src={dividerLogo} alt="Left Divider" style={{ height: '30px' }} />
  <h1 style={{ margin: 0, textAlign: 'center' }}>
    Your Top Recommendations
  </h1>
  <img src={dividerLogo} alt="Right Divider" style={{ height: '30px' }} />
</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {recs.map((book, idx) => {
          const cleanTitle = book.title.replace(/\s*\([^)]*\)\s*$/, '');

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // same as #banner .inner
                color: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                maxWidth: '850px',
                margin: '0 auto',
              }}
            >
              <img
                src={book.image_url}
                alt={cleanTitle}
                style={{
                  width: '120px',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '20px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0, marginBottom: '10px' }}>{cleanTitle}</h2>
                <p style={{ fontSize: '14px', lineHeight: '1.5', wordWrap: 'break-word' }}>
                  {book.description
                    ? `${book.description.slice(0, 500)}...`
                    : 'No description available.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
