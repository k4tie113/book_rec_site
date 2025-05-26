import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import logo from './images/fake_logo.png';
import SearchForm from './components/SearchForm';
import { motion } from 'framer-motion';



function ContactPage() {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5 }}
    style={{ textAlign: 'center', padding: '50px'}}
  >
    <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>
      <h2>Please let us know your feedback!</h2>
      <p>Let us know if we need to make any improvements with our recommendations! <a href="https://form.typeform.com/to/t9GHM87l">Suggestion Form</a></p>
    </div>
    </motion.div>
  );
}

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
   
      <div style={{ textAlign: 'center', marginTop: '40px', }}>
        <img src={logo} alt="Book Logo" style={{ height: '200px' }} />
      </div>
      <SearchForm />
      </motion.div>

  );
}
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Georgia', backgroundColor: '#d8e0bb', minHeight: '100vh' }}>
        {/* Welcome Header */}
        <header style={{
          textAlign: 'center',
          padding: '30px 0 10px 0',
          fontSize: '32px',
          fontWeight: 'bold',
          backgroundColor: '#86a3c3',
          color: '#333',
        }}>
          Welcome
        </header>

        {/* Navbar */}

        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px',
          backgroundColor: '#b6cec7',
          fontSize: '18px',
   
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
          <Link to="/contact" className="fade-in-link" style={{ textDecoration: 'none', color: 'black',backgroundColor: '#b6cec7' }}>Contact Us</Link>
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
