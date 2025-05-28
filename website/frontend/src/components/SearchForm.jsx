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
    <form onSubmit={handleSubmit} style={{ marginTop: '40px', textAlign: 'center' }}>
      {/* Genre */}
      <div style={{ marginBottom: '20px' }}>
        <label>Genre: </label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
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
          {/* PLEASE ADD MORE GENRES */}
        </select>
      </div>

        {/* Page Range */}
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ marginRight: '10px', minWidth: '100px' }}>Page Range:</label>
        <input
            type="number"
            value={minPages}
            onChange={(e) => setMinPages(Number(e.target.value))}
            placeholder="Min"
            style={{ width: '80px', marginRight: '10px' }}
        />
        <span>to</span>
        <input
            type="number"
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            placeholder="Max"
            style={{ width: '80px', marginLeft: '10px' }}
        />
    </div>


      {/* Submit */}
      <button type="submit">SEARCH</button>
    </form>
  );
};

export default SearchForm;
