//ignore (probably won't use it)
import React from 'react';
import '../App.css'
const DividerLogo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '50px',
      marginBottom: '30px'
    }}>
      <div style={{
        flex: 1,
        height: '6px',
        backgroundImage: 'linear-gradient(#ab938c 20%, transparent 36%, transparent 66%, #ab938c 20%)',
        backgroundSize: '100% 100%',
        margin: '0 30px'
      }} />
      <h1 style={{ color: 'white', fontFamily: 'Tangerine, cursive', fontSize: '60px'}}>
      Enter Your Preferences
      </h1>

      <div style={{
        flex: 1,
        height: '6px',
        backgroundImage: 'linear-gradient(#ab938c 20%, transparent 36%, transparent 66%, #ab938c 20%)',
        backgroundSize: '100% 100%',
        margin: '0 30px'
      }} />
    </div>
  );
};

export default DividerLogo;