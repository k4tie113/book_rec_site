import { motion } from 'framer-motion';
function LearnMore() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{ textAlign: 'center', padding: '20px' }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: '1.8' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px' }}>Our Algorithm</h2>
  
          <p>
            We built our system using a combination of two existing recommendation strategies: content-based filtering and collaborative filtering. These methods work together to help you discover books that match both your preferences and your past reading experiences.
          </p>
  
          <p>
            <strong>Content Based Filtering</strong><br />
            Each book is evaluated based on attributes such as genre (shelf tags), number of pages, average rating, and ratings volume. We assign a weighted score to every candidate book based on how well it matches the user’s specified preferences. To ensure genre relevance, the requested genre must appear in the book’s top shelves with a minimum frequency threshold.
          </p>
  
          <p>
            <strong>Collaborative Filtering</strong><br />
            When the user provides feedback on books they've liked or disliked, we apply a latent factor model using Singular Value Decomposition (SVD). We construct a sparse matrix of user-book ratings from the Goodreads dataset and add an extra row for the user representing their likes/dislikes (e.g. we assume rating = 5 for liked books, 1 for disliked). SVD factorizes this matrix into lower-dimensional representations that capture hidden relationships between users and books. The reconstructed matrix tells us the user's predicted ratings, and are considered in a book's hybrid score.
          </p>
  
          <p>
            We combine both content scores and collaborative scores (if feedback is provided) to produce a ranked list of books tailored just for you.
          </p>
  
          <p>
            <strong>Data source: </strong><br />
            All recommendations are powered by the <em>Goodreads Young Adult Books and Interactions Dataset</em>, consisting of over 93,000 books and 30+ million reader interactions, including detailed review and rating information.
          </p>
        </div>
  
        <div style={{ marginTop: '50px', textAlign: 'left', fontSize: '16px' }}>
          <h3>Citations</h3>
          <ul>
          <li>
            Mengting Wan, Julian McAuley, 
            <a href="https://cseweb.ucsd.edu/~jmcauley/pdfs/recsys18b.pdf" target="_blank" rel="noopener noreferrer">
              {" "}“Item Recommendation on Monotonic Behavior Chains”
            </a>, in RecSys'18. <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/recsys18b.txt" target="_blank" rel="noopener noreferrer">[bibtex]</a>
          </li>
          <li>
            Mengting Wan, Rishabh Misra, Ndapa Nakashole, Julian McAuley, 
            <a href="https://aclanthology.org/P19-1355/" target="_blank" rel="noopener noreferrer">
              {" "}“Fine-Grained Spoiler Detection from Large-Scale Review Corpora”
            </a>, in ACL’19. <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/acl19.txt" target="_blank" rel="noopener noreferrer">[bibtex]</a>
          </li>
          </ul>
        </div>
      </motion.div>
    );
  }
  export default LearnMore;
  