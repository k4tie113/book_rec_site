//this is the book list that you can add to
import React, { useEffect, useState } from 'react';
import BookAutocomplete from './BookAutocomplete';

const BookList = ({ books, setBooks }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch('/book_titles.json')
      .then(res => res.json())
      .then(setOptions)
      .catch(err => console.error("Failed to load titles:", err));
  }, []);

  const handleBookChange = (index, selected) => {
    const updated = [...books];
    updated[index].title = selected;
    setBooks(updated);
  };

  const handleLikedChange = (index, value) => {
    const updated = [...books];
    updated[index].liked = value;
    setBooks(updated);
  };

  const addBook = () => {
    if (books.length < 10) {
      setBooks([...books, { title: null, liked: null }]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{
        backgroundColor: '#ab938c',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
        maxWidth: '600px'
      }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Tangerine, cursive', fontSize: '40px' }}>Add Books You've Read</h2>
        <p style = {{ textAlign: 'center', fontFamily: '"Fira Code", monospace', color: 'black', marginLeft: '5%', marginRight: '5%'}}>Share your past reads to help us refine your recommendations! </p>
        <p style = {{ textAlign: 'center', fontFamily: '"Fira Code", monospace', color: 'black', marginLeft: '5%', marginRight: '5%'}}>(Our collection is continuously expanding – if you don't see a title you're looking for, check back soon)</p>
        {books.map((book, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <BookAutocomplete
              value={book.title}
              onChange={(selected) => handleBookChange(index, selected)}
              options={options}
            />
            <div style={{ marginTop: '8px' }}>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name={`liked-${index}`}
                  checked={book.liked === 'liked'}
                  onChange={() => handleLikedChange(index, 'liked')}
                />
                Enjoyed
              </label>
              <label>
                <input
                  type="radio"
                  name={`liked-${index}`}
                  checked={book.liked === 'disliked'}
                  onChange={() => handleLikedChange(index, 'disliked')}
                />
                Disliked
              </label>
            </div>
          </div>
        ))}
        {books.length < 10 && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={addBook} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '10px', backgroundColor: '#675456', fontWeight: 'bold', border: 'none'}}
            onMouseOver={(e) => e.target.style.backgroundColor = 'white'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#675456'}
            >
              + Add Another Book
            </button>
          </div>
        )}
  
      </div>
    </div>
  );
};

export default BookList;
