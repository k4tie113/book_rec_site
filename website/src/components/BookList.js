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
        backgroundColor: '#d9c1a4',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
        minWidth: '600px'
      }}>
        <h2 style={{ textAlign: 'center' }}>Add Books You've Read</h2>
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
                Liked
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
            <button onClick={addBook} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '10px', backgroundColor: '#f3dfc4', fontWeight: 'bold', border: 'none' }}>
              + Add Another Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
