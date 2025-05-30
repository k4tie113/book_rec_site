import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SearchForm from './components/SearchForm';
import ContactPage from './components/ContactPage';
import LearnMore from './components/LearnMore';
import HomepageBanner from './components/HomepageBanner';
import { motion } from 'framer-motion';
import DividerLogo from './components/DividerLogo'; // Adjust path if needed
function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Replace the image with the new banner */}
      <HomepageBanner />
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
        <Route path="/learnmore" element={<LearnMore />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div style={{
        fontFamily: 'Monaco',
        backgroundColor: '#1e140a', // adding dark brown background color
        minHeight: '100vh',
      }}>
        {/* Navbar */}
        <nav
          style={{
            position: 'fixed',       // <-- make it sticky
            top: 0,                  // <-- stick to the top
            width: '100%',          // <-- stretch across the top
            zIndex: 1000,           // <-- sit above other content
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            padding: '20px',
            backgroundColor: '#1e140a',
            fontSize: '18px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // optional: adds slight shadow
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Home</Link>
          <Link to="/learnmore" style={{ textDecoration: 'none', color: 'white' }}>Learn More</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'white' }}>Contact Us</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/learnmore" element={<LearnMore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;