
import { useState, useEffect, useCallback } from "react";
import { ANSWERS, GUESSES } from "./words.js";
import "./App.css";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const normalizeWords = (words) =>
  [...new Set(words.map(w => w.toLowerCase()))]
    .filter(w => /^[a-z]{5}$/.test(w));

const ALL_ANSWERS = normalizeWords(ANSWERS);
const VALID_GUESSES = new Set([
  ...normalizeWords(GUESSES),
  ...ALL_ANSWERS
]);

const COLORS = {
  green: "#538d4e",
  yellow: "#b59f3b",
  gray: "#787c7e",
  empty: "#3a3a3c"
};

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSample(array, count) {
  const result = [...array];

  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (result.length - i));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, count);
}

// Standard Wordle feedback, including repeated letters.
function getFeedback(guess, answer) {
  const feedback = Array(WORD_LENGTH).fill("gray");
  const remaining = {};

  // Green letters first.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = "green";
    } else {
      remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
  }

  // Yellow letters second.
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (feedback[i] === "green") continue;

    const letter = guess[i];

    if ((remaining[letter] || 0) > 0) {
      feedback[i] = "yellow";
      remaining[letter]--;
    }
  }

  return feedback;
}

// Determine the logical information in one observation.
//
// Green: letter exists at this position.
// Yellow: letter exists, but not at this position.
// Gray: letter is not at this position. With duplicate
// letters, gray may only indicate a limited letter count.
function analyzeObservation(guess, feedback) {
  const required = {};
  const maximum = {};
  const positions = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guess[i];
    const color = feedback[i];

    if (!positions[letter]) {
      positions[letter] = {
        green: new Set(),
        excluded: new Set()
      };
    }

    if (color === "green") {
      positions[letter].green.add(i);
    } else {
      positions[letter].excluded.add(i);
    }

    if (color !== "gray") {
      required[letter] = (required[letter] || 0) + 1;
    }
  }

  const letters = new Set(guess);

  for (const letter of letters) {
    const total = [...guess].filter(c => c === letter).length;
    const positive = required[letter] || 0;

    // If a letter is gray at least once, the number of
    // occurrences in the answer is exactly the number
    // of green/yellow occurrences in the guess.
    if (positive < total) {
      maximum[letter] = positive;
    }
  }

  return { required, maximum, positions };
}

