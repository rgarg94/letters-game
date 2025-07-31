import React, { useState, useEffect, useCallback } from 'react';
import { X, Volume2, RefreshCw } from 'lucide-react';

interface WordData {
  word: string;
  emoji: string;
}

const AlphabetLearningApp: React.FC = () => {
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
      { word: 'Apple', emoji: '🍎' },
      { word: 'Airplane', emoji: '✈️' },
      { word: 'Ant', emoji: '🐜' },
      { word: 'Alligator', emoji: '🐊' },
      { word: 'Arrow', emoji: '➡️' }
    ],
    B: [
      { word: 'Ball', emoji: '⚽' },
      { word: 'Butterfly', emoji: '🦋' },
      { word: 'Banana', emoji: '🍌' },
      { word: 'Bear', emoji: '🐻' },
      { word: 'Boat', emoji: '🚤' }
    ],
    C: [
      { word: 'Cat', emoji: '🐱' },
      { word: 'Car', emoji: '🚗' },
      { word: 'Cake', emoji: '🍰' },
      { word: 'Crown', emoji: '👑' },
      { word: 'Cloud', emoji: '☁️' }
    ],
    D: [
      { word: 'Dog', emoji: '🐶' },
      { word: 'Duck', emoji: '🦆' },
      { word: 'Dolphin', emoji: '🐬' },
      { word: 'Dinosaur', emoji: '🦕' },
      { word: 'Dragon', emoji: '🐉' }
    ],
    E: [
      { word: 'Elephant', emoji: '🐘' },
      { word: 'Eagle', emoji: '🦅' },
      { word: 'Earth', emoji: '🌍' },
      { word: 'Egg', emoji: '🥚' },
      { word: 'Eye', emoji: '👁️' }
    ],
    F: [
      { word: 'Fish', emoji: '🐠' },
      { word: 'Flower', emoji: '🌸' },
      { word: 'Fire', emoji: '🔥' },
      { word: 'Frog', emoji: '🐸' },
      { word: 'Fox', emoji: '🦊' }
    ],
    G: [
      { word: 'Giraffe', emoji: '🦒' },
      { word: 'Guitar', emoji: '🎸' },
      { word: 'Grapes', emoji: '🍇' },
      { word: 'Ghost', emoji: '👻' },
      { word: 'Gift', emoji: '🎁' }
    ],
    H: [
      { word: 'House', emoji: '🏠' },
      { word: 'Horse', emoji: '🐴' },
      { word: 'Heart', emoji: '❤️' },
      { word: 'Hat', emoji: '🎩' },
      { word: 'Helicopter', emoji: '🚁' }
    ],
    I: [
      { word: 'Ice Cream', emoji: '🍦' },
      { word: 'Island', emoji: '🏝️' },
      { word: 'Igloo', emoji: '🏔️' },
      { word: 'Insect', emoji: '🐛' },
      { word: 'Iron', emoji: '🔧' }
    ],
    J: [
      { word: 'Jellyfish', emoji: '🪼' },
      { word: 'Jacket', emoji: '🧥' },
      { word: 'Juice', emoji: '🧃' },
      { word: 'Jewel', emoji: '💎' },
      { word: 'Jungle', emoji: '🌴' }
    ],
    K: [
      { word: 'Kite', emoji: '🪁' },
      { word: 'King', emoji: '👑' },
      { word: 'Kangaroo', emoji: '🦘' },
      { word: 'Key', emoji: '🔑' },
      { word: 'Kitchen', emoji: '🍳' }
    ],
    L: [
      { word: 'Lion', emoji: '🦁' },
      { word: 'Leaf', emoji: '🍃' },
      { word: 'Lightning', emoji: '⚡' },
      { word: 'Ladybug', emoji: '🐞' },
      { word: 'Lemon', emoji: '🍋' }
    ],
    M: [
      { word: 'Moon', emoji: '🌙' },
      { word: 'Monkey', emoji: '🐵' },
      { word: 'Mouse', emoji: '🐭' },
      { word: 'Mountain', emoji: '⛰️' },
      { word: 'Music', emoji: '🎵' }
    ],
    N: [
      { word: 'Nest', emoji: '🪺' },
      { word: 'Night', emoji: '🌃' },
      { word: 'Nose', emoji: '👃' },
      { word: 'Narwhal', emoji: '🐋' },
      { word: 'Ninja', emoji: '🥷' }
    ],
    O: [
      { word: 'Orange', emoji: '🍊' },
      { word: 'Ocean', emoji: '🌊' },
      { word: 'Owl', emoji: '🦉' },
      { word: 'Octopus', emoji: '🐙' },
      { word: 'Onion', emoji: '🧅' }
    ],
    P: [
      { word: 'Penguin', emoji: '🐧' },
      { word: 'Pizza', emoji: '🍕' },
      { word: 'Parrot', emoji: '🦜' },
      { word: 'Planet', emoji: '🪐' },
      { word: 'Panda', emoji: '🐼' }
    ],
    Q: [
      { word: 'Queen', emoji: '👸' },
      { word: 'Question', emoji: '❓' },
      { word: 'Quail', emoji: '🐦' },
      { word: 'Quilt', emoji: '🛏️' },
      { word: 'Quiet', emoji: '🤫' }
    ],
    R: [
      { word: 'Rainbow', emoji: '🌈' },
      { word: 'Robot', emoji: '🤖' },
      { word: 'Rocket', emoji: '🚀' },
      { word: 'Rose', emoji: '🌹' },
      { word: 'Rabbit', emoji: '🐰' }
    ],
    S: [
      { word: 'Sun', emoji: '☀️' },
      { word: 'Star', emoji: '⭐' },
      { word: 'Snake', emoji: '🐍' },
      { word: 'Ship', emoji: '🚢' },
      { word: 'Snowman', emoji: '⛄' }
    ],
    T: [
      { word: 'Tree', emoji: '🌳' },
      { word: 'Tiger', emoji: '🐅' },
      { word: 'Train', emoji: '🚂' },
      { word: 'Turtle', emoji: '🐢' },
      { word: 'Treasure', emoji: '💰' }
    ],
    U: [
      { word: 'Umbrella', emoji: '☂️' },
      { word: 'Unicorn', emoji: '🦄' },
      { word: 'UFO', emoji: '🛸' },
      { word: 'Universe', emoji: '🌌' },
      { word: 'Ukulele', emoji: '🎸' }
    ],
    V: [
      { word: 'Violin', emoji: '🎻' },
      { word: 'Volcano', emoji: '🌋' },
      { word: 'Van', emoji: '🚐' },
      { word: 'Vampire', emoji: '🧛' },
      { word: 'Vegetable', emoji: '🥕' }
    ],
    W: [
      { word: 'Whale', emoji: '🐋' },
      { word: 'Watermelon', emoji: '🍉' },
      { word: 'Wolf', emoji: '🐺' },
      { word: 'Wind', emoji: '💨' },
      { word: 'Wizard', emoji: '🧙' }
    ],
    X: [
      { word: 'Xylophone', emoji: '🎹' },
      { word: 'X-ray', emoji: '🩻' },
      { word: 'Xbox', emoji: '🎮' },
      { word: 'Xerus', emoji: '🐿️' },
      { word: 'Xylem', emoji: '🌿' }
    ],
    Y: [
      { word: 'Yellow', emoji: '💛' },
      { word: 'Yacht', emoji: '🛥️' },
      { word: 'Yak', emoji: '🦬' },
      { word: 'Yarn', emoji: '🧶' },
      { word: 'Yo-yo', emoji: '🪀' }
    ],
    Z: [
      { word: 'Zebra', emoji: '🦓' },
      { word: 'Zoo', emoji: '🦁' },
      { word: 'Zombie', emoji: '🧟' },
      { word: 'Zipper', emoji: '🤐' },
      { word: 'Zeppelin', emoji: '🎈' }
    ]
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const GRID_COLS = 8; // For navigation calculation

  const colorfulBorders = [
    'border-red-400',
    'border-blue-400',
    'border-green-400',
    'border-yellow-400',
    'border-purple-400',
    'border-pink-400',
    'border-indigo-400',
    'border-orange-400',
    'border-teal-400',
    'border-cyan-400'
  ];

  const getRandomWord = (letter: string): WordData => {
    const words = alphabetWords[letter];
    return words[Math.floor(Math.random() * words.length)];
  };

  const playAudio = (letter: string, word: string) => {
    setIsPlaying(true);
    
    if ('speechSynthesis' in window) {
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
    if (!selectedLetter) return;
    
    const newWord = getRandomWord(selectedLetter);
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
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    // Prevent default behavior for TV remote keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(key)) {
      event.preventDefault();
    }

    if (selectedLetter) {
      // Popup is open - handle popup navigation
      switch (key) {
        case 'Escape':
        case 'Backspace':
          closePopup();
          break;
        
        case 'ArrowLeft':
          setPopupFocusedButton(prev => Math.max(0, prev - 1));
          break;
        
        case 'ArrowRight':
          setPopupFocusedButton(prev => Math.min(2, prev + 1));
          break;
        
        case 'Enter':
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
        case 'ArrowUp':
          setFocusedIndex(prev => {
            const newIndex = prev - GRID_COLS;
            return newIndex >= 0 ? newIndex : prev;
          });
          break;
        
        case 'ArrowDown':
          setFocusedIndex(prev => {
            const newIndex = prev + GRID_COLS;
            return newIndex < letters.length ? newIndex : prev;
          });
          break;
        
        case 'ArrowLeft':
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        
        case 'ArrowRight':
          setFocusedIndex(prev => prev < letters.length - 1 ? prev + 1 : prev);
          break;
        
        case 'Enter':
          handleLetterClick(letters[focusedIndex]);
          break;
        
        case 'Escape':
        case 'Backspace':
          // Close app or go back (handled by TV app)
          if (window.history.length > 1) {
            window.history.back();
          }
          break;
      }
    }
  }, [selectedLetter, focusedIndex, popupFocusedButton, selectedWord, letters]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Focus management for accessibility
  useEffect(() => {
    const focusedElement = document.querySelector(`[data-letter-index="${focusedIndex}"]`) as HTMLElement;
    if (focusedElement && !selectedLetter) {
      focusedElement.focus();
    }
  }, [focusedIndex, selectedLetter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-purple-800 drop-shadow-lg">
          🌈 Learn the Alphabet! 🌈
        </h1>
        
        {/* TV Instructions */}
        {!selectedLetter && (
          <div className="text-center mb-6 text-purple-700 font-semibold text-lg">
            📺 Use ← → ↑ ↓ to navigate • Press OK/Enter to select • Back to exit
          </div>
        )}
        
        {/* Alphabet Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
          {letters.map((letter, index) => (
            <button
              key={letter}
              data-letter-index={index}
              onClick={() => handleLetterClick(letter)}
              className={`
                relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                bg-white rounded-xl shadow-lg
                border-4 ${colorfulBorders[index % colorfulBorders.length]}
                ${focusedIndex === index && !selectedLetter ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}
                text-3xl md:text-4xl lg:text-5xl font-bold
                text-gray-700
                hover:scale-110 hover:shadow-xl
                active:scale-95
                transition-all duration-200
                transform hover:rotate-3
                focus:outline-none
              `}
            >
              {letter}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-lg pointer-events-none"></div>
              {focusedIndex === index && !selectedLetter && (
                <div className="absolute -inset-2 border-4 border-dashed border-yellow-500 rounded-xl animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Popup Modal */}
        {selectedLetter && selectedWord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-3xl shadow-2xl relative overflow-hidden"
              style={{ 
                width: '80vw', 
                height: '80vh',
                maxWidth: '600px',
                maxHeight: '600px'
              }}
            >
              {/* TV Navigation Instructions in Popup */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-sm text-purple-600 font-medium z-10">
                ← → to navigate buttons • OK to select • Back to close
              </div>

              {/* Navigation Buttons Row */}
              <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                {/* New Word Button */}
                <button
                  onClick={handleNewWord}
                  disabled={isFlipping || isPlaying}
                  className={`
                    bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full p-3 shadow-lg transition-all duration-200
                    ${popupFocusedButton === 1 ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}
                    focus:outline-none
                  `}
                  title="Try another word!"
                >
                  <RefreshCw size={24} className={isFlipping ? 'animate-spin' : ''} />
                  {popupFocusedButton === 1 && (
                    <div className="absolute -inset-1 border-2 border-dashed border-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className={`
                    bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transition-all duration-200
                    ${popupFocusedButton === 2 ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}
                    focus:outline-none
                  `}
                >
                  <X size={24} />
                  {popupFocusedButton === 2 && (
                    <div className="absolute -inset-1 border-2 border-dashed border-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Animated Letter Display */}
                <div className="mb-8 perspective-1000">
                  <div className={`
                    text-8xl md:text-9xl font-bold text-purple-800 drop-shadow-lg mb-4
                    transition-all duration-600 transform-gpu
                    ${isFlipping ? 'animate-pulse scale-110 rotate-12' : 'scale-100 rotate-0'}
                  `}>
                    {selectedLetter}
                  </div>
                  <div className="text-sm md:text-lg text-purple-600 font-semibold">
                    Letter {selectedLetter}
                  </div>
                </div>

                {/* Animated Word Display */}
                <div className={`
                  mb-8 transition-all duration-500 transform
                  ${showWord ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4'}
                `}>
                  <div className="text-6xl mb-4 animate-bounce">
                    {selectedWord.emoji}
                  </div>
                  <div className="text-4xl md:text-6xl font-bold text-green-700 mb-2">
                    {selectedWord.word}
                  </div>
                  <div className="text-lg md:text-xl text-green-600">
                    {selectedLetter} is for {selectedWord.word}
                  </div>
                </div>

                {/* Play Button */}
                <div className="relative">
                  <button
                    onClick={() => playAudio(selectedLetter, selectedWord.word)}
                    disabled={isPlaying}
                    className={`
                      flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-xl shadow-lg transition-all duration-200
                      ${isPlaying 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
                      }
                      ${popupFocusedButton === 0 ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}
                      focus:outline-none
                    `}
                  >
                    <Volume2 size={28} />
                    {isPlaying ? 'Playing...' : 'Hear It!'}
                  </button>
                  {popupFocusedButton === 0 && (
                    <div className="absolute -inset-2 border-4 border-dashed border-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                {/* Floating Animations */}
                <div className="absolute top-12 left-12 text-3xl animate-bounce">🎵</div>
                <div className="absolute bottom-12 right-12 text-3xl animate-pulse">✨</div>
                <div className="absolute top-20 right-20 text-2xl animate-spin">🌟</div>
                <div className="absolute bottom-20 left-20 text-2xl animate-bounce delay-300">🎈</div>
                
                <div className="absolute top-1/4 left-1/4 text-2xl animate-ping">🎊</div>
                <div className="absolute top-3/4 right-1/4 text-2xl animate-ping delay-500">🎉</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-purple-700 font-semibold">
        📺 Perfect for TV! Use your remote to navigate and learn! 🎓
      </div>
    </div>
  );
};

export default AlphabetLearningApp;