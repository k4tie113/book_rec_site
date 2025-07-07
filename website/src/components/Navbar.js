import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#FFD700' : 'white', // gold if active
    borderBottom: location.pathname === path ? '2px solid #FFD700' : 'none',
    paddingBottom: '4px',
    fontFamily: '"Fira Code", monospace',
    transition: 'all 0.3s ease',
  });

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px',
        backgroundColor: '#1e140a',
        fontSize: '18px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link to="/" style={linkStyle('/')}>Home</Link>
      <Link to="/learnmore" style={linkStyle('/learnmore')}>Learn More</Link>
      <Link to="/contact" style={linkStyle('/contact')}>Contact Us</Link>
    </nav>
  );
};

export default Navbar;
