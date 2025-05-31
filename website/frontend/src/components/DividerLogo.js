import React from 'react';
import dividerLogo from '../images/logo.png';

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
        backgroundImage: 'linear-gradient(#635d7c 33%, transparent 33%, transparent 66%, #635d7c 66%)',
        backgroundSize: '100% 100%',
        margin: '0 20px'
      }} />
      <img src={dividerLogo} alt="Divider Logo" style={{ height: '40px' }} />
      <div style={{
        flex: 1,
        height: '6px',
        backgroundImage: 'linear-gradient(#635d7c 33%, transparent 33%, transparent 66%, #635d7c 66%)',
        backgroundSize: '100% 100%',
        margin: '0 20px'
      }} />
    </div>
  );
};

export default DividerLogo;