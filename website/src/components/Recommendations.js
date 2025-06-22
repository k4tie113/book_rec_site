import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../images/bookrates.png';
import dividerLogo from '../images/logo.png'

const Recommendations = () => {
  const location = useLocation();
  //ensure recs is an array and slice the first 5 if available
  const recs = Array.isArray(location.state?.recommendations)
    ? location.state.recommendations.slice(0, 5)
    : [];

  //state to manage which descriptions are expanded
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [hoveredTitleIdx, setHoveredTitleIdx] = useState(null);
  //function to toggle the expanded state for a specific book.
  const toggleDescription = (idx) => {
    setExpandedDescriptions(prevState => ({
      ...prevState,
      [idx]: !prevState[idx]
    }));
  };

  return (
    <div
      style={{
        padding: '70px',
        fontFamily: 'Monaco',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <div style={{
        padding: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px', // spacing between logo and text
        marginBottom: '20px'
      }}>
        <img src={dividerLogo} alt="Left Divider" style={{ height: '30px' }} />
        <h1 style={{ margin: 0, textAlign: 'center', fontFamily: 'Tangerine, cursive', fontSize: '60px' }}>
          Your Recommendations
        </h1>
        <img src={dividerLogo} alt="Right Divider" style={{ height: '30px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {/* Conditional rendering based on recs array length */}
        {recs.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '20px auto',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            fontSize: '1.2em',
            lineHeight: '1.6',
            fontFamily: '"Fira Code", monospace',
          }}>
            <p>Sorry, we weren't able to find you recommendations based on your inputs.</p>
            <p>Try broadening the page range, or switching to a more popular genre.</p>
          </div>
        ) : (
          recs.map((book, idx) => {
            const cleanTitle = book.title;
            const isExpanded = expandedDescriptions[idx] || false;

            let displayDescription = book.description || 'No description available.';
            const needsTruncation = displayDescription.length > 500;

            if (needsTruncation && !isExpanded) {
              displayDescription = `${displayDescription.slice(0, 500)}`;
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  maxWidth: '850px',
                  margin: '0 auto',
                }}
              >
                <img
                  src={book.image_url}
                  alt={cleanTitle}
                  style={{
                    width: '120px',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '20px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
              
                  <h2 style={{ marginTop: 0, marginBottom: '10px', fontFamily: '"Fira Code", monospace'}}>
                    <a
                      href={book.url}
                      target="_blank" //opens the link in a new tab
                      rel="noopener noreferrer" //security best practice for target="_blank"
                      onMouseEnter={() => setHoveredTitleIdx(idx)}
                      onMouseLeave={() => setHoveredTitleIdx(null)}
                      style={{
                        color: hoveredTitleIdx === idx ? '#CCCCCC' : 'inherit', //change to gray on hover
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {cleanTitle}
                    </a>
                  </h2>

                  {/* ADDED: Overall Score section */}
                  {book.final_score !== undefined && ( //only display if final_score exists
                    <p style={{
                      marginTop: '-5px', //reduce top margin to bring it closer to the title
                      marginBottom: '10px',
                      fontFamily: '"Fira Code", monospace',
                      color: 'white', //explicitly set to white as per description color
                      fontSize: '15px', //slightly smaller than title, larger than description
                      lineHeight: '1.2',
                    }}>
                      Score: {book.final_score.toFixed(3)} {/* Display score, formatted to 2 decimal places */}
                    </p>
                  )}


                  <p style={{ fontSize: '14px', lineHeight: '1.5', wordWrap: 'break-word', fontFamily: '"Fira Code", monospace'}}>
                    {displayDescription}
                    {needsTruncation && (
                      <span
                        onClick={() => toggleDescription(idx)}
                        style={{
                          color: 'white', 
                          cursor: 'pointer',
                          marginLeft: '5px',
                          textDecoration: 'underline',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        [{isExpanded ? 'See Less' : 'See More'}]
                      </span>
                    )}
                  </p>
                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Recommendations;