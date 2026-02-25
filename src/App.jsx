import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

// Using extremely reliable Twemoji SVGs to guarantee they load perfectly
const storyContent = [
  {
    emoji: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f43b.svg", // Bear
    title: "Will you be mine forever?",
    text: "I completely adore you!"
  },
  {
    emoji: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f914.svg", // Thinking 
    title: "Wait, are you sure?",
    text: "Think about it again..."
  },
  {
    emoji: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f97a.svg", // Pleading
    title: "Really really sure?",
    text: "Pweaseeee? Don't break my heart 🥺"
  },
  {
    emoji: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f62d.svg", // Crying
    title: "I'm gonna cry...",
    text: "You're breaking my heart! Just say yes!"
  },
  {
    emoji: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f631.svg", // Screaming
    title: "Fine, you leave me no choice!",
    text: "The 'No' button is now playing hard to get."
  }
];

const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  
  const noBtnRef = useRef(null);
  const audioRef = useRef(null);
  const lastDodgeTimeRef = useRef(0);

  const currentStoryIndex = Math.min(noCount, storyContent.length - 1);
  const currentContent = storyContent[currentStoryIndex];

  // Stop scaling the Yes button once it hits a giant size to prevent breaking viewport
  const yesButtonScale = Math.min(1 + (noCount * 0.35), 4);

  // Play audio ONLY after the first user interaction to bypass modern browser autoplay blocking
  const startExperience = () => {
    // We must play the audio BEFORE updating the state to ensure the gesture maps directly to the play() call
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((err) => console.log("Audio play error", err));
    }
    setHasStarted(true);
  };

  const moveButton = useCallback((pointerX, pointerY) => {
    const btn = noBtnRef.current;
    if (!btn) return;

    // Rate-limit the progression of the story to once every 700ms 
    const now = Date.now();
    if (now - lastDodgeTimeRef.current > 700) {
      setNoCount(prev => prev + 1);
      lastDodgeTimeRef.current = now;
    }

    const padding = 20; 
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;
    
    // Safety check - force a random box far away
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    let randomX, randomY;
    let attempts = 0;
    
    do {
      randomX = Math.max(padding, Math.floor(Math.random() * maxX));
      randomY = Math.max(padding, Math.floor(Math.random() * maxY));
      attempts++;
    } while (
      pointerX !== undefined && 
      pointerY !== undefined && 
      Math.hypot(randomX + (btnWidth / 2) - pointerX, randomY + (btnHeight / 2) - pointerY) < 150 && 
      attempts < 15 
    );

    setNoPosition({
      top: `${randomY}px`,
      left: `${randomX}px`
    });
  }, []);

  const handlePointerInteraction = useCallback((e) => {
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    moveButton(clientX, clientY);
  }, [moveButton]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      // Don't dodge if accepted or button doesn't exist
      if (accepted || !noBtnRef.current) return;
      
      let clientX, clientY;
      if (e.touches && typeof e.touches.length !== 'undefined' && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const btnRect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distance = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

      // Trigger dodge purely on proximity (120px threshold)
      if (distance < 120) {
        moveButton(clientX, clientY);
      }
    };
    
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [accepted, moveButton]);

  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
        const isHeart = Math.random() > 0.4;
        const size = Math.random() * (isHeart ? 25 : 8) + (isHeart ? 15 : 4); 
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 6 + 4; 
        const animationDelay = Math.random() * 5; 

        particles.push(
            <div
                key={i}
                className={isHeart ? "heart" : "sparkle"}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}vw`,
                    animationDuration: `${animationDuration}s`,
                    animationDelay: `${animationDelay}s`,
                }}
            />
        );
    }
    return particles;
  };

  return (
    <>
      <audio 
        ref={audioRef}
        loop 
        src="/chopin.mp3" 
        playsInline
      />
      <div className="particle-bg">{createParticles()}</div>

      {!hasStarted ? (
        <div 
          className="container" 
          style={{ padding: '3rem 2rem', animation: 'fadeIn 1s ease-in-out', cursor: 'pointer' }} 
          onClick={startExperience}
        >
          <div className="gif-container emoji-container">
            <img 
              src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f48c.svg" 
              alt="Love letter emoji" 
            />
          </div>
          <h1>You have a secret message...</h1>
          <p>Tap anywhere to open it 💌</p>
          <button className="btn-yes" style={{ marginTop: '1rem', padding: '1rem 3rem' }}>
            Open
          </button>
        </div>
      ) : accepted ? (
        <div className="container" style={{ animation: 'fadeIn 1s ease-in-out' }}>
          <div className="gif-container emoji-container">
            <img 
              src="/gifs/yes.gif" 
              alt="Happy Bear Hugging" 
              className="final-gif"
            />
          </div>
          <h1>YAYYY! 🎉</h1>
          <p>I knew you'd make the right choice! ❤️<br/>I love you to the moon and back!</p>
        </div>
      ) : (
        <div className="container" style={{ padding: '2.5rem 2rem' }}>
          <div className="gif-container emoji-container">
            <img 
              src={currentContent.emoji}
              alt="Story context emoji" 
            />
          </div>
          <h1>{currentContent.title}</h1>
          <p>{currentContent.text}</p>
          <div className="button-group" style={{ 
            flexDirection: noCount > 3 ? 'column' : 'row',
            alignItems: 'center',
            gap: noCount > 3 ? '2rem' : '1.5rem',
            minHeight: '60px'
          }}>
            <button 
              className="btn-yes" 
              onClick={() => setAccepted(true)}
              style={{
                transform: `scale(${yesButtonScale})`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: 10
              }}
            >
              Yes!
            </button>
            <button 
              ref={noBtnRef}
              className="btn-no" 
              style={{
                position: noPosition ? 'fixed' : 'relative',
                top: noPosition ? noPosition.top : 'auto',
                left: noPosition ? noPosition.left : 'auto',
                transition: 'all 0.3s cubic 0.175, 0.885, 0.32, 1.275)',
                zIndex: 50
              }}
              onClick={handlePointerInteraction}
              onTouchStart={handlePointerInteraction}
              onMouseEnter={handlePointerInteraction}
            >
              {noCount === 0 ? "No" : "Still No?"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
