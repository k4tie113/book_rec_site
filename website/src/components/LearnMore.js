import { motion } from 'framer-motion';
import '../App.css';

function LearnMore() {
  return (
    <>
      {/* Background-image section */}
      <motion.div
        className="learnmore-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{ textAlign: 'center', padding: '70px' }}
      >
        <div style={{
          fontFamily: '"Fira Code", monospace',
          marginTop: '80px',
          paddingTop: '20px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '40px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '20px',
          lineHeight: '1.8',
          fontSize: '18px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '55px', margin: 0, fontFamily: 'Tangerine, cursive' }}>Our Algorithm</h2>
          </div>


          <p style = {{color: '#d3d3d3'}}>We built our system using a combination of two existing recommendation strategies: content-based filtering and collaborative filtering. These methods work together to help you discover books that match both your preferences and your past reading experiences.</p>
          <p><strong>Content Based Filtering</strong></p>
          <p style = {{color: '#d3d3d3'}}>Each book is evaluated based on attributes such as genre (shelf tags), number of pages, average rating, and ratings volume. We assign a weighted score to every candidate book based on how well it matches the user’s specified preferences. To ensure genre relevance, the requested genre must appear in the book’s top shelves with a minimum frequency threshold.</p>

          <p><strong>Collaborative Filtering</strong><br /> <p style = {{color: '#d3d3d3'}}>We constructed a sparse matrix of user-book ratings from the Goodreads dataset. When the user inputs their past reads, we add an extra matrix row for the user representing their likes/dislikes. We then factorize this matrix with Singular Value Decomposition (SVD) into lower-dimensional representations that capture hidden relationships between users and books. The reconstructed matrix tells us the user's predicted ratings, and are considered in a book's hybrid score.</p></p>

          <p style = {{color: '#d3d3d3'}}>We combine both content scores and collaborative scores (if feedback is provided) to produce a ranked list of books tailored just for you.</p>

          <p><strong>Data Source </strong><br/><p style = {{color: '#d3d3d3'}}>All recommendations are powered by the <em>Goodreads Young Adult Books and Interactions Dataset</em>, consisting of over 93,000 books and 30+ million reader interactions, including detailed review and rating information.</p></p>
          <a href="https://github.com/k4tie113/book_rec_site" target="_blank" rel="noopener noreferrer" style={{ color: '#white' }}> Visit our github to see more! </a>
        </div>
      </motion.div>

      
      {/* New black section for citations */}
<div style={{
  backgroundColor: '#1e140a',
  color: '#fff',
  padding: '10px 30px 10px 30px',  // Less padding: top-right-bottom-left
  fontFamily: '"Fira Code", monospace',
  display: 'flex',
  justifyContent: 'flex-start'
}}>
  <div style={{
    maxWidth: '1000px',
    textAlign: 'left',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#d3d3d3'
  }}>
    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Citations</h3>
    <ul style={{ paddingLeft: '20px' }}>
      <li>
        Mengting Wan, Julian McAuley,
        <a href="https://cseweb.ucsd.edu/~jmcauley/pdfs/recsys18b.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
          {" "}“Item Recommendation on Monotonic Behavior Chains”
        </a>, RecSys'18.
        <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/recsys18b.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}> [bibtex]</a>
      </li>
      <li>
        Mengting Wan, Rishabh Misra, Ndapa Nakashole, Julian McAuley,
        <a href="https://aclanthology.org/P19-1355/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
          {" "}“Fine-Grained Spoiler Detection from Large-Scale Review Corpora”
        </a>, ACL’19.
        <a href="https://cseweb.ucsd.edu/~jmcauley/bibtex/acl19.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}> [bibtex]</a>
      </li>
    </ul>
  </div>
</div>

    </>
  );
}

export default LearnMore;
