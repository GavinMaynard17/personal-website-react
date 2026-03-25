import React, { useState, useEffect, useRef } from 'react';
import './Contact.scss';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const contentEditableRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [typingFinished, setTypingFinished] = useState(false);
  const [animationInProgress, setAnimationInProgress] = useState(true);
  const pauseDuration = 1500; // Adjust the pause duration after hitting Enter

  const handleUserInput = () => {
    if (typingFinished) {
      let newText = typedText; // Declare newText outside the if statement
      const containerWidth = contentEditableRef.current.offsetWidth;
      const textWidth = contentEditableRef.current.scrollWidth;

      if (textWidth > containerWidth) {
        // Text exceeds container width
        const words = newText.split(' ');
        words.pop(); // Remove the last word
        newText = words.join(' ');

        setTypedText(newText);
        moveCursorToEnd();
      }

      if (textWidth > containerWidth && newText.trim() === '') {
        // No original text left, move cursor down
        setTypedText('');
        moveCursorDown();
      }
    }
  };

  const moveCursorDown = () => {
    setTypedText((prevText) => prevText + '\n'); // Start a new line
    moveCursorToEnd();
  };

  const moveCursorToEnd = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!animationInProgress) {
        setTypedText('');
        setAnimationInProgress(true);
        setTypingFinished(false);
        contentEditableRef.current && (contentEditableRef.current.contentEditable = false);

        // Restart the typing animation after a brief pause
        const aboutText = "  Contact me!";
        let index = 0;
        const timerIds = [];

        const typeText = () => {
          if (index < aboutText.length) {
            setTypedText((prevText) => prevText + aboutText.charAt(index));
            index += 1;
            timerIds.push(setTimeout(typeText, 150)); // Adjust the typing speed here
          } else {
            setTypingFinished(true);
            setAnimationInProgress(false);
            contentEditableRef.current && (contentEditableRef.current.contentEditable = true);
            contentEditableRef.current && contentEditableRef.current.focus();
            contentEditableRef.current && moveCursorToEnd();
          }
        };

        setTimeout(() => {
          typeText();
        }, pauseDuration);
      }
    }
  };

  const isFormValid = () => {
    return name.trim() !== '' && email.trim() !== '' && message.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather user input
    const userData = {
      name,
      email,
      message,
    };

    try {
      // Use the Getform endpoint for form submission
      const response = await fetch('https://getform.io/f/d860b137-186f-4b81-a2de-12cf44f81848', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        setFormSubmitted(true);
      } else {
        console.error('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    // Start typing "About me!" when the component mounts
    const aboutText = "C ontact me!";
    let index = 0;
    const timerIds = [];

    const typeText = () => {
      if (index < aboutText.length) {
        setTypedText((prevText) => prevText + aboutText.charAt(index));
        index += 1;
        timerIds.push(setTimeout(typeText, 150)); // Adjust the typing speed here
      } else {
        setTypingFinished(true);
        setAnimationInProgress(false);
        contentEditableRef.current && (contentEditableRef.current.contentEditable = true);
        contentEditableRef.current && contentEditableRef.current.focus();
        contentEditableRef.current && moveCursorToEnd();
      }
    };

    timerIds.push(setTimeout(() => typeText(), 1000)); // Initial delay before starting the typing effect

    // Cleanup timers on component unmount
    return () => {
      timerIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <div className="contact-container">
      <h2>
        <span ref={contentEditableRef} contentEditable={false} onInput={handleUserInput} onKeyDown={handleKeyDown}>
          {typedText}
        </span>
        <span className="cursor"></span>
      </h2>
      <p>Fill out this form for a quick way to shoot me a message, or feel free to email me at</p>
      <h2>gavinmaynard.dev@gmail.com</h2>
      {!formSubmitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <label>
            Message:
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <br />
          <button type="submit" disabled={!isFormValid()}>
            Submit
          </button>
        </form>
      ) : (
        <h2>Thank you for your submission!</h2>
      )}
    </div>
  );
};

export default Contact;
