export default function LanguageLearnerView({
  LANGUAGE_INFO,
  MISSION_LENGTH,
  accuracy,
  activeWords,
  answerPlacement,
  answerQuestion,
  beginCourse,
  beginLanguage,
  buildPlacement,
  course,
  currentQuestion,
  currentUnit,
  inputRef,
  language,
  loadProgress,
  message,
  misses,
  missionAnswered,
  missionCorrect,
  missionNewWords,
  missionNumber,
  newWordChance,
  nextMission,
  placement,
  placementIndex,
  recentAccuracy,
  saveProgress,
  score,
  screen,
  setScreen,
  setTyped,
  speak,
  statusFor,
  typed,
  unlockedCount,
  weakestMastery
}) {
if (
  screen === "language"
) {
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
          ([
            key,
            info
          ]) => (
            <button
              key={key}
              className="menuButton languageButton"
              onClick={() =>
                beginLanguage(
                  key
                )
              }
            >
              <span className="languageFlag">
                {info.flag}
              </span>

              {info.name}
            </button>
          )
        )}

      </div>
    </div>
  );
}

if (
  screen === "start"
) {
  const info =
    LANGUAGE_INFO[
      language
    ];

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
            buildPlacement
          }
        >
          Test my level
        </button>

        <button
          className="menuButton"
          onClick={
            loadProgress
          }
        >
          Continue saved game
        </button>

        <button
          className="menuButton secondary"
          onClick={() =>
            setScreen(
              "language"
            )
          }
        >
          Choose another language
        </button>

        <div className="courseSize">
          {course.length} course items
        </div>

      </div>
    </div>
  );
}

if (
  screen ===
  "placement"
) {
  const question =
    placement[
      placementIndex
    ];

  return (
    <div className="screen">
      <div className="menuBox">

        <h2>
          Placement Test
        </h2>

        <p>
          Translate into{" "}
          {
            LANGUAGE_INFO[
              language
            ].name
          }.
        </p>

        <p>
          Pronunciation is disabled during placement.
        </p>

        <div className="placementCounter">
          {placementIndex + 1}
          {" / "}
          {placement.length}
        </div>

        <div className="placementPrompt">
          {
            question?.word
              .english
          }
        </div>

        <input
          autoFocus
          value={typed}
          onChange={event =>
            setTyped(
              event.target
                .value
            )
          }
          onKeyDown={event => {
            if (
              event.key ===
              "Enter"
            ) {
              answerPlacement(
                typed
              );

              setTyped("");
            }
          }}
        />

        <div>
          <button
            onClick={() => {
              answerPlacement(
                typed
              );

              setTyped("");
            }}
          >
            Submit
          </button>

          <button
            onClick={() => {
              answerPlacement(
                "__SKIP__"
              );

              setTyped("");
            }}
          >
            Skip
          </button>
        </div>

      </div>
    </div>
  );
}

if (
  screen ===
  "missionComplete"
) {
  const stars =
    (missionNewWords.length >=
    4
      ? 1
      : 0) +
    (accuracy >= 0.75
      ? 1
      : 0) +
    (misses <= 5
      ? 1
      : 0);

  return (
    <div className="screen missionComplete">
      <div className="resultCard">

        <div className="confettiText">
          🎉
        </div>

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
            accuracy * 100
          )}
          % accuracy
        </p>

        <p>
          {
            missionNewWords.length
          }{" "}
          new words encountered
        </p>

        <p className="saved">
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
          onClick={() =>
            setScreen("start")
          }
        >
          Main Menu
        </button>

      </div>
    </div>
  );
}

const info =
  LANGUAGE_INFO[
    language
  ];

const learned =
  activeWords.filter(
    word =>
      weakestMastery(
        word
      ) >= 4
  ).length;

return (
  <div className="app">

    <h1>
      {info.flag}{" "}
      {info.name} Defender
    </h1>

    <div className="stats">
      Score: {score}
      {" | "}
      Missed: {misses}
      {" | "}
      Learned: {learned}
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
            accuracy >= 0.75
              ? "✓"
              : "○"
          }{" "}
          75% accuracy
        </span>

        <span>
          New-word chance:{" "}
          {Math.round(
            newWordChance *
              100
          )}
          %
        </span>
      </div>

    </div>

    <div className="game">

      {currentQuestion && (
        <div
          className={
            "questionCard " +
            statusFor(
              currentQuestion
                .word
            )
          }
        >

          <div className="mode">
            {
              currentQuestion.mode
            }
          </div>

          <div className="prompt">
            {
              currentQuestion.prompt
            }
          </div>

          {currentQuestion.mode ===
            "listening" && (
            <button
              className="speaker"
              onClick={() =>
                speak(
                  currentQuestion
                    .word
                    .target
                )
              }
            >
              🔊 Play again
            </button>
          )}

          {currentQuestion.mode !==
            "listening" && (
            <button
              className="speaker"
              onClick={() =>
                speak(
                  currentQuestion
                    .word
                    .target
                )
              }
            >
              🔊
            </button>
          )}

          {currentQuestion.mode ===
          "recognition" ? (
            <div className="choices">

              {currentQuestion
                .choices
                .map(choice => (
                  <button
                    key={choice}
                    onClick={() =>
                      answerQuestion(
                        choice
                      )
                    }
                  >
                    {choice}
                  </button>
                ))}

            </div>
          ) : (
            <>

              <input
                ref={inputRef}
                value={typed}
                autoComplete="off"
                placeholder={
                  currentQuestion.mode ===
                  "typing"
                    ? `Type the ${info.name} answer`
                    : "Type the English meaning"
                }
                onChange={event =>
                  setTyped(
                    event.target
                      .value
                  )
                }
                onKeyDown={event => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    answerQuestion(
                      typed
                    );

                    setTyped("");
                  }
                }}
              />

              {info.special.length >
                0 && (
                <div className="keyboard">

                  {info.special.map(
                    character => (
                      <button
                        key={
                          character
                        }
                        onClick={() => {
                          setTyped(
                            old =>
                              old +
                              character
                          );

                          inputRef.current?.focus();
                        }}
                      >
                        {character}
                      </button>
                    )
                  )}

                </div>
              )}

            </>
          )}

        </div>
      )}

    </div>

    <div className="message">
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
        onClick={() =>
          setScreen("start")
        }
      >
        Menu
      </button>

    </div>

  </div>
);
}
