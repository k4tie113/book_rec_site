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
import DividerLogo from './components/DividerLogo';
import ScrollToTop from './components/ScrollToTop';
import grainyBackground from './images/bg.png';

function HomePage() {


  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = React.useState('fantasy');
  const [minPage, setMinPage] = React.useState(0);
  const [maxPage, setMaxPage] = React.useState(1000);
  const [userBooks, setUserBooks] = React.useState([{ title: null, liked: null }]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = () => {
    setLoading(true);
    const minPageNum = parseInt(minPage, 10);
    const maxPageNum = parseInt(maxPage, 10);

    //alert("Parsed min: " + minPageNum + " max: " + maxPageNum);

    if (
      isNaN(minPageNum) ||
      isNaN(maxPageNum) ||
      minPageNum < 0 ||
      maxPageNum < 1 ||
      minPageNum > maxPageNum
    ) {
      alert("Invalid page range.");
      setLoading(false);
      return;
    }

    const payload = {
      genre: selectedGenre,
      min_pages: minPageNum,
      max_pages: maxPageNum,
      user_feedback: userBooks.map(b => ({
        title: b.title?.value || "",
        liked: b.liked === "liked"
      }))
    };
    // FOR LOCAL TESTING: http://127.0.0.1:5000/api/recommend
    // FOR WEB TESTING: https://bookrates.onrender.com/api/recommend
    fetch("https://bookrates.onrender.com/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        navigate("/recommendations", { state: { recommendations: data } });
      })
      .catch(err => {
        console.error("Fetch error:", err);
        alert("Sorry, something went wrong, and we weren't able to process your input. Try filling out the form again!");
      })
      .finally(() => setLoading(false)); // Stop loading
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
      <DividerLogo />
      <SearchForm
      genre={selectedGenre}
      setGenre={setSelectedGenre}
      minPage={minPage}
      setMinPage={setMinPage}
      maxPage={maxPage}
      setMaxPage={setMaxPage}
      />
      <BookList books={userBooks} setBooks={setUserBooks} />
      {loading ? (
        <div className="loader" style = {{marginTop: '30px'}}/>
          ) : (
        <SearchButton onClick={handleSearch} />
        )}
      <div style={{ paddingTop: '80px' }}></div>
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
        backgroundImage: `url(${grainyBackground})`, // Use the imported image
        backgroundRepeat: 'repeat', // Makes the grainy texture repeat
        backgroundSize: 'auto',
        minHeight: '100vh',
      }}>
        {/* Navbar */}
        <nav
          style={{
            position: 'fixed',       // make it sticky
            top: 0,                  // stick to the top
            width: '100%',          // stretch across the top
            zIndex: 1000,           // sit above other content
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            padding: '20px',
            backgroundColor: '#1e140a',
            fontSize: '18px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // adds slight shadow
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'white', fontFamily: '"Fira Code", monospace' }}>Home</Link>
          <Link to="/learnmore" style={{ textDecoration: 'none', color: 'white', fontFamily: '"Fira Code", monospace' }}>Learn More</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'white', fontFamily: '"Fira Code", monospace' }}>Contact Us</Link>
        </nav>

        {/* Routes */}
        <ScrollToTop />
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