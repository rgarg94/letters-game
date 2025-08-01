import React, { useState, useEffect, useCallback } from "react";
import { X, Volume2, RefreshCw } from "lucide-react";

interface WordData {
  word: string;
  emoji: string;
}

export interface KeyEvent {
  keyCode: number;
  virtualKey: string;
  key: string;
}

const AlphabetLearningApp = ({ customKey }: { customKey?: KeyEvent }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showWord, setShowWord] = useState(false);

  // TV Navigation states
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [popupFocusedButton, setPopupFocusedButton] = useState(0); // 0: play, 1: new word, 2: close

  // Multiple word options for each letter
  const alphabetWords: Record<string, WordData[]> = {
    A: [
      { word: "Apple", emoji: "🍎" },
      { word: "Airplane", emoji: "✈️" },
      { word: "Ant", emoji: "🐜" },
      { word: "Alligator", emoji: "🐊" },
      { word: "Arrow", emoji: "➡️" }
    ],
    B: [
      { word: "Ball", emoji: "⚽" },
      { word: "Butterfly", emoji: "🦋" },
      { word: "Banana", emoji: "🍌" },
      { word: "Bear", emoji: "🐻" },
      { word: "Boat", emoji: "🚤" }
    ],
    C: [
      { word: "Cat", emoji: "🐱" },
      { word: "Car", emoji: "🚗" },
      { word: "Cake", emoji: "🍰" },
      { word: "Crown", emoji: "👑" },
      { word: "Cloud", emoji: "☁️" }
    ],
    D: [
      { word: "Dog", emoji: "🐶" },
      { word: "Duck", emoji: "🦆" },
      { word: "Dolphin", emoji: "🐬" },
      { word: "Dinosaur", emoji: "🦕" },
      { word: "Dragon", emoji: "🐉" }
    ],
    E: [
      { word: "Elephant", emoji: "🐘" },
      { word: "Eagle", emoji: "🦅" },
      { word: "Earth", emoji: "🌍" },
      { word: "Egg", emoji: "🥚" },
      { word: "Eye", emoji: "👁️" }
    ],
    F: [
      { word: "Fish", emoji: "🐠" },
      { word: "Flower", emoji: "🌸" },
      { word: "Fire", emoji: "🔥" },
      { word: "Frog", emoji: "🐸" },
      { word: "Fox", emoji: "🦊" }
    ],
    G: [
      { word: "Giraffe", emoji: "🦒" },
      { word: "Guitar", emoji: "🎸" },
      { word: "Grapes", emoji: "🍇" },
      { word: "Ghost", emoji: "👻" },
      { word: "Gift", emoji: "🎁" }
    ],
    H: [
      { word: "House", emoji: "🏠" },
      { word: "Horse", emoji: "🐴" },
      { word: "Heart", emoji: "❤️" },
      { word: "Hat", emoji: "🎩" },
      { word: "Helicopter", emoji: "🚁" }
    ],
    I: [
      { word: "Ice Cream", emoji: "🍦" },
      { word: "Island", emoji: "🏝️" },
      { word: "Igloo", emoji: "🏔️" },
      { word: "Insect", emoji: "🐛" },
      { word: "Iron", emoji: "🔧" }
    ],
    J: [
      { word: "Jellyfish", emoji: "🪼" },
      { word: "Jacket", emoji: "🧥" },
      { word: "Juice", emoji: "🧃" },
      { word: "Jewel", emoji: "💎" },
      { word: "Jungle", emoji: "🌴" }
    ],
    K: [
      { word: "Kite", emoji: "🪁" },
      { word: "King", emoji: "👑" },
      { word: "Kangaroo", emoji: "🦘" },
      { word: "Key", emoji: "🔑" },
      { word: "Kitchen", emoji: "🍳" }
    ],
    L: [
      { word: "Lion", emoji: "🦁" },
      { word: "Leaf", emoji: "🍃" },
      { word: "Lightning", emoji: "⚡" },
      { word: "Ladybug", emoji: "🐞" },
      { word: "Lemon", emoji: "🍋" }
    ],
    M: [
      { word: "Moon", emoji: "🌙" },
      { word: "Monkey", emoji: "🐵" },
      { word: "Mouse", emoji: "🐭" },
      { word: "Mountain", emoji: "⛰️" },
      { word: "Music", emoji: "🎵" }
    ],
    N: [
      { word: "Nest", emoji: "🪺" },
      { word: "Night", emoji: "🌃" },
      { word: "Nose", emoji: "👃" },
      { word: "Narwhal", emoji: "🐋" },
      { word: "Ninja", emoji: "🥷" }
    ],
    O: [
      { word: "Orange", emoji: "🍊" },
      { word: "Ocean", emoji: "🌊" },
      { word: "Owl", emoji: "🦉" },
      { word: "Octopus", emoji: "🐙" },
      { word: "Onion", emoji: "🧅" }
    ],
    P: [
      { word: "Penguin", emoji: "🐧" },
      { word: "Pizza", emoji: "🍕" },
      { word: "Parrot", emoji: "🦜" },
      { word: "Planet", emoji: "🪐" },
      { word: "Panda", emoji: "🐼" }
    ],
    Q: [
      { word: "Queen", emoji: "👸" },
      { word: "Question", emoji: "❓" },
      { word: "Quail", emoji: "🐦" },
      { word: "Quilt", emoji: "🛏️" },
      { word: "Quiet", emoji: "🤫" }
    ],
    R: [
      { word: "Rainbow", emoji: "🌈" },
      { word: "Robot", emoji: "🤖" },
      { word: "Rocket", emoji: "🚀" },
      { word: "Rose", emoji: "🌹" },
      { word: "Rabbit", emoji: "🐰" }
    ],
    S: [
      { word: "Sun", emoji: "☀️" },
      { word: "Star", emoji: "⭐" },
      { word: "Snake", emoji: "🐍" },
      { word: "Ship", emoji: "🚢" },
      { word: "Snowman", emoji: "⛄" }
    ],
    T: [
      { word: "Tree", emoji: "🌳" },
      { word: "Tiger", emoji: "🐅" },
      { word: "Train", emoji: "🚂" },
      { word: "Turtle", emoji: "🐢" },
      { word: "Treasure", emoji: "💰" }
    ],
    U: [
      { word: "Umbrella", emoji: "☂️" },
      { word: "Unicorn", emoji: "🦄" },
      { word: "UFO", emoji: "🛸" },
      { word: "Universe", emoji: "🌌" },
      { word: "Ukulele", emoji: "🎸" }
    ],
    V: [
      { word: "Violin", emoji: "🎻" },
      { word: "Volcano", emoji: "🌋" },
      { word: "Van", emoji: "🚐" },
      { word: "Vampire", emoji: "🧛" },
      { word: "Vegetable", emoji: "🥕" }
    ],
    W: [
      { word: "Whale", emoji: "🐋" },
      { word: "Watermelon", emoji: "🍉" },
      { word: "Wolf", emoji: "🐺" },
      { word: "Wind", emoji: "💨" },
      { word: "Wizard", emoji: "🧙" }
    ],
    X: [
      { word: "Xylophone", emoji: "🎹" },
      { word: "X-ray", emoji: "🩻" },
      { word: "Xbox", emoji: "🎮" },
      { word: "Xerus", emoji: "🐿️" },
      { word: "Xylem", emoji: "🌿" }
    ],
    Y: [
      { word: "Yellow", emoji: "💛" },
      { word: "Yacht", emoji: "🛥️" },
      { word: "Yak", emoji: "🦬" },
      { word: "Yarn", emoji: "🧶" },
      { word: "Yo-yo", emoji: "🪀" }
    ],
    Z: [
      { word: "Zebra", emoji: "🦓" },
      { word: "Zoo", emoji: "🦁" },
      { word: "Zombie", emoji: "🧟" },
      { word: "Zipper", emoji: "🤐" },
      { word: "Zeppelin", emoji: "🎈" }
    ]
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Dynamic grid calculation based on screen size
  const getGridCols = () => {
    if (window.innerWidth >= 1024) return 8; // lg screens
    if (window.innerWidth >= 768) return 6; // md screens
    return 4; // sm screens
  };

  const [gridCols, setGridCols] = useState(getGridCols());

  const colorfulBorders = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#6366f1", // indigo
    "#f97316", // orange
    "#14b8a6", // teal
    "#06b6d4" // cyan
  ];

  const getRandomWord = (letter: string): WordData => {
    const words = alphabetWords[letter];
    return words[Math.floor(Math.random() * words.length)];
  };

  const playAudio = (letter: string, word: string) => {
    setIsPlaying(true);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`${letter} for ${word}`);
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const handleLetterClick = (letter: string) => {
    const randomWord = getRandomWord(letter);
    setSelectedLetter(letter);
    setSelectedWord(randomWord);
    setIsFlipping(true);
    setShowWord(false);
    setPopupFocusedButton(0); // Focus on play button initially

    setTimeout(() => {
      setShowWord(true);
      setIsFlipping(false);
    }, 600);

    setTimeout(() => {
      playAudio(letter, randomWord.word);
    }, 800);
  };

  const handleNewWord = () => {
    if (!selectedLetter || !selectedWord) return;

    const availableWords = alphabetWords[selectedLetter];
    // Filter out the current word to avoid immediate repetition
    const otherWords = availableWords.filter(
      (wordData) => wordData.word !== selectedWord.word
    );

    // If all words have been used, allow repetition
    const wordsToChooseFrom =
      otherWords.length > 0 ? otherWords : availableWords;
    const newWord =
      wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];

    setIsFlipping(true);
    setShowWord(false);

    setTimeout(() => {
      setSelectedWord(newWord);
      setShowWord(true);
      setIsFlipping(false);
      playAudio(selectedLetter, newWord.word);
    }, 300);
  };

  const closePopup = () => {
    setSelectedLetter(null);
    setSelectedWord(null);
    setIsPlaying(false);
    setIsFlipping(false);
    setShowWord(false);
    speechSynthesis.cancel();
  };

  // TV Remote Navigation Handler
  const handleKeyPress = useCallback(
    (event: KeyEvent) => {
      const { key } = event;

      // Prevent default behavior for TV remote keys
      // if (
      //   [
      //     "ArrowUp",
      //     "ArrowDown",
      //     "ArrowLeft",
      //     "ArrowRight",
      //     "Enter",
      //     "Escape"
      //   ].includes(key)
      // ) {
      //   // return;
      // }

      if (selectedLetter) {
        // Popup is open - handle popup navigation
        switch (key) {
          case "Escape":
          case "Backspace":
            closePopup();
            break;

          case "ArrowLeft":
            setPopupFocusedButton((prev) => Math.max(0, prev - 1));
            break;

          case "ArrowRight":
            setPopupFocusedButton((prev) => Math.min(2, prev + 1));
            break;

          case "Enter":
            if (popupFocusedButton === 0) {
              // Play button
              if (selectedWord) {
                playAudio(selectedLetter, selectedWord.word);
              }
            } else if (popupFocusedButton === 1) {
              // New word button
              handleNewWord();
            } else if (popupFocusedButton === 2) {
              // Close button
              closePopup();
            }
            break;
        }
      } else {
        // Main grid navigation
        switch (key) {
          case "ArrowUp":
            setFocusedIndex((prev) => {
              const newIndex = prev - gridCols;
              return newIndex >= 0 ? newIndex : prev;
            });
            break;

          case "ArrowDown":
            setFocusedIndex((prev) => {
              const newIndex = prev + gridCols;
              return newIndex < letters.length ? newIndex : prev;
            });
            break;

          case "ArrowLeft":
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            break;

          case "ArrowRight":
            setFocusedIndex((prev) =>
              prev < letters.length - 1 ? prev + 1 : prev
            );
            break;

          case "Enter":
            handleLetterClick(letters[focusedIndex]);
            break;

          case "Escape":
          case "Backspace":
            // Close app or go back (handled by TV app)
            if (window.history.length > 1) {
              window.history.back();
            }
            break;
        }
      }
    },
    [
      selectedLetter,
      focusedIndex,
      popupFocusedButton,
      selectedWord,
      letters,
      gridCols
    ]
  );

  // Update grid columns on window resize
  useEffect(() => {
    const handleResize = () => {
      setGridCols(getGridCols());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up keyboard event listeners
  useEffect(() => {
    if (customKey?.key) {
      handleKeyPress(customKey);
      // window.addEventListener("keydown", );
      // return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [customKey]);

  // Focus management for accessibility
  useEffect(() => {
    const focusedElement = document.querySelector(
      `[data-letter-index="${focusedIndex}"]`
    ) as HTMLElement;
    if (focusedElement && !selectedLetter) {
      focusedElement.focus();
    }
  }, [focusedIndex, selectedLetter]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', sans-serif;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e0e7ff 100%);
          padding: 16px;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-title {
          font-size: 3rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 32px;
          color: #7c3aed;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .tv-instructions {
          text-align: center;
          margin-bottom: 24px;
          color: #7c3aed;
          font-weight: 600;
          font-size: 18px;
        }

        .letter-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        @media (min-width: 768px) {
          .letter-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          .main-title {
            font-size: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .letter-grid {
            grid-template-columns: repeat(8, 1fr);
          }
          .main-title {
            font-size: 5rem;
          }
        }

        .letter-button {
          position: relative;
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 4px solid;
          font-size: 2rem;
          font-weight: bold;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
        }

        .letter-button:hover {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .letter-button:active {
          transform: scale(0.95);
        }

        .letter-button.focused {
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.75), 0 8px 25px rgba(0,0,0,0.15);
          transform: scale(1.1);
        }

        .letter-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 100%);
          border-radius: 8px;
          pointer-events: none;
        }

        .focus-indicator {
          position: absolute;
          inset: -8px;
          border: 4px dashed #eab308;
          border-radius: 12px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
        }

        .popup-content {
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          position: relative;
          overflow: hidden;
          width: 80vw;
          height: 80vh;
          max-width: 600px;
          max-height: 600px;
        }

        .popup-instructions {
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 14px;
          color: #7c3aed;
          font-weight: 500;
          z-index: 10;
        }

        .popup-nav-buttons {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          z-index: 10;
        }

        .nav-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          position: relative;
        }

        .nav-button:hover {
          transform: scale(1.05);
        }

        .nav-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .nav-button.focused {
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.75);
          transform: scale(1.1);
        }

        .refresh-button {
          background: #10b981;
        }

        .refresh-button:hover:not(:disabled) {
          background: #059669;
        }

        .close-button {
          background: #ef4444;
        }

        .close-button:hover {
          background: #dc2626;
        }

        .popup-main-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          text-align: center;
        }

        .letter-display {
          margin-bottom: 32px;
        }

        .large-letter {
          font-size: 6rem;
          font-weight: bold;
          color: #7c3aed;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 16px;
          transition: all 0.6s ease;
        }

        .large-letter.flipping {
          transform: scale(1.1) rotate(12deg);
          animation: pulse 0.6s ease-in-out;
        }

        @media (min-width: 768px) {
          .large-letter {
            font-size: 8rem;
          }
        }

        .letter-label {
          font-size: 14px;
          color: #7c3aed;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .letter-label {
            font-size: 18px;
          }
        }

        .word-display {
          margin-bottom: 32px;
          transition: all 0.5s ease;
        }

        .word-display.hidden {
          opacity: 0;
          transform: scale(0.75) translateY(16px);
        }

        .word-display.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .word-emoji {
          font-size: 4rem;
          margin-bottom: 16px;
          animation: bounce 2s infinite;
        }

        .word-text {
          font-size: 3rem;
          font-weight: bold;
          color: #059669;
          margin-bottom: 8px;
        }

        @media (min-width: 768px) {
          .word-text {
            font-size: 4rem;
          }
        }

        .word-description {
          font-size: 18px;
          color: #059669;
        }

        @media (min-width: 768px) {
          .word-description {
            font-size: 24px;
          }
        }

        .play-button-container {
          position: relative;
        }

        .play-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border-radius: 50px;
          color: white;
          font-weight: bold;
          font-size: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .play-button:not(:disabled) {
          background: #3b82f6;
        }

        .play-button:hover:not(:disabled) {
          background: #2563eb;
          transform: scale(1.05);
        }

        .play-button:active:not(:disabled) {
          transform: scale(0.95);
        }

        .play-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .play-button.focused {
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.75);
          transform: scale(1.1);
        }

        .floating-decoration {
          position: absolute;
          font-size: 2rem;
          animation: bounce 3s infinite;
        }

        .floating-decoration.top-left {
          top: 100px;
          left: 48px;
        }

        .floating-decoration.bottom-right {
          bottom: 48px;
          right: 48px;
          animation: pulse 3s infinite;
        }

        .floating-decoration.top-right {
          top: 80px;
          right: 80px;
          font-size: 1.5rem;
          animation: spin 4s linear infinite;
        }

        .floating-decoration.bottom-left {
          bottom: 80px;
          left: 80px;
          font-size: 1.5rem;
          animation: bounce 3s infinite 0.3s;
        }

        .floating-decoration.confetti-1 {
          top: 25%;
          left: 25%;
          font-size: 1.5rem;
          animation: ping 2s infinite;
        }

        .floating-decoration.confetti-2 {
          top: 75%;
          right: 25%;
          font-size: 1.5rem;
          animation: ping 2s infinite 0.5s;
        }

        .footer {
          text-align: center;
          margin-top: 32px;
          color: #7c3aed;
          font-weight: 600;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @media (min-width: 768px) {
          .letter-button {
            width: 80px;
            height: 80px;
            font-size: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .letter-button {
            width: 96px;
            height: 96px;
            font-size: 3rem;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="content-wrapper">
          <h1 className="main-title">🌈 Learn the Alphabet! 🌈</h1>

          {/* TV Instructions */}
          {!selectedLetter && (
            <div className="tv-instructions">
              📺 Use ← → ↑ ↓ to navigate • Press OK/Enter to select • Back to
              exit
            </div>
          )}

          {/* Alphabet Grid */}
          <div className="letter-grid">
            {letters.map((letter, index) => (
              <button
                key={letter}
                data-letter-index={index}
                onClick={() => handleLetterClick(letter)}
                className={`letter-button ${
                  focusedIndex === index && !selectedLetter ? "focused" : ""
                }`}
                style={{
                  borderColor: colorfulBorders[index % colorfulBorders.length]
                }}
              >
                {letter}
                {focusedIndex === index && !selectedLetter && (
                  <div className="focus-indicator"></div>
                )}
              </button>
            ))}
          </div>

          {/* Popup Modal */}
          {selectedLetter && selectedWord && (
            <div className="popup-overlay">
              <div className="popup-content">
                {/* TV Navigation Instructions in Popup */}
                <div className="popup-instructions">
                  ← → to navigate buttons • OK to select • Back to close
                </div>

                {/* Navigation Buttons Row */}
                <div className="popup-nav-buttons">
                  {/* New Word Button */}
                  <button
                    onClick={handleNewWord}
                    disabled={isFlipping || isPlaying}
                    className={`nav-button refresh-button ${
                      popupFocusedButton === 1 ? "focused" : ""
                    }`}
                    title="Try another word!"
                  >
                    <RefreshCw
                      size={24}
                      className={isFlipping ? "spinning" : ""}
                    />
                    {popupFocusedButton === 1 && (
                      <div className="focus-indicator"></div>
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={closePopup}
                    className={`nav-button close-button ${
                      popupFocusedButton === 2 ? "focused" : ""
                    }`}
                  >
                    <X size={24} />
                    {popupFocusedButton === 2 && (
                      <div className="focus-indicator"></div>
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="popup-main-content">
                  {/* Animated Letter Display */}
                  <div className="letter-display">
                    <div
                      className={`large-letter ${isFlipping ? "flipping" : ""}`}
                    >
                      {selectedLetter}
                    </div>
                    <div className="letter-label">Letter {selectedLetter}</div>
                  </div>

                  {/* Animated Word Display */}
                  <div
                    className={`word-display ${
                      showWord ? "visible" : "hidden"
                    }`}
                  >
                    <div className="word-emoji">{selectedWord.emoji}</div>
                    <div className="word-text">{selectedWord.word}</div>
                    <div className="word-description">
                      {selectedLetter} is for {selectedWord.word}
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="play-button-container">
                    <button
                      onClick={() =>
                        playAudio(selectedLetter, selectedWord.word)
                      }
                      disabled={isPlaying}
                      className={`play-button ${
                        popupFocusedButton === 0 ? "focused" : ""
                      }`}
                    >
                      <Volume2 size={28} />
                      {isPlaying ? "Playing..." : "Hear It!"}
                    </button>
                    {popupFocusedButton === 0 && (
                      <div className="focus-indicator"></div>
                    )}
                  </div>

                  {/* Floating Animations */}
                  <div className="floating-decoration top-left">🎵</div>
                  <div className="floating-decoration bottom-right">✨</div>
                  <div className="floating-decoration top-right">🌟</div>
                  <div className="floating-decoration bottom-left">🎈</div>

                  <div className="floating-decoration confetti-1">🎊</div>
                  <div className="floating-decoration confetti-2">🎉</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          📺 Perfect for TV! Use your remote to navigate and learn! 🎓
        </div>
      </div>
    </>
  );
};

export default AlphabetLearningApp;
