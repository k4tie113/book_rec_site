import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { useRef, useEffect, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import typingSound from '../assets/typing.mp3'; // Ensure this path is correct
import './ContactPage.css';

function ContactPage() {
  const formRef = useRef();
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_envy20v', 'template_9vzu86o', formRef.current, '7xBLmLdcs8AM0Lkst')
      .then((result) => {
        alert('Thank you for your feedback!');
      }, (error) => {
        alert('Failed to send message.');
      });
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="contact-page-container"
    >
      <div className="contact-content-wrapper">
        <h2 className="contact-heading">Let us know your feedback!</h2>
        
        <p className="contact-description" style={{ fontFamily: '"Fira Code", monospace' }}>
          <Typewriter
            words={['We are happy to hear suggestions.']}
            loop={1}
            cursor
            typeSpeed={40}
            onType={startTypingSound}
            onDone={stopTypingSound}
          />
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          <div className="contact-input-group">
            <input name="name" type="text" placeholder="Name" />
            <input name="email" type="email" placeholder="Email" />
          </div>
          <input name="subject" type="text" placeholder="Subject" />
          <textarea name="message" placeholder="Your message!" rows="6" />
          <div className="contact-buttons-group">
            <button
              type="submit"
              className="contact-button send"
              onMouseOver={(e) => e.target.style.backgroundColor = '#ab938c'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(100, 50, 50, 10)'}
            >
              Send
            </button>
            <button
              type="reset"
              className="contact-button clear"
              onMouseOver={(e) => e.target.style.backgroundColor = 'gray'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#616161'}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <audio ref={audioRef} src={typingSound} loop />
    </motion.div>
  );
}
export default ContactPage;