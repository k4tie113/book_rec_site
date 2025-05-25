import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './images/fake_logo.png';
import SearchForm from './components/SearchForm';

function ContactPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Please let us know your feedback!</h2>
      <p>go talk to moukthika nellutla: <a href="contact moukthika nellutla">no</a></p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <img src={logo} alt="Book Logo" style={{ height: '200px' }} />
      </div>
      <SearchForm />
    </>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>
        {/* Navbar */}

        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px',
          backgroundColor: '#b6cec7',
          fontSize: '18px'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'black' }}>Contact Us</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
