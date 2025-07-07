import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import React, { useRef, useEffect, useState } from 'react';
import typingSound from '../assets/typing.mp3';
import './LearnMore.css'; 

function LearnMore() {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const startTypingSound = () => {
    if (audioRef.current && !isTyping) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsTyping(true);
      timeoutRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsTyping(false);
        }
      }, 3000);
    }
  };

  const stopTypingSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsTyping(false);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = true;
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <motion.div
        className="learnmore-background" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="learn-more-content-box">
          <div className="learn-more-heading-wrapper">
            <h2 className="learn-more-heading" style={{ fontFamily: '"Fira Code", monospace' }}>
              <Typewriter
                words={['Our Algorithm']}
                loop={1}
                cursor
                typeSpeed={50}
                onType={startTypingSound}
                onDone={stopTypingSound}
              />
            </h2>
          </div>

          <p className="learn-more-paragraph">We built our system using a combination of two existing recommendation strategies: content-based filtering and collaborative filtering. These methods work together to help you discover books that match both your preferences and your past reading experiences.</p>

          <p className="learn-more-paragraph" style={{ fontFamily: '"Fira Code", monospace' }}>
            <Typewriter
              words={['Content Based Filtering']}
              loop={1}
              cursor
              typeSpeed={40}
              onType={startTypingSound}
              onDone={stopTypingSound}
            />
          </p>

          <p className="learn-more-paragraph">Each book is evaluated based on attributes such as genre (shelf tags), number of pages, average rating, and ratings volume. We assign a weighted score to every candidate book based on how well it matches the user’s specified preferences. To ensure genre relevance, the requested genre must appear in the book’s top shelves with a minimum frequency threshold.</p>

          <p className="learn-more-paragraph" style={{ fontFamily: '"Fira Code", monospace' }}>
            <Typewriter
              words={['Collaborative Filtering']}
              loop={1}
              cursor
              typeSpeed={40}
              onType={startTypingSound}
              onDone={stopTypingSound}
            />
          </p>

          <p className="learn-more-paragraph">We constructed a sparse matrix of user-book ratings from the Goodreads dataset. When the user inputs their past reads, we add an extra matrix row for the user representing their likes/dislikes. We then factorize this matrix with Singular Value Decomposition (SVD) into lower-dimensional representations that capture hidden relationships between users and books. The reconstructed matrix tells us the user's predicted ratings, and are considered in a book's hybrid score.</p>

          <p className="learn-more-paragraph">We combine both content scores and collaborative scores (if feedback is provided) to produce a ranked list of books tailored just for you.</p>

          <p className="learn-more-paragraph" style={{ fontFamily: '"Fira Code", monospace' }}>
            <Typewriter
              words={['Data Source']}
              loop={1}
              cursor
              typeSpeed={100}
              onType={startTypingSound}
              onDone={stopTypingSound}
            />
          </p>

          <p className="learn-more-paragraph">All recommendations are powered by the <em>Goodreads Young Adult Books and Interactions Dataset</em>, consisting of over 93,000 books and 30+ million reader interactions, including detailed review and rating information.</p>

          <a href="https://github.com/k4tie113/book_rec_site" target="_blank" rel="noopener noreferrer" className="learn-more-github-link"> Visit our github to see more! </a>
        </div>
      </motion.div>

      {/* New black section for citations */}
      <div className="citations-container">
        <div className="citations-content">
          <h3>Citations</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              Mengting Wan, Julian McAuley,
              <a href="https://cseweb.ucsd.edu/~jmcauley/pdfs/recsys18b.pdf" target="_blank" rel="noopener noreferrer" className="citations-content-link">
                {" "}“Item Recommendation on Monotonic Behavior Chains”
              </a>, RecSys'18.
              <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/recsys18b.txt" target="_blank" rel="noopener noreferrer" className="citations-content-link"> [bibtex]</a>
            </li>
            <li>
              Mengting Wan, Rishabh Misra, Ndapa Nakashole, Julian McAuley,
              <a href="https://aclanthology.org/P19-1355/" target="_blank" rel="noopener noreferrer" className="citations-content-link">
                {" "}“Fine-Grained Spoiler Detection from Large-Scale Review Corpora”
              </a>, ACL’19.
              <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/acl19.txt" target="_blank" rel="noopener noreferrer" className="citations-content-link"> [bibtex]</a>
            </li>
          </ul>
        </div>
      </div>

      <audio ref={audioRef} src={typingSound} loop />
    </>
  );
}

export default LearnMore;
