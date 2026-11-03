export default function LanguageLearnerView({
  LANGUAGE_INFO,
  MISSION_LENGTH,
  answerRecognition,
  beginCourse,
  beginLanguage,
  confetti,
  course,
  currentUnit,
  enemies,
  gameRef,
  handleEnter,
  handleTyping,
  inputRef,
  language,
  loadProgress,
  message,
  misses,
  missionAccuracy,
  missionAnswered,
  missionCorrect,
  missionNewWords,
  missionNumber,
  newWordChance,
  nextMission,
  recentAccuracy,
  saveProgress,
  score,
  screen,
  setEnemies,
  setRunning,
  setScreen,
  setTyped,
  speak,
  stopConfetti,
  typed,
  unlockedCount,
  wordStatus
}) {
// ==========================================================
// LANGUAGE SELECT
// ==========================================================

if (screen === "language") {
  return (
    <div className="screen">
      <div className="menuBox">

        <h1>
          Language Defender
        </h1>

        <h2>
          What do you want to learn?
        </h2>

        {Object.entries(
          LANGUAGE_INFO
        ).map(
          ([key, info]) => (
            <button
              key={key}
              className="menuButton"
              onClick={() =>
                beginLanguage(
                  key
                )
              }
            >
              {info.flag}{" "}
              {info.name}
            </button>
          )
        )}

      </div>
    </div>
  );
}


// ==========================================================
// START SCREEN
// ==========================================================

if (screen === "start") {
  const info =
    LANGUAGE_INFO[language];

  return (
    <div className="screen">
      <div className="menuBox">

        <h1>
          {info.flag}{" "}
          {info.name} Defender
        </h1>

        <h2>
          How much {info.name} do you know?
        </h2>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(12)
          }
        >
          Completely new
        </button>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(35)
          }
        >
          I know a few words
        </button>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(70)
          }
        >
          I know some common words
        </button>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(140)
          }
        >
          I know basic {info.name}
        </button>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(260)
          }
        >
          I know quite a lot
        </button>

        <button
          className="menuButton"
          onClick={() =>
            beginCourse(
              course.length
            )
          }
        >
          Unlock everything
        </button>

        <button
          className="menuButton"
          onClick={
            loadProgress
          }
        >
          Continue Saved Game
        </button>

        <button
          className="menuButton"
          onClick={() =>
            setScreen(
              "language"
            )
          }
        >
          Change Language
        </button>

        <p>
          {course.length} course items
        </p>

      </div>
    </div>
  );
}


// ==========================================================
// MISSION COMPLETE
// ==========================================================

if (
  screen ===
  "missionComplete"
) {
  const stars =
    (missionNewWords.length >=
    4
      ? 1
      : 0) +
    (missionAccuracy >=
    0.75
      ? 1
      : 0) +
    (misses <= 5
      ? 1
      : 0);

  return (
    <div className="missionOverlay">

      <div className="confettiLayer">
        {confetti.map(
          piece => (
            <div
              key={piece.id}
              className="confettiPiece"
              style={{
                left:
                  `${piece.left}%`,
                width:
                  piece.size,
                height:
                  piece.size,
                animationDelay:
                  `${piece.delay}s`,
                animationDuration:
                  `${piece.duration}s`,
                "--rotation":
                  `${piece.rotate}deg`
              }}
            />
          )
        )}
      </div>

      <div className="resultCard">

        <h1>
          Mission Complete!
        </h1>

        <div className="stars">
          {"★".repeat(stars)}
          {"☆".repeat(
            3 - stars
          )}
        </div>

        <p>
          {missionCorrect}
          {" / "}
          {missionAnswered}
          {" correct"}
        </p>

        <p>
          {Math.round(
            missionAccuracy *
              100
          )}
          % accuracy
        </p>

        <p>
          {
            missionNewWords.length
          }{" "}
          new words
        </p>

        <p>
          ✓ Progress saved
        </p>

        <button
          onClick={
            nextMission
          }
        >
          Next Mission
        </button>

        <button
          onClick={() => {
            stopConfetti();
            setScreen("start");
          }}
        >
          Menu
        </button>

      </div>
    </div>
  );
}


// ==========================================================
// DEFENDER GAME
// ==========================================================

const info =
  LANGUAGE_INFO[language];

return (
  <div className="app">

    <h1>
      {info.flag}{" "}
      {info.name} Defender
    </h1>

    <div id="stats">
      Score: {score}
      {" | "}
      Missed: {misses}
      {" | "}
      Unit: {currentUnit}
    </div>


    <div className="missionHud">

      <div className="missionTop">

        <strong>
          Mission{" "}
          {missionNumber}
        </strong>

        <span>
          {missionAnswered}
          {" / "}
          {MISSION_LENGTH}
        </span>

      </div>


      <div className="missionBar">
        <div
          className="missionFill"
          style={{
            width:
              `${
                missionAnswered /
                MISSION_LENGTH *
                100
              }%`
          }}
        />
      </div>


      <div className="missionGoals">

        <span>
          {
            missionNewWords.length >=
            4
              ? "✓"
              : "○"
          }{" "}
          Learn 4 new words
        </span>

        <span>
          {
            missionAccuracy >=
            0.75
              ? "✓"
              : "○"
          }{" "}
          75% accuracy
        </span>

        <span>
          New chance:{" "}
          {Math.round(
            newWordChance *
              100
          )}
          %
        </span>

      </div>

    </div>


    <div
      id="game"
      ref={gameRef}
      onClick={() =>
        inputRef.current?.focus()
      }
    >

      {enemies.map(enemy => {
        const word =
          course.find(
            item =>
              item.id ===
              enemy.wordId
          );

        if (!word) {
          return null;
        }

        return (
          <div
            key={enemy.id}
            className={
              "enemy " +
              wordStatus(word)
            }
            style={{
              left:
                enemy.x,
              top:
                enemy.y,
              width:
                enemy.width
            }}
          >

            <div className="enemyPrompt">
              {
                enemy.question.prompt
              }
            </div>

            <div className="modeBadge">
              {
                enemy.question.mode ===
                "typing"
                  ? "TYPE"
                  : enemy.question.mode ===
                    "recognition"
                  ? "RECOGNIZE"
                  : "LISTEN"
              }
            </div>


            {enemy.question.mode ===
              "listening" && (
              <button
                className="speaker"
                onClick={event => {
                  event.stopPropagation();

                  speak(
                    enemy.question
                      .audio
                  );
                }}
              >
                🔊
              </button>
            )}


            {enemy.question.mode ===
              "recognition" && (
              <div className="recognitionChoices">

                {enemy.question
                  .choices
                  .map(choice => (
                    <button
                      key={choice}
                      onClick={event => {
                        event.stopPropagation();

                        answerRecognition(
                          enemy,
                          choice
                        );
                      }}
                    >
                      {choice}
                    </button>
                  ))}

              </div>
            )}

          </div>
        );
      })}

    </div>


    <input
      ref={inputRef}
      id="answer"
      value={typed}
      autoComplete="off"
      placeholder={
        `Type the ${info.name} answer`
      }
      onChange={event => {
        const value =
          event.target.value;

        setTyped(value);
        handleTyping(value);
      }}
      onKeyDown={event => {
        if (
          event.key ===
          "Enter"
        ) {
          handleEnter();
        }
      }}
    />


    {info.special.length >
      0 && (
      <div id="keyboard">

        {info.special.map(
          character => (
            <button
              key={
                character
              }
              onClick={() => {
                const value =
                  typed +
                  character;

                setTyped(value);
                handleTyping(value);

                inputRef.current?.focus();
              }}
            >
              {character}
            </button>
          )
        )}

      </div>
    )}


    <div id="message">
      {message}
    </div>


    <div className="adaptiveStats">
      Recent accuracy:{" "}
      {Math.round(
        recentAccuracy *
          100
      )}
      %
      {" | "}
      New word chance:{" "}
      {Math.round(
        newWordChance *
          100
      )}
      %
      {" | "}
      Unlocked:{" "}
      {unlockedCount}
      {" / "}
      {course.length}
    </div>


    <div className="bottomButtons">

      <button
        onClick={
          saveProgress
        }
      >
        Save Progress
      </button>

      <button
        onClick={() => {
          setRunning(false);
          setEnemies([]);
          setScreen("start");
        }}
      >
        Menu
      </button>

    </div>

  </div>
);
}