// Check whether two observations are logically compatible.
//
// Enumerating candidate words is useful here because the
// alphabet and word length are small, but using the whole
// dictionary would incorrectly treat unusual valid combinations
// as impossible. Instead, this uses letter and position
// constraints, then verifies whether a five-character assignment
// exists that satisfies both observations.
function observationsConflict(a, b) {
  const A = analyzeObservation(a.guess, a.feedback);
  const B = analyzeObservation(b.guess, b.feedback);

  const letters = new Set([
    ...Object.keys(A.required),
    ...Object.keys(B.required),
    ...Object.keys(A.maximum),
    ...Object.keys(B.maximum),
    ...Object.keys(A.positions),
    ...Object.keys(B.positions)
  ]);

  // Contradictory letter counts.
  for (const letter of letters) {
    const min = Math.max(
      A.required[letter] || 0,
      B.required[letter] || 0
    );

    const max = Math.min(
      A.maximum[letter] ?? 5,
      B.maximum[letter] ?? 5
    );

    if (min > max) return true;
  }

  // Explicit position contradictions.
  for (const letter of letters) {
    const ap = A.positions[letter];
    const bp = B.positions[letter];

    if (!ap || !bp) continue;

    for (const p of ap.green) {
      if (bp.excluded.has(p)) return true;
    }

    for (const p of bp.green) {
      if (ap.excluded.has(p)) return true;
    }
  }

  // Two different green letters in one position.
  for (let i = 0; i < WORD_LENGTH; i++) {
    const ag = a.feedback[i] === "green" ? a.guess[i] : null;
    const bg = b.feedback[i] === "green" ? b.guess[i] : null;

    if (ag && bg && ag !== bg) return true;
  }

  // For all other cases, search for a possible abstract answer.
  // Letters not mentioned in either guess are represented by "*".
  const alphabet = [...letters, "*"];
  const chosen = Array(WORD_LENGTH).fill(null);

  function search(position) {
    if (position === WORD_LENGTH) {
      const counts = {};

      for (const letter of chosen) {
        counts[letter] = (counts[letter] || 0) + 1;
      }

      for (const letter of letters) {
        const count = counts[letter] || 0;

        if (count < (A.required[letter] || 0)) return false;
        if (count < (B.required[letter] || 0)) return false;
        if (count > (A.maximum[letter] ?? 5)) return false;
        if (count > (B.maximum[letter] ?? 5)) return false;
      }

      // Check complete Wordle patterns using an arbitrary
      // letter for all unmentioned positions.
      const answer = chosen
        .map(c => c === "*" ? "#" : c)
        .join("");

      return (
        getFeedback(a.guess, answer).every(
          (c, i) => c === a.feedback[i]
        ) &&
        getFeedback(b.guess, answer).every(
          (c, i) => c === b.feedback[i]
        )
      );
    }

    for (const letter of alphabet) {
      let allowed = true;

      for (const obs of [a, b]) {
        if (
          obs.feedback[position] === "green" &&
          obs.guess[position] !== letter
        ) {
          allowed = false;
          break;
        }

        if (
          obs.feedback[position] !== "green" &&
          obs.guess[position] === letter
        ) {
          allowed = false;
          break;
        }
      }

      if (!allowed) continue;

      chosen[position] = letter;

      if (search(position + 1)) return true;
    }

    return false;
  }

  return !search(0);
}

function createGame(count) {
  return {
    solutions: randomSample(ALL_ANSWERS, count),
    observations: [],
    guesses: [],
    status: "playing",
    paradoxes: 0,
    eliminated: []
  };
}

function Tile({ letter = "", color = null, invalid = false }) {
  return (
    <div
      className="qw-tile"
      style={{
        width: 54,
        height: 54,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: letter ? "2px solid #565758" : "2px solid #3a3a3c",
        background: color ? COLORS[color] : "transparent",
        color: "white",
        fontSize: 28,
        fontWeight: 700,
        textTransform: "uppercase",
        opacity: invalid ? 0.36 : 1,
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {letter}
      {invalid && (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 3,
            background: "#ff6161",
            transform: "rotate(-16deg)"
          }}
        />
      )}
    </div>
  );
}

