import React, { useState, useEffect, useRef } from 'react';
import './Home.scss';
import Skill from '../../components/skill/Skill';
import { skills } from '../../data/data';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [typingFinished, setTypingFinished] = useState(false);
  const [animationInProgress, setAnimationInProgress] = useState(true);
  const contentEditableRef = useRef(null);

  const moveCursorToEnd = () => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!animationInProgress) {
        setTypedText('');
        setAnimationInProgress(true);
        setTypingFinished(false);

        // Restart the typing animation
        const greeting = "  Hi!";
        const myName = ", I'm Gavin!";
        let index = 0;
        const timerIds = [];

        const typeText = () => {
          if (index < greeting.length) {
            setTypedText((prevText) => prevText + greeting.charAt(index));
            index += 1;
            timerIds.push(setTimeout(typeText, 150)); // Adjust the typing speed here
          } else if (index === greeting.length) {
            timerIds.push(setTimeout(() => eraseExclamation(), 1500)); // Pause before erasing exclamation
          } else {
            typeMyName();
          }
        };

        const eraseExclamation = () => {
          setTypedText((prevText) => prevText.slice(0, -1));
          index -= 1;
          timerIds.push(setTimeout(() => typeMyName(), 1300)); // Adjust the pause before typing myName
        };

        const typeMyName = () => {
          const myNamePart1 = ", I'";

          if (index < greeting.length + myNamePart1.length) {
            setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
            index += 1;
            timerIds.push(setTimeout(() => typeMyName(), 150)); // Adjust the typing speed for the first part
          } else if (index < greeting.length + myName.length - 3) {
            setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
            index += 1;
            timerIds.push(setTimeout(() => typeMyName(), 75)); // Adjust the typing speed for the second part
          } else if (index < greeting.length + myName.length) {
            setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
            index += 1;
            const randomDelay = Math.floor(Math.random() * (2500 - 150 + 1)) + 150; // Generate random delay between 150 and 2500
            timerIds.push(setTimeout(() => {
              setTypingFinished(true);
              setAnimationInProgress(false);
              contentEditableRef.current && contentEditableRef.current.focus();
              contentEditableRef.current && moveCursorToEnd();
              typeMyName();
            }, randomDelay));
          }
        };

        timerIds.push(setTimeout(() => typeText(), 1000)); // Initial delay before starting the typing effect
      }
    }
  };

  useEffect(() => {
    const greeting = "H i!";
    const myName = ", I'm Gavin!";
    let index = 0;
    const timerIds = [];

    const typeText = () => {
      if (index < greeting.length) {
        setTypedText((prevText) => prevText + greeting.charAt(index));
        index += 1;
        timerIds.push(setTimeout(() => typeText(), 150)); // Adjust the typing speed here
      } else if (index === greeting.length) {
        timerIds.push(setTimeout(() => eraseExclamation(), 1500)); // Pause before erasing exclamation
      } else {
        typeMyName();
      }
    };

    const eraseExclamation = () => {
      setTypedText((prevText) => prevText.slice(0, -1));
      index -= 1;
      timerIds.push(setTimeout(() => typeMyName(), 1300)); // Adjust the pause before typing myName
    };

    const typeMyName = () => {
      const myNamePart1 = ", I'";

      if (index < greeting.length + myNamePart1.length) {
        setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
        index += 1;
        timerIds.push(setTimeout(() => typeMyName(), 150)); // Adjust the typing speed for the first part
      } else if (index < greeting.length + myName.length - 3) {
        setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
        index += 1;
        timerIds.push(setTimeout(() => typeMyName(), 75)); // Adjust the typing speed for the second part
      } else if (index < greeting.length + myName.length) {
        setTypedText((prevText) => prevText + myName.charAt(index - greeting.length));
        index += 1;
        const randomDelay = Math.floor(Math.random() * (2500 - 150 + 1)) + 150; // Generate random delay between 150 and 2500
        timerIds.push(setTimeout(() => {
          setTypingFinished(true);
          setAnimationInProgress(false);
          contentEditableRef.current && contentEditableRef.current.focus();
          contentEditableRef.current && moveCursorToEnd();
          typeMyName();
        }, randomDelay));
      }
    };

    timerIds.push(setTimeout(() => typeText(), 1000)); // Initial delay before starting the typing effect

    // Cleanup timers on component unmount
    return () => {
      timerIds.forEach((id) => clearTimeout(id));
    };

  }, []);

  return (
    <div className="home-container">
      <h2>
        <span ref={contentEditableRef} contentEditable={typingFinished} onInput={handleUserInput} onKeyDown={handleKeyDown}>
          {typedText}
        </span>
        <span className="cursor"></span>
      </h2>
      <div className="content">
        <div className='text'>
          <p>
            I am a Software Developer from southern Kentucky. I graduated from Western Kentucky University in December of 2023 with a Bachelor's Degree of Science, with a Major in Computer Science and a Minor in Computer Information Systems. I love testing myself and pushing myself to higher limits with the applications I create. Throughout all of my projects, I really enjoy backend development mainly because I like working in OOP designs and watching as data moves around the application.
          </p>
          <h1>:)</h1>
        </div>
        
        {/* <img src="your-image-path.jpg" alt="This is me" className="profile-image" /> */}
        <h2>Skills</h2>
        <div className='skills-wrapper'>
          {skills.map((skill) => 
            <Skill image={skill.image} name={skill.name}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
