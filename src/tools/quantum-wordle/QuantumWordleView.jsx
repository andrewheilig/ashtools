const COLORS = {
  green: "#538d4e",
  yellow: "#b59f3b",
  gray: "#787c7e"
};

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const WORD_LENGTH = 5;

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
    <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <Tile
          key={index}
          letter={guess?.[index] || ""}
          color={feedback?.[index] || null}
          invalid={invalid}
        />
      ))}
    </div>
  );
}

function GameSettings({ answerCount, onNewGame, onWordCountChange, wordCount }) {
  return (
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
      <label htmlFor="qw-word-count">Starting possible words:</label>
      <input
        id="qw-word-count"
        type="number"
        min="1"
        max={answerCount}
        value={wordCount}
        onChange={event => onWordCountChange(event.target.value)}
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
        onClick={onNewGame}
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
  );
}

function GameStats({ game, maxGuesses }) {
  const stats = [
    [game.solutions.length, "Possible words"],
    [game.paradoxes, "Paradoxes"],
    [`${game.guesses.length}/${maxGuesses}`, "Guesses"]
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        marginBottom: 20,
        flexWrap: "wrap"
      }}
    >
      {stats.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <div style={{ fontSize: 12, color: "#aaa" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function GameBoard({ maxGuesses, rows }) {
  const remainingRows = maxGuesses - rows.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        margin: "0 auto 22px",
        width: "fit-content"
      }}
    >
      {rows.map((row, index) => (
        <GuessRow
          key={index}
          guess={row.guess}
          feedback={row.feedback}
          invalid={row.invalid}
        />
      ))}
      {Array.from({ length: remainingRows }, (_, index) => (
        <GuessRow key={`empty-${index}`} />
      ))}
    </div>
  );
}

function Message({ gameStatus, message }) {
  const color = gameStatus === "won"
    ? "#7bc67b"
    : message.includes("paradox")
      ? "#ffcc66"
      : "#ddd";

  return (
    <div
      style={{
        minHeight: 42,
        color,
        fontWeight: "bold",
        maxWidth: 520,
        margin: "0 auto"
      }}
    >
      {message}
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

function Keyboard({ keyboardColors, onKey }) {
  return (
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
      {KEY_ROWS.map((row, rowIndex) => (
        <div
          key={row}
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            width: "100%"
          }}
        >
          {rowIndex === 2 && (
            <button onClick={() => onKey("ENTER")} style={specialKeyStyle}>
              ENTER
            </button>
          )}
          {[...row].map(letter => (
            <button
              key={letter}
              onClick={() => onKey(letter)}
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
          {rowIndex === 2 && (
            <button onClick={() => onKey("BACKSPACE")} style={specialKeyStyle}>
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function Instructions() {
  return (
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
      <strong style={{ color: "white" }}>How Quantum Wordle works</strong>
      <p>
        Each guess receives feedback from a randomly selected possible answer.
        Unlike ordinary Wordle, the answer supplying the next clue can change.
      </p>
      <p>
        When new feedback visibly contradicts an earlier clue, a quantum
        paradox occurs. The earlier clue is crossed out, and the answer that
        produced it is eliminated.
      </p>
      <p style={{ marginBottom: 0 }}>
        Green means correct position. Yellow means present elsewhere. Gray
        means no additional occurrence of that letter is present.
      </p>
    </div>
  );
}

export default function QuantumWordleView({
  answerCount,
  game,
  keyboardColors,
  maxGuesses,
  message,
  onKey,
  onNewGame,
  onWordCountChange,
  rows,
  wordCount
}) {
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
      <h1 style={{ margin: "0 0 8px" }}>Quantum Wordle</h1>
      <p style={{ color: "#aaa", marginBottom: 22 }}>
        The answer is uncertain. The clues may contradict.
      </p>
      <GameSettings
        answerCount={answerCount}
        onNewGame={onNewGame}
        onWordCountChange={onWordCountChange}
        wordCount={wordCount}
      />
      <GameStats game={game} maxGuesses={maxGuesses} />
      <GameBoard maxGuesses={maxGuesses} rows={rows} />
      <Message gameStatus={game.status} message={message} />
      <Keyboard keyboardColors={keyboardColors} onKey={onKey} />
      <Instructions />
    </div>
  );
}
