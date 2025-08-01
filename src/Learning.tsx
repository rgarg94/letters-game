import React, { useState, useEffect, useCallback } from "react";
import { X, Volume2, RefreshCw } from "lucide-react";
import a_apple from "./audio/a_apple.mp3";
import a_airplane from "./audio/a_airplane.mp3";
import a_ant from "./audio/a_ant.mp3";
import b_ball from "./audio/b_ball.mp3";
import b_butterfly from "./audio/b_butterfly.mp3";
import c_cat from "./audio/c_cat.mp3";
import d_dog from "./audio/d_dog.mp3";
import e_elephant from "./audio/e_elephant.mp3";
import f_fish from "./audio/f_fish.mp3";
import g_giraffe from "./audio/g_giraffe.mp3";
import h_house from "./audio/h_house.mp3";
import i_ice_cream from "./audio/i_ice_cream.mp3";
import j_jellyfish from "./audio/j_jellyfish.mp3";
import k_kite from "./audio/k_kite.mp3";
import l_lion from "./audio/l_lion.mp3";
import m_moon from "./audio/m_moon.mp3";
import n_nest from "./audio/n_nest.mp3";
import o_orange from "./audio/o_orange.mp3";
import p_penguin from "./audio/p_penguin.mp3";
import q_queen from "./audio/q_queen.mp3";
import r_rainbow from "./audio/r_rainbow.mp3";
import s_sun from "./audio/s_sun.mp3";
import t_tree from "./audio/t_tree.mp3";
import u_umbrella from "./audio/u_umbrella.mp3";
import v_violin from "./audio/v_violin.mp3";
import w_whale from "./audio/w_whale.mp3";
import x_xylophone from "./audio/x_xylophone.mp3";
import y_yellow from "./audio/y_yellow.mp3";
import z_zebra from "./audio/z_zebra.mp3";

interface WordData {
  word: string;
  emoji: string;
  audioFile: string;
}

export interface KeyEvent {
  keyCode: number;
  virtualKey: string;
  key: string;
}

// Multiple word options for each letter
const alphabetWords: Record<string, WordData[]> = {
  A: [
    { word: "Apple", emoji: "🍎", audioFile: a_apple },
    { word: "Airplane", emoji: "✈️", audioFile: a_airplane },
    { word: "Ant", emoji: "🐜", audioFile: a_ant }
  ],
  B: [
    { word: "Ball", emoji: "⚽", audioFile: b_ball },
    { word: "Butterfly", emoji: "🦋", audioFile: b_butterfly }
  ],
  C: [{ word: "Cat", emoji: "🐱", audioFile: c_cat }],
  D: [{ word: "Dog", emoji: "🐶", audioFile: d_dog }],
  E: [{ word: "Elephant", emoji: "🐘", audioFile: e_elephant }],
  F: [{ word: "Fish", emoji: "🐠", audioFile: f_fish }],
  G: [{ word: "Giraffe", emoji: "🦒", audioFile: g_giraffe }],
  H: [{ word: "House", emoji: "🏠", audioFile: h_house }],
  I: [{ word: "Ice Cream", emoji: "🍦", audioFile: i_ice_cream }],
  J: [{ word: "Jellyfish", emoji: "🪼", audioFile: j_jellyfish }],
  K: [{ word: "Kite", emoji: "🪁", audioFile: k_kite }],
  L: [{ word: "Lion", emoji: "🦁", audioFile: l_lion }],
  M: [{ word: "Moon", emoji: "🌙", audioFile: m_moon }],
  N: [{ word: "Nest", emoji: "🪺", audioFile: n_nest }],
  O: [{ word: "Orange", emoji: "🍊", audioFile: o_orange }],
  P: [{ word: "Penguin", emoji: "🐧", audioFile: p_penguin }],
  Q: [{ word: "Queen", emoji: "👸", audioFile: q_queen }],
  R: [{ word: "Rainbow", emoji: "🌈", audioFile: r_rainbow }],
  S: [{ word: "Sun", emoji: "☀️", audioFile: s_sun }],
  T: [{ word: "Tree", emoji: "🌳", audioFile: t_tree }],
  U: [{ word: "Umbrella", emoji: "☂️", audioFile: u_umbrella }],
  V: [{ word: "Violin", emoji: "🎻", audioFile: v_violin }],
  W: [{ word: "Whale", emoji: "🐋", audioFile: w_whale }],
  X: [{ word: "Xylophone", emoji: "🎹", audioFile: x_xylophone }],
  Y: [{ word: "Yellow", emoji: "💛", audioFile: y_yellow }],
  Z: [{ word: "Zebra", emoji: "🦓", audioFile: z_zebra }]
};

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AlphabetLearningApp = ({ customKey }: { customKey?: KeyEvent }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showWord, setShowWord] = useState(false);

  // TV Navigation states
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [popupFocusedButton, setPopupFocusedButton] = useState(0); // 0: play, 1: new word, 2: close

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

  const playAudio = (audioFile: string) => {
    setIsPlaying(true);
    const audio = new Audio(audioFile);
    audio.play();
    setIsPlaying(false);

    // if ("speechSynthesis" in window) {
    //   const utterance = new SpeechSynthesisUtterance(`${letter} for ${word}`);
    //   utterance.rate = 0.7;
    //   utterance.pitch = 1.1;
    //   utterance.volume = 0.8;

    //   utterance.onend = () => setIsPlaying(false);
    //   utterance.onerror = () => setIsPlaying(false);

    //   speechSynthesis.cancel();
    //   speechSynthesis.speak(utterance);
    // } else {
    //   setIsPlaying(false);
    // }
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
      playAudio(randomWord.audioFile);
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
      playAudio(newWord.audioFile);
    }, 300);
  };

  const closePopup = () => {
    setSelectedLetter(null);
    setSelectedWord(null);
    setIsPlaying(false);
    setIsFlipping(false);
    setShowWord(false);
    // speechSynthesis.cancel();
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
      // }

      console.log("handleKeyPress", { selectedLetter });

      if (selectedLetter) {
        console.log({ selectedLetter, key });

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
                playAudio(selectedWord.audioFile);
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
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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
          width: 90vw;
          height: 90vh;
          max-width: 600px;
          max-height: 600px;
        }

        .popup-instructions {
          font-size: 14px;
          color: #7c3aed;
          font-weight: 500;
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

        .large-letter {
          font-size: 6rem;
          font-weight: bold;
          color: #7c3aed;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          transition: all 0.6s ease;
        }

        .large-letter.flipping {
          transform: scale(1.1) rotate(12deg);
          animation: pulse 0.6s ease-in-out;
        }

        @media (min-width: 768px) {
          .large-letter {
            font-size: 7rem;
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
          margin-bottom: 16px;
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
          font-size: 6rem;
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
                  {/* TV Navigation Instructions in Popup */}
                  <div className="popup-instructions">
                    ← → to navigate buttons • OK to select • Back to close
                  </div>
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
                      onClick={() => playAudio(selectedWord.audioFile)}
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
