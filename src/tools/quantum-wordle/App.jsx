
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { GUESSES, ANSWERS } from './words.js';

const MAX_GUESSES = 10;
const WORD_LENGTH = 5;
const SECRET_COUNT = 3;

const RANK = {
  black: 0,
  yellow: 1,
  green: 2
};

const VALID_GUESSES = new Set(
  GUESSES.map(w => w.toLowerCase())
);

const POSSIBLE_ANSWERS = [
  ...new Set(ANSWERS.map(w => w.toLowerCase()))
].filter(w =>
  /^[a-z]{5}$/.test(w) &&
  VALID_GUESSES.has(w)
);

// ========================================
// CHOOSE THREE SECRET WORDS
// ========================================

function chooseWords() {
  const pool = [...POSSIBLE_ANSWERS];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, SECRET_COUNT);
}

// ========================================
// ORDINARY WORDLE GRADING
// ========================================

// Correctly handles repeated letters.

function grade(guess, answer) {
  const colors = Array(WORD_LENGTH).fill('black');
  const counts = {};

  // First find green letters.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      colors[i] = 'green';
    } else {
      counts[answer[i]] =
        (counts[answer[i]] || 0) + 1;
    }
  }

  // Then find yellow letters.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (colors[i] === 'green') continue;

    const letter = guess[i];

    if ((counts[letter] || 0) > 0) {
      colors[i] = 'yellow';
      counts[letter]--;
    }
  }

  return colors;
}

// ========================================
// QUANTUM WORDLE GRADING
// ========================================

// Green > Yellow > Black.
//
// Each position uses the strongest color
// from any remaining secret word.

function quantumGrade(guess, secrets) {
  const grades = secrets.map(answer =>
    grade(guess, answer)
  );

  return Array.from(
    { length: WORD_LENGTH },
    (_, i) => grades.reduce(
      (best, colors) =>
        RANK[colors[i]] > RANK[best]
          ? colors[i]
          : best,
      'black'
    )
  );
}

function equalColors(a, b) {
  return a.every((color, i) => color === b[i]);
}

// ========================================
// PARADOX DETECTION
// ========================================

// A paradox occurs when the combined
// feedback is impossible for every
// remaining secret word.

function isParadox(guess, secrets) {
  if (secrets.length <= 1) return false;

  const combined = quantumGrade(guess, secrets);

  return !secrets.some(answer =>
    equalColors(
      grade(guess, answer),
      combined
    )
  );
}

// ========================================
// COLLAPSE CHOICES
// ========================================

// Find positions whose combined color
// is not shared by every possible word.
//
// IMPORTANT:
// Prefer choices that preserve MORE words.
//
// This means:
// 3 -> 2 is preferred over 3 -> 1.
//
// If 3 -> 2 is impossible, 3 -> 1
// is still allowed.

function getCollapseChoices(guess, secrets) {
  const combined = quantumGrade(guess, secrets);
  const choices = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const survivors = secrets.filter(answer =>
      grade(guess, answer)[i] === combined[i]
    );

    if (
      survivors.length > 0 &&
      survivors.length < secrets.length
    ) {
      choices.push({
        position: i,
        letter: guess[i],
        color: combined[i],
        survivors
      });
    }
  }

  // Sort by number of survivors,
  // largest first.
  choices.sort((a, b) =>
    b.survivors.length - a.survivors.length
  );

  // Give the player two choices.
  return choices.slice(0, 2);
}

// ========================================
// MAIN APP
// ========================================

