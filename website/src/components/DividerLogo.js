//ignore (probably won't use it)
import React from 'react';

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
        backgroundImage: 'linear-gradient(#ffffff 20%, transparent 20%, transparent 66%, #ffffff 20%)',
        backgroundSize: '100% 100%',
        margin: '0 30px'
      }} />
      <h1 style={{ color: 'white', fontFamily: '"Fira Code", monospace' }}>
      Complete the Form Below
      </h1>

      <div style={{
        flex: 1,
        height: '6px',
        backgroundImage: 'linear-gradient(#ffffff 20%, transparent 20%, transparent 66%, #ffffff 20%)',
        backgroundSize: '100% 100%',
        margin: '0 30px'
      }} />
    </div>
  );
};

export default DividerLogo;