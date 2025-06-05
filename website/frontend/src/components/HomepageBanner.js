import React, { useEffect, useRef, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import typingSound from '../assets/typing.mp3';
import bookratesImg from '../images/bookrates.png'; 

function HomepageBanner() {
  

//animation function
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
    <section
      id="banner"
      style={{
        backgroundImage: `url(${bookratesImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div className="inner" 
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',  // translucent black background
          padding: '20px 30px',
          borderRadius: '10px',
          display: 'inline-block',
        }}
      >
        <header>
          <div className="double-line">
            <div className="line" />
            <h2 style={{ fontFamily: '"Fira Code", monospace' }}>BOOKRATES</h2>
            <div className="line" />
          </div>
        </header>

        <p style={{ fontFamily: '"Fira Code", monospace', fontSize: '18px' }}>
          <Typewriter
            words={['Enter your preferences for a book recommendation.']}
            loop={1}
            cursor
            typeSpeed={50}
            onType={startTypingSound}
            onDone={stopTypingSound}
          />
        </p>

        <audio ref={audioRef} src={typingSound} loop />
      </div>
    </section>
  );
}

export default HomepageBanner;