function App() {
  const [secrets, setSecrets] = useState(chooseWords);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState('');
  const [message, setMessage] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  // Most recent guess.
  const latest = history.at(-1);

  // ======================================
  // RECALCULATE ALL PREVIOUS COLORS
  // ======================================

  // These are calculated from secrets
  // rather than permanently stored.
  //
  // Every time secrets changes, ALL
  // previous rows change automatically.

  const rows = useMemo(() =>
    history.map(guess => ({
      guess,
      colors: quantumGrade(guess, secrets)
    })),
    [history, secrets]
  );

  // ======================================
  // PARADOX STATE
  // ======================================

  const paradox = Boolean(
    latest &&
    isParadox(latest, secrets)
  );

  const choices = paradox
    ? getCollapseChoices(latest, secrets)
    : [];

  // ======================================
  // KEYBOARD COLORS
  // ======================================

  const keyColors = useMemo(() => {
    const colors = {};

    for (const row of rows) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = row.guess[i];
        const color = row.colors[i];

        if (
          colors[letter] === undefined ||
          RANK[color] > RANK[colors[letter]]
        ) {
          colors[letter] = color;
        }
      }
    }

    return colors;
  }, [rows]);

  // ======================================
  // WIN / LOSS
  // ======================================

  const won = Boolean(
    latest &&
    secrets.length === 1 &&
    latest === secrets[0] &&
    !paradox
  );

  const lost = Boolean(
    !won &&
    !paradox &&
    history.length >= MAX_GUESSES
  );

  const finished = won || lost;

  // ======================================
  // NEW GAME
  // ======================================

  function newGame() {
    setSecrets(chooseWords());
    setHistory([]);
    setCurrent('');
    setMessage('');
    setShowAnswers(false);
  }

  // ======================================
  // SUBMIT GUESS
  // ======================================

  function submit() {
    if (finished || paradox) return;

    if (current.length !== WORD_LENGTH) {
      setMessage('Not enough letters.');
      return;
    }

    if (!VALID_GUESSES.has(current)) {
      setMessage('Not in dictionary.');
      return;
    }

    setHistory(old => [...old, current]);
    setCurrent('');
    setMessage('');
  }

  // ======================================
  // KEYBOARD INPUT
  // ======================================

  function handleKey(key) {
    if (finished || paradox) return;

    if (key === 'ENTER') {
      submit();
    } else if (key === 'BACKSPACE') {
      setCurrent(w => w.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      setCurrent(w =>
        w.length < WORD_LENGTH
          ? w + key.toLowerCase()
          : w
      );
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        handleKey('ENTER');
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKey(event.key.toUpperCase());
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () =>
      window.removeEventListener('keydown', onKeyDown);
  });

  // ======================================
  // QUANTUM COLLAPSE
  // ======================================

  function collapse(choice) {
    // Eliminate every word that does not
    // support the selected position's
    // displayed color.

    setSecrets(choice.survivors);

    setMessage(
      `Reality collapsed! ` +
      `${choice.survivors.length} possible ` +
      `word${choice.survivors.length === 1 ? '' : 's'} ` +
      `remain.`
    );

    // No explicit recoloring is necessary.
    // rows and keyColors update automatically.
  }

  // ======================================
  // DRAW WORDLE TILES
  // ======================================

  function renderTiles(word, colors = []) {
    return Array.from(
      { length: WORD_LENGTH },
      (_, i) => (
        <div
          key={i}
          className={
            `tile ${colors[i] || (
              word[i] ? 'filled' : ''
            )}`
          }
        >
          {word[i]?.toUpperCase() || ''}
        </div>
      )
    );
  }

  const keyboardRows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
  ];

  // ======================================
  // RENDER
  // ======================================

  return (
    <main className="app">

      <header>
        <h1>QUANTUM WORDLE</h1>

        <p>
          Three possible words.
          One unstable reality.
        </p>
      </header>

      <div className="stats">
        <span>
          Possible words: {secrets.length}
        </span>

        <span>
          Guesses: {history.length}/{MAX_GUESSES}
        </span>
      </div>

      {/* GAME BOARD */}

      <div className="board">
        {Array.from(
          { length: MAX_GUESSES },
          (_, i) => {
            const row = rows[i];

            return (
              <div
                className="board-row"
                key={i}
              >
                {row
                  ? renderTiles(
                      row.guess,
                      row.colors
                    )
                  : i === history.length
                    ? renderTiles(current)
                    : renderTiles('')
                }
              </div>
            );
          }
        )}
      </div>

      {/* QUANTUM PARADOX */}

      {paradox && (
        <div className="paradox-panel">

          <h2>Quantum Paradox!</h2>

          <p>
            No remaining word matches all
            of the displayed colors.
          </p>

          <p>
            Choose a position whose color
            must remain unchanged.
          </p>

          <div className="collapse-choices">
            {choices.map(choice => (
              <button
                key={choice.position}
                className="collapse-choice"
                onClick={() => collapse(choice)}
              >

                <span
                  className={
                    `choice-letter ${choice.color}`
                  }
                >
                  {choice.letter.toUpperCase()}
                </span>

                <span>
                  Position {choice.position + 1}
                </span>

                <small>
                  Keep {choice.color}
                </small>

                <small>
                  {choice.survivors.length}
                  {' '}word
                  {choice.survivors.length === 1 ? '' : 's'}
                  {' '}survive
                </small>

              </button>
            ))}
          </div>
        </div>
      )}

      {/* WIN / LOSS */}

      {won && (
        <h2 className="success">
          You won! Reality has collapsed!
        </h2>
      )}

      {lost && (
        <div className="game-result">
          <h2>Game over!</h2>

          <p>
            Remaining answers:
            {' '}
            {secrets.join(', ').toUpperCase()}
          </p>
        </div>
      )}

      {/* STATUS MESSAGE */}

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {/* ON-SCREEN KEYBOARD */}

      <div className="keyboard">
        {keyboardRows.map(
          (letters, rowIndex) => (
            <div
              className="keyboard-row"
              key={letters}
            >

              {rowIndex === 2 && (
                <button
                  className="key wide"
                  onClick={() => handleKey('ENTER')}
                  disabled={finished || paradox}
                >
                  ENTER
                </button>
              )}

              {[...letters].map(letter => (
                <button
                  key={letter}
                  className={
                    `key ${
                      keyColors[
                        letter.toLowerCase()
                      ] || ''
                    }`
                  }
                  onClick={() => handleKey(letter)}
                  disabled={finished || paradox}
                >
                  {letter}
                </button>
              ))}

              {rowIndex === 2 && (
                <button
                  className="key wide"
                  onClick={() =>
                    handleKey('BACKSPACE')
                  }
                  disabled={finished || paradox}
                >
                  ⌫
                </button>
              )}

            </div>
          )
        )}
      </div>

      {/* CONTROLS */}

      <div className="controls">

        <button onClick={newGame}>
          New Game
        </button>

        <button
          onClick={() =>
            setShowAnswers(v => !v)
          }
        >
          {showAnswers
            ? 'Hide Answers'
            : 'Show Answers'}
        </button>

      </div>

      {showAnswers && (
        <p className="revealed">
          {secrets.join(', ').toUpperCase()}
        </p>
      )}

    </main>
  );
}

export default App;
