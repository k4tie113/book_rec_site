//contact page
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { useRef } from 'react';

function ContactPage() {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_envy20v', 'template_9vzu86o', formRef.current, '7xBLmLdcs8AM0Lkst')
      .then((result) => {
          alert('Thank you for your feedback!');
      }, (error) => {
          alert('Failed to send message.');
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{ textAlign: 'center', padding: '70px' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '18px', color: '#FFFFFF' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', color: 'FFFFFFF', fontFamily: 'Tangerine, cursive',
            fontSize: '70px', letterSpacing: '2px'}}>Let us know your feedback!</h2>
        <p style={{ marginBottom: '40px' }}>We are happy to hear suggestions.</p>

        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <input name="name" type="text" placeholder="Name" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '3px solid white',fontFamily: 'Monaco' }} />
            <input name="email" type="email" placeholder="Email" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '3px solid white',fontFamily: 'Monaco' }} />
          </div>
          <input name="subject" type="text" placeholder="Subject" style={{ padding: '10px', borderRadius: '8px', border: '3px solid white',fontFamily: 'Monaco'}} />
          <textarea name="message" placeholder="Your message!" rows="6" style={{ padding: '10px', borderRadius: '8px', border: '4px solid white' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'rgba(100, 50, 50, 10)', color: '#fff', border: 'none', borderRadius: '6px',fontFamily: 'Monaco' }}>Send</button>
            <button type="reset" style={{ padding: '10px 20px', backgroundColor: '#616161', color: '#fff', border: 'none', borderRadius: '6px',fontFamily: 'Monaco' }}>Clear</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default ContactPage;