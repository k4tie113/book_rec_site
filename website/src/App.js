import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SearchForm from './components/SearchForm';
import ContactPage from './components/ContactPage';
import Recommendations from './components/Recommendations';
import LearnMore from './components/LearnMore';
import HomepageBanner from './components/HomepageBanner';
import { motion } from 'framer-motion';
import BookList from './components/BookList';
import SearchButton from './components/SearchButton';
import { useNavigate } from 'react-router-dom';

function HomePage() {


  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = React.useState('fantasy');
  const [minPage, setMinPage] = React.useState(0);
  const [maxPage, setMaxPage] = React.useState(1000);
  const [userBooks, setUserBooks] = React.useState([{ title: null, liked: null }]);

  const handleSearch = () => {
    const payload = {
      genre: selectedGenre,
      min_pages: minPage,
      max_pages: maxPage,
      user_feedback: userBooks.map(b => ({
        title: b.title?.value || "",
        liked: b.liked === "liked"
      }))
    };

    fetch("http://127.0.0.1:5000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert("📚 Recommendations received!");  // Temp: Replace with navigation + state later
        console.log(data);
      })
      .catch(err => {
        console.error("❌ API call failed:", err);
        alert("❌ API call failed");
      });
  };

  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Replace the image with the new banner */}
      <HomepageBanner />
      <SearchForm
      genre={selectedGenre}
      setGenre={setSelectedGenre}
      minPage={minPage}
      setMinPage={setMinPage}
      maxPage={maxPage}
      setMaxPage={setMaxPage}
      />
      <BookList books={userBooks} setBooks={setUserBooks} />
      <SearchButton onClick={handleSearch} />
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
        {/* pushes the content down */}
        <div style={{ paddingTop: '80px' }}></div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/learnmore" element={<LearnMore />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;