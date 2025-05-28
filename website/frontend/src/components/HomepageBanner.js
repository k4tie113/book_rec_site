import { motion } from 'framer-motion';
import '../css/Banner.css';

function HomepageBanner() {
  return (
    <section id="banner">
      <div className="inner">
        <header>
          <div className="double-line">
            <div className="line" />
            <h2>BOOKRATES</h2>
            <div className="line" />
          </div>
        </header>
        <p>
          ENTER YOUR PREFERENCES<br />
          FOR A BOOK RECOMMENDATION!
        </p>
      </div>
    </section>
  );
}

export default HomepageBanner;
