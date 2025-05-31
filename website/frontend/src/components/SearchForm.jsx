import React, { useState } from 'react';
const SearchForm = ({ onSearch }) => {
  const [genre, setGenre] = useState('fantasy');
  const [minPages, setMinPages] = useState(0);
  const [maxPages, setMaxPages] = useState(1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchData = { genre, minPages, maxPages };
    console.log('Search submitted with:', searchData);

    if (onSearch) {
      onSearch(searchData); // optional callback to parent
    }
  };

  return (
    
    <form
    onSubmit={handleSubmit}
    style={{
      marginTop: '40px',
      textAlign: 'center',
      fontFamily: 'Monaco',
      backgroundColor: '#d7c0a1', // pastel green-blue background
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
      maxWidth: '600px',
      margin: '40px auto'
    }}
  >

    {/* Genre */}
    <div style={{ marginBottom: '25px' }}>
      <label style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '10px' }}>Genre:</label>
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '2px solidrgb(255, 255, 255)',
          backgroundColor: '#ffffff',
          fontSize: '16px',
          color: '#000000',
          fontFamily: 'Monaco'
        }}
      >
        <option value="fantasy">Fantasy</option>
        <option value="romance">Romance</option>
        <option value="mystery">Mystery</option>
        <option value="sci-fi">Sci-Fi</option>
        <option value="horror">Horror</option>
        <option value="crime">Crime</option>
        <option value="adventure">Adventure</option>
        <option value="dystopian">Dystopian</option>
        <option value="historical">Historical Fiction</option>
        <option value="shortstory">Short Story</option>
        <option value="selfhelp">Self Help</option>
        <option value="women">Women's Fiction</option>
        <option value="nonfiction">Non-Fiction</option>
        <option value="young-adult">Young Adult</option>
        <option value="teen">Teen</option>
        <option value="realistic-fiction">Realistic Fiction</option>
        <option value="high-school">High School</option>
        <option value="coming-of-age">Coming of Age</option>
        <option value="lgbtq">LGBTQ</option>
        <option value="futuristic">Futuristic</option>
        <option value="post-apocalyptic">Post Apocalyptic</option>
        <option value="mythology">Mythology</option>
        <option value="vampires">Vampires</option>
        <option value="survival">Survival</option>
      </select>
    </div>
  
    {/* Page Range */}
    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '18px', minWidth: '120px' }}>
        Page Range:
      </label>
      <input
        type="number"
        value={minPages}
        onChange={(e) => setMinPages(Number(e.target.value))}
        placeholder="Min"
        style={{
          width: '80px',
          padding: '8px',
          borderRadius: '8px',
          border: '2px solidrgb(255, 255, 255)',
          backgroundColor: '#ffffff',
          color: '#004d40',
          marginRight: '10px',
          fontFamily: 'Monaco'
        }}
      />
      <span style={{ color: '#004d40', fontWeight: 'bold' }}>to</span>
      <input
        type="number"
        value={maxPages}
        onChange={(e) => setMaxPages(Number(e.target.value))}
        placeholder="Max"
        style={{
          width: '80px',
          padding: '8px',
          borderRadius: '8px',
          border: '2px solidrgb(255, 255, 255)',
          backgroundColor: '#ffffff',
          color: '#004d40',
          marginLeft: '10px',
          fontFamily: 'Monaco'
        }}
      />
    </div>
  
    {/* Submit Button */}
    <button
      type="submit"
      style={{
        padding: '12px 30px',
        fontSize: '16px',
        fontWeight: 'bold',
        background: '#efdbc5',
        border: 'none',
        borderRadius: '10px',
        color: '#000000',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.target.style.background = '#ffffff';
      }}
      onMouseOut={(e) => {
        e.target.style.background = '#efdbc5';
      }}
    >
      SEARCH
    </button>
  </form>
  
  );
};

export default SearchForm;
