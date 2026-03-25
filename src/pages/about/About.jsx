import React, { useState, useEffect, useRef } from 'react';
import './About.scss';
import { images } from '../../data/data';

const About = () => {
  const [typedText, setTypedText] = useState('');
  const [typingFinished, setTypingFinished] = useState(false);
  const [animationInProgress, setAnimationInProgress] = useState(true);
  const contentEditableRef = useRef(null);
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
        const aboutText = "  About me!";
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

  useEffect(() => {
    // Start typing "About me!" when the component mounts
    const aboutText = "A bout me!";
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
    <div className="about-container">
      <h2>
        <span ref={contentEditableRef} contentEditable={false} onInput={handleUserInput} onKeyDown={handleKeyDown}>
          {typedText}
        </span>
        <span className="cursor"></span>
      </h2>

      <div className='info-container'>

        {/* Personal Section */}
        <div className='section personal-content'>
          <div className='personal-text'>
            <h1 className='header-personal'>Personal</h1>
            <p className='text-personal'>I am from small-town Glasgow, Ky. I am 23 years old and I am married to my amazing, beautiful wife, Briana.</p>
          </div>
          <img className='pic-personal' src={images[0]} alt='me' />
        </div>

        {/* Professional Section */}
        <div className='section professional-content'>
          <img className='pic-grad' src={images[1]} alt='me' />
          <div className='professional-text'>
            <h1 className='header-grad'>Professional</h1>
            <p className='text-grad'>I am currently looking for a job that will help me put my degree to use! That would entail any software developer/engineer role, any data analyst position, or any IT related position. Feel free to reach out to me via email at gavinmaynard.dev@gmail.com if you would be interested in working with me! Hope to hear from you soon!</p>
          </div>
        </div>

        {/* Time at College Section */}
        <div className='section college-content'>
          <div className='college-text'>
            <h1 className='header-college'>Time at college</h1>
            <p className='text-college'>I graduated college in December of 2023. I spent my time at college studying away and attempting to better myself each day. I also had the pleasure in playing Esports for WKUEsports. Without it I likely would not have been able to put myself through college. I met some amazing people throughout my time at WKU whether that be through my classes, Esports, or pure chance. It was an experience that has made me a better person, and I would gladly do it all again if given the chance.</p>
          </div>
          <img className='pic-college' src={images[2]} alt='me' />
        </div>

      </div>
    </div>
  );
};

export default About;
