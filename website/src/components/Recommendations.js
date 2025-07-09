import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../images/bookrates.png';
import './Recommendations.css';

const Recommendations = () => {
  const location = useLocation();
  const recs = Array.isArray(location.state?.recommendations)
    ? location.state.recommendations.slice(0, 5)
    : [];

  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [hoveredTitleIdx, setHoveredTitleIdx] = useState(null);
  const toggleDescription = (idx) => {
    setExpandedDescriptions(prevState => ({
      ...prevState,
      [idx]: !prevState[idx]
    }));
  };

  return (
    <div
      className="recommendations-page-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="recommendations-header">
        <h1 className="recommendations-title">
          Your Recommendations
        </h1>
      </div>

      <div className="recommendations-list-container">
        {recs.length === 0 ? (
          <div className="no-recs-message">
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
                className="recommendation-card"
              >
                <img
                  src={book.image_url}
                  alt={cleanTitle}
                  className="recommendation-card-image"
                />
                <div className="recommendation-card-content">
              
                  <h2 className="recommendation-card-title">
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredTitleIdx(idx)}
                      onMouseLeave={() => setHoveredTitleIdx(null)}
                      style={{
                        color: hoveredTitleIdx === idx ? '#b7b7b7' : 'inherit',
                      }}
                    >
                      {cleanTitle}
                    </a>
                  </h2>

                  {book.final_score !== undefined && (
                    <p className="recommendation-score">
                      Score: {book.final_score.toFixed(3)}
                    </p>
                  )}

                  <p className="recommendation-description">
                    {displayDescription}
                    {needsTruncation && (
                      <span
                        onClick={() => toggleDescription(idx)}
                        className="recommendation-description-toggle"
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