import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [genre, setGenre] = useState('fantasy');
  const [age, setAge] = useState(18);
  const [minPages, setMinPages] = useState(0);
  const [maxPages, setMaxPages] = useState(1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchData = { genre, age, minPages, maxPages };
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
          {/* PLEASE ADD MORE GENRES */}
        </select>
      </div>

      {/* Age */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ marginRight: '10px', minWidth: '50px' }}>Age:</label>
        <input
            type="number"
            min="1"
            max="100"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ width: '100px' }}
        />
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