function GuessRow({ guess, feedback, invalid }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 5
      }}
    >
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Tile
          key={i}
          letter={guess?.[i] || ""}
          color={feedback?.[i] || null}
          invalid={invalid}
        />
      ))}
    </div>
  );
}

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function App() {
  const [wordCount, setWordCount] = useState(
    Math.min(100, ALL_ANSWERS.length)
  );
  const [game, setGame] = useState(() =>
    createGame(Math.min(100, ALL_ANSWERS.length))
  );
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const newGame = useCallback(() => {
    const count = Math.max(
      1,
      Math.min(ALL_ANSWERS.length, Number(wordCount) || 1)
    );

    setWordCount(count);
    setGame(createGame(count));
    setInput("");
    setMessage("");
  }, [wordCount]);

  const submitGuess = useCallback(() => {
    if (game.status !== "playing") return;

    const guess = input.toLowerCase();

    if (guess.length !== WORD_LENGTH) {
      setMessage("Not enough letters.");
      return;
    }

    if (!VALID_GUESSES.has(guess)) {
      setMessage("Not in word list.");
      return;
    }

    if (game.guesses.some(row => row.guess === guess)) {
      setMessage("You already guessed that word.");
      return;
    }

    if (game.solutions.length === 0) {
      setMessage("No possible answers remain.");
      return;
    }

    // A guess that exactly names a remaining answer can win.
    // Otherwise, feedback is sampled from a random answer.
    const exactMatch = game.solutions.includes(guess);
    const chosen = exactMatch
      ? guess
      : randomItem(game.solutions);

    const feedback = getFeedback(guess, chosen);
    const isWin = feedback.every(color => color === "green");

    const newObservation = {
      id: game.guesses.length,
      guess,
      feedback,
      source: chosen,
      invalid: false
    };

    let observations = game.observations.map(o => ({ ...o }));
    let solutions = [...game.solutions];
    let eliminated = [...game.eliminated];
    let paradoxCount = game.paradoxes;
    let paradoxMessage = "";

    // Only a visible contradiction creates a paradox.
    // Earlier observations are checked in chronological order.
    if (!isWin) {
      const conflicting = observations.filter(
        old =>
          !old.invalid &&
          observationsConflict(old, newObservation)
      );

      if (conflicting.length > 0) {
        const removedWords = new Set();

        for (const old of conflicting) {
          old.invalid = true;
          removedWords.add(old.source);
        }

        // Eliminate the words responsible for the
        // contradicted observations.
        solutions = solutions.filter(
          word => !removedWords.has(word)
        );

        eliminated.push(...removedWords);
        paradoxCount += 1;

        paradoxMessage =
          `Quantum paradox! ${conflicting.length} earlier ` +
          `observation(s) invalidated. ` +
          `${removedWords.size} answer(s) eliminated.`;
      }

      // Prevent guessing the same answer again, while
      // preserving the word sampled for the current feedback.
      if (guess !== chosen) {
        solutions = solutions.filter(word => word !== guess);
      }
    }

    observations.push(newObservation);

    const guesses = [...game.guesses, newObservation];

    let status = "playing";

    if (isWin) {
      status = "won";
    } else if (guesses.length >= MAX_GUESSES) {
      status = "lost";
    } else if (solutions.length === 0) {
      status = "lost";
    }

    setGame({
      solutions,
      observations,
      guesses,
      status,
      paradoxes: paradoxCount,
      eliminated
    });

    setInput("");

    if (isWin) {
      setMessage("You solved Quantum Wordle!");
    } else if (status === "lost") {
      setMessage(
        "Game over! " + (paradoxMessage || "No guesses remain.")
      );
    } else if (paradoxMessage) {
      setMessage(paradoxMessage);
    } else {
      setMessage("");
    }
  }, [game, input]);

  const handleKey = useCallback(
    key => {
      if (game.status !== "playing") return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setInput(s => s.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        setInput(s =>
          s.length < WORD_LENGTH ? s + key.toLowerCase() : s
        );
      }
    },
    [game.status, submitGuess]
  );

  useEffect(() => {
    function onKeyDown(event) {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      ) {
        return;
      }

      if (event.key === "Enter") {
        handleKey("ENTER");
      } else if (event.key === "Backspace") {
        handleKey("BACKSPACE");
      } else if (/^[a-z]$/i.test(event.key)) {
        handleKey(event.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  // Keyboard colors based on non-invalidated observations.
  const keyboardColors = {};

  const rank = { gray: 1, yellow: 2, green: 3 };

  for (const row of game.guesses) {
    if (row.invalid) continue;

    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = row.guess[i].toUpperCase();
      const color = row.feedback[i];

      if (
        !keyboardColors[letter] ||
        rank[color] > rank[keyboardColors[letter]]
      ) {
        keyboardColors[letter] = color;
      }
    }
  }

  const rows = [...game.guesses];

  if (game.status === "playing" && rows.length < MAX_GUESSES) {
    rows.push({ guess: input, feedback: null, invalid: false });
  }

  const remainingRows = MAX_GUESSES - rows.length;

  return (
    <div
      className="quantum-wordle"
      style={{
        minHeight: "100vh",
        background: "#121213",
        color: "#ffffff",
        padding: "24px 12px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      <h1 style={{ margin: "0 0 8px" }}>
        Quantum Wordle
      </h1>

      <p style={{ color: "#aaa", marginBottom: 22 }}>
        The answer is uncertain. The clues may contradict.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18
        }}
      >
        <label htmlFor="qw-word-count">
          Starting possible words:
        </label>

        <input
          id="qw-word-count"
          type="number"
          min="1"
          max={ALL_ANSWERS.length}
          value={wordCount}
          onChange={e => setWordCount(e.target.value)}
          style={{
            width: 85,
            padding: 7,
            background: "#242426",
            color: "white",
            border: "1px solid #555",
            borderRadius: 5
          }}
        />

        <button
          onClick={newGame}
          style={{
            padding: "9px 16px",
            background: "#538d4e",
            color: "white",
            border: 0,
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          New Game
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >
        <div>
          <strong>{game.solutions.length}</strong>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            Possible words
          </div>
        </div>

        <div>
          <strong>{game.paradoxes}</strong>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            Paradoxes
          </div>
        </div>

        <div>
          <strong>{game.guesses.length}/{MAX_GUESSES}</strong>
          <div style={{ fontSize: 12, color: "#aaa" }}>
            Guesses
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          margin: "0 auto 22px",
          width: "fit-content"
        }}
      >
        {rows.map((row, i) => (
          <GuessRow
            key={i}
            guess={row.guess}
            feedback={row.feedback}
            invalid={row.invalid}
          />
        ))}

        {Array.from({ length: remainingRows }, (_, i) => (
          <GuessRow key={`empty-${i}`} />
        ))}
      </div>

      <div
        style={{
          minHeight: 42,
          color:
            game.status === "won"
              ? "#7bc67b"
              : message.includes("paradox")
              ? "#ffcc66"
              : "#ddd",
          fontWeight: "bold",
          maxWidth: 520,
          margin: "0 auto"
        }}
      >
        {message}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          maxWidth: 520,
          margin: "0 auto"
        }}
      >
        {KEY_ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 4,
              justifyContent: "center",
              width: "100%"
            }}
          >
            {i === 2 && (
              <button
                onClick={() => handleKey("ENTER")}
                style={specialKeyStyle}
              >
                ENTER
              </button>
            )}

            {[...row].map(letter => (
              <button
                key={letter}
                onClick={() => handleKey(letter)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 44,
                  height: 52,
                  border: 0,
                  borderRadius: 4,
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "white",
                  background: keyboardColors[letter]
                    ? COLORS[keyboardColors[letter]]
                    : "#818384"
                }}
              >
                {letter}
              </button>
            ))}

            {i === 2 && (
              <button
                onClick={() => handleKey("BACKSPACE")}
                style={specialKeyStyle}
              >
                ⌫
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 540,
          margin: "28px auto",
          padding: 15,
          border: "1px solid #444",
          borderRadius: 8,
          textAlign: "left",
          color: "#bbb",
          lineHeight: 1.55,
          fontSize: 14
        }}
      >
        <strong style={{ color: "white" }}>
          How Quantum Wordle works
        </strong>

        <p>
          Each guess receives feedback from a randomly selected
          possible answer. Unlike ordinary Wordle, the answer
          supplying the next clue can change.
        </p>

        <p>
          When new feedback visibly contradicts an earlier clue,
          a quantum paradox occurs. The earlier clue is crossed
          out, and the answer that produced it is eliminated.
        </p>

        <p style={{ marginBottom: 0 }}>
          Green means correct position. Yellow means present
          elsewhere. Gray means no additional occurrence of
          that letter is present.
        </p>
      </div>
    </div>
  );
}

const specialKeyStyle = {
  padding: "0 8px",
  minWidth: 48,
  height: 52,
  background: "#565758",
  color: "white",
  border: 0,
  borderRadius: 4,
  fontSize: 12,
  fontWeight: "bold",
  cursor: "pointer"
};
