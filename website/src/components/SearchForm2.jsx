import React from 'react';

const SearchForm = ({ genre, setGenre, minPage, setMinPage, maxPage, setMaxPage }) => {
  return (
    <form
      style={{
        marginTop: '40px',
        textAlign: 'center',
        fontFamily: 'Monaco',
        backgroundColor: '#ab938c',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
        maxWidth: '600px',
        margin: '40px auto',
      }}
    >
      {/* Genre */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', fontFamily: 'Tangerine, cursive', fontSize: '40px'}}>Genre:</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgb(255, 255, 255)',
            backgroundColor: '#ffffff',
            fontSize: '16px',
            color: '#000000',
            fontFamily: 'Monaco'
          }}
        >
          <option value="action">Action</option>
          <option value="adventure">Adventure</option>
          <option value="childhood-books">Childhood Books</option>
          <option value="coming-of-age">Coming of Age</option>
          <option value="contemporary">Contemporary</option>
          <option value="crime">Crime</option>
          <option value="drama">Drama</option>
          <option value="dystopian">Dystopian</option>
          <option value="family">Family</option>
          <option value="fantasy">Fantasy</option>
          <option value="high-school">High School</option>
          <option value="historical-fiction">Historical Fiction</option>
          <option value="horror">Horror</option>
          <option value="lgbtq">LGBTQ</option>
          <option value="magic">Magic</option>
          <option value="mystery">Mystery</option>
          <option value="mythology">Mythology</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="post-apocalyptic">Post Apocalyptic</option>
          <option value="realistic-fiction">Realistic Fiction</option>
          <option value="romance">Romance</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="short-story">Short Story</option>
          <option value="suspense">Suspense</option>
          <option value="supernatural">Supernatural</option>
          <option value="survival">Survival</option>
          <option value="teen">Teen</option>
          <option value="thriller">Thriller</option>
          <option value="vampires">Vampires</option>
          <option value="young-adult">Young Adult</option>
        </select>
      </div>

      {/* Page Range */}
      <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold', minWidth: '120px', fontFamily: 'Tangerine, cursive', fontSize: '40px' }}>
          Pages:
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minPage}
          onChange={(e) => setMinPage(e.target.value)}
          placeholder="Min"
          style={{
            width: '80px',
            padding: '8px',
            borderRadius: '8px',
            border: '2px solid rgb(255, 255, 255)',
            backgroundColor: '#ffffff',
            color: '#004d40',
            marginRight: '10px',
            fontFamily: 'Monaco'
          }}
        />
        <span style={{ color: 'black', fontWeight: 'bold', fontFamily: 'Tangerine, cursive', fontSize: '40px'}}> to </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={maxPage}
          onChange={(e) => setMaxPage(e.target.value)}
          placeholder="Max"
          style={{
            width: '80px',
            padding: '8px',
            borderRadius: '8px',
            border: '2px solid rgb(255, 255, 255)',
            backgroundColor: '#ffffff',
            color: '#004d40',
            marginLeft: '10px',
            fontFamily: 'Monaco'
          }}
        />
      </div>
    </form>
  );
};

export default SearchForm;
