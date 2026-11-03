import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_SPEED,
  GAP,
  LANGUAGE_INFO,
  MAX_ENEMIES,
  MAX_MISSES,
  MISSION_LENGTH,
  REVIEW_DELAYS,
  SPAWN_DELAY,
  makeCourse,
  normalize,
  randomFrom,
  saveKey,
  weakestMastery,
  wordStatus
} from "./languageModel.js";

export default function useLanguageLearner() {
  const [language, setLanguage] =
    useState(null);

  const [screen, setScreen] =
    useState("language");

  const [course, setCourse] =
    useState([]);

  const [unlockedCount, setUnlockedCount] =
    useState(12);

  const [enemies, setEnemies] =
    useState([]);

  const enemiesRef =
    useRef([]);

  const [typed, setTyped] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [misses, setMisses] =
    useState(0);

  const [missionNumber, setMissionNumber] =
    useState(1);

  const [missionAnswered, setMissionAnswered] =
    useState(0);

  const [missionCorrect, setMissionCorrect] =
    useState(0);

  const [missionNewWords, setMissionNewWords] =
    useState([]);

  const [recentResults, setRecentResults] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [confetti, setConfetti] =
    useState([]);

  const gameRef =
    useRef(null);

  const inputRef =
    useRef(null);

  const animationRef =
    useRef(null);

  const lastTimeRef =
    useRef(performance.now());

  const lastSpawnRef =
    useRef(0);

  const enemyIdRef =
    useRef(1);


  useEffect(() => {
    enemiesRef.current =
      enemies;
  }, [enemies]);


  const activeWords =
    useMemo(() => {
      return course.slice(
        0,
        unlockedCount
      );
    }, [
      course,
      unlockedCount
    ]);


  const currentUnit =
    useMemo(() => {
      return activeWords.reduce(
        (max, word) =>
          Math.max(
            max,
            word.unit
          ),
        1
      );
    }, [activeWords]);


  const recentAccuracy =
    useMemo(() => {
      if (!recentResults.length) {
        return 1;
      }

      return (
        recentResults.filter(
          result =>
            result.correct
        ).length /
        recentResults.length
      );
    }, [recentResults]);


  const newWordChance =
    useMemo(() => {
      if (recentAccuracy > 0.9) {
        return 0.65;
      }

      if (recentAccuracy > 0.75) {
        return 0.45;
      }

      if (recentAccuracy > 0.55) {
        return 0.25;
      }

      return 0.1;
    }, [recentAccuracy]);


  const missionAccuracy =
    missionAnswered
      ? missionCorrect /
        missionAnswered
      : 1;


  function updateWord(id, fn) {
    setCourse(old =>
      old.map(word =>
        word.id === id
          ? fn(word)
          : word
      )
    );
  }


  function speak(text) {
    if (
      !language ||
      !window.speechSynthesis
    ) {
      return;
    }

    const info =
      LANGUAGE_INFO[language];

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      info.speech;

    utterance.rate =
      language === "japanese"
        ? 0.82
        : 0.86;

    const voices =
      speechSynthesis.getVoices();

    const prefix =
      info.speech
        .slice(0, 2)
        .toLowerCase();

    const preferred =
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(prefix) &&
          !voice.localService
      ) ||
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(prefix)
      );

    if (preferred) {
      utterance.voice =
        preferred;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(
      utterance
    );
  }


  function chooseMode(word) {
    if (word.seen < 2) {
      return "typing";
    }

    const options = [
      {
        mode: "typing",
        mastery:
          word.typingMastery
      },
      {
        mode: "recognition",
        mastery:
          word.recognitionMastery
      },
      {
        mode: "listening",
        mastery:
          word.listeningMastery
      }
    ];

    options.sort(
      (a, b) =>
        a.mastery -
        b.mastery
    );

    if (Math.random() < 0.65) {
      return options[0].mode;
    }

    return randomFrom(
      options
    ).mode;
  }


  function chooseWord() {
    const active =
      course.slice(
        0,
        unlockedCount
      );

    if (!active.length) {
      return null;
    }

    const nextNew =
      active.find(
        word =>
          word.seen === 0
      );

    if (
      nextNew &&
      Math.random() <
        newWordChance
    ) {
      return nextNew;
    }

    const now =
      Date.now();

    const due =
      active.filter(word => {
        if (word.seen === 0) {
          return false;
        }

        return (
          word.typingDue <= now ||
          word.recognitionDue <= now ||
          word.listeningDue <= now
        );
      });

    if (due.length) {
      const weak =
        [...due].sort(
          (a, b) =>
            weakestMastery(a) -
            weakestMastery(b)
        );

      return randomFrom(
        weak.slice(
          0,
          Math.min(
            8,
            weak.length
          )
        )
      );
    }

    const seen =
      active.filter(
        word =>
          word.seen > 0
      );

    return (
      randomFrom(seen) ||
      nextNew ||
      randomFrom(active)
    );
  }


  function recognitionChoices(word) {
    const choices = [
      word.english
    ];

    const others =
      activeWords.filter(
        other =>
          other.id !==
          word.id
      );

    while (
      choices.length < 4 &&
      others.length
    ) {
      const candidate =
        randomFrom(others);

      if (
        !choices.includes(
          candidate.english
        )
      ) {
        choices.push(
          candidate.english
        );
      }
    }

    return choices.sort(
      () =>
        Math.random() - 0.5
    );
  }


  function makeEnemyQuestion(word) {
    const mode =
      chooseMode(word);

    if (mode === "typing") {
      return {
        mode,
        prompt: word.english,
        answer: word.target
      };
    }

    if (mode === "recognition") {
      return {
        mode,
        prompt: word.target,
        answer: word.english,
        choices:
          recognitionChoices(word)
      };
    }

    return {
      mode,
      prompt: "🔊",
      answer: word.english,
      audio: word.target
    };
  }


  function rectanglesOverlap(
    a,
    b
  ) {
    return !(
      a.x + a.width + GAP <
        b.x ||
      b.x + b.width + GAP <
        a.x ||
      a.y + a.height + GAP <
        b.y ||
      b.y + b.height + GAP <
        a.y
    );
  }


  function chooseSpawnY(
    width,
    height
  ) {
    const game =
      gameRef.current;

    if (!game) {
      return 30;
    }

    const gameHeight =
      game.clientHeight;

    const maxY =
      Math.max(
        20,
        gameHeight -
          height -
          20
      );

    for (
      let attempt = 0;
      attempt < 80;
      attempt++
    ) {
      const y =
        20 +
        Math.random() *
          (maxY - 20);

      const candidate = {
        x:
          game.clientWidth +
          10,
        y,
        width,
        height
      };

      let blocked =
        false;

      for (
        const enemy of
        enemiesRef.current
      ) {
        const other = {
          x: enemy.x,
          y: enemy.y,
          width:
            enemy.width ??
            220,
          height:
            enemy.height ??
            90
        };

        if (
          rectanglesOverlap(
            candidate,
            other
          )
        ) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        return y;
      }
    }

    return null;
  }


  function spawnEnemy() {
    if (
      !running ||
      enemiesRef.current.length >=
        MAX_ENEMIES
    ) {
      return;
    }

    const game =
      gameRef.current;

    if (!game) {
      return;
    }

    const word =
      chooseWord();

    if (!word) {
      return;
    }

    const question =
      makeEnemyQuestion(word);

    const width =
      Math.min(
        380,
        Math.max(
          170,
          question.prompt.length *
            11 +
            60
        )
      );

    const height =
      question.mode ===
      "recognition"
        ? 155
        : 90;

    const y =
      chooseSpawnY(
        width,
        height
      );

    if (y === null) {
      return;
    }

    const wasNew =
      word.seen === 0;

    const enemy = {
      id:
        enemyIdRef.current++,

      wordId:
        word.id,

      question,

      x:
        game.clientWidth +
        10,

      y,

      width,
      height,

      speed:
        BASE_SPEED +
        weakestMastery(word) *
          2,

      spawnedAt:
        performance.now(),

      wasNew
    };

    setEnemies(old => [
      ...old,
      enemy
    ]);

    updateWord(
      word.id,
      current => ({
        ...current,
        seen:
          current.seen + 1,
        lastSeen:
          Date.now()
      })
    );

    if (
      wasNew &&
      question.mode ===
        "typing"
    ) {
      setTimeout(
        () =>
          speak(
            word.target
          ),
        120
      );
    }

    if (
      question.mode ===
      "listening"
    ) {
      setTimeout(
        () =>
          speak(
            question.audio
          ),
        150
      );
    }
  }


  function masteryResult(
    word,
    mode,
    correct,
    responseTime
  ) {
    const masteryKey =
      `${mode}Mastery`;

    const dueKey =
      `${mode}Due`;

    let mastery =
      word[masteryKey] ?? 0;

    if (correct) {
      if (
        word.seen <= 1 &&
        mode === "typing" &&
        responseTime < 1800
      ) {
        mastery =
          Math.max(
            4,
            mastery
          );
      }

      else {
        mastery =
          Math.min(
            6,
            mastery + 1
          );
      }
    }

    else {
      mastery =
        Math.max(
          0,
          mastery - 1
        );
    }

    const delay =
      correct
        ? REVIEW_DELAYS[
            Math.min(
              mastery,
              REVIEW_DELAYS.length -
                1
            )
          ]
        : 8000;

    return {
      ...word,

      [masteryKey]:
        mastery,

      [dueKey]:
        Date.now() +
        delay,

      correct:
        word.correct +
        (correct ? 1 : 0),

      wrong:
        word.wrong +
        (correct ? 0 : 1)
    };
  }


  function removeEnemy(id) {
    setEnemies(old =>
      old.filter(
        enemy =>
          enemy.id !== id
      )
    );
  }


  function recordRecent(correct) {
    setRecentResults(old => [
      ...old.slice(-19),
      {
        correct
      }
    ]);
  }


  function maybeUnlock() {
    const recent =
      course.slice(
        Math.max(
          0,
          unlockedCount - 14
        ),
        unlockedCount
      );

    if (!recent.length) {
      return;
    }

    const strong =
      recent.filter(
        word =>
          weakestMastery(
            word
          ) >= 3
      ).length;

    if (
      strong /
        recent.length >=
      0.65
    ) {
      setUnlockedCount(old =>
        Math.min(
          course.length,
          old + 8
        )
      );
    }
  }


  function defeatEnemy(
    enemy,
    _submittedAnswer
  ) {
    const word =
      course.find(
        item =>
          item.id ===
          enemy.wordId
      );

    if (!word) {
      return;
    }

    const responseTime =
      performance.now() -
      enemy.spawnedAt;

    updateWord(
      word.id,
      old =>
        masteryResult(
          old,
          enemy.question.mode,
          true,
          responseTime
        )
    );

    removeEnemy(enemy.id);

    setScore(old =>
      old + 1
    );

    setMissionCorrect(old =>
      old + 1
    );

    setMissionAnswered(old =>
      old + 1
    );

    recordRecent(true);

    if (
      enemy.wasNew &&
      !missionNewWords.includes(
        word.id
      )
    ) {
      setMissionNewWords(old => [
        ...old,
        word.id
      ]);
    }

    setMessage(
      `✓ ${word.english} = ${word.target}`
    );

    maybeUnlock();
  }


  function missEnemy(
    enemy,
    _typedAnswer = ""
  ) {
    const word =
      course.find(
        item =>
          item.id ===
          enemy.wordId
      );

    if (!word) {
      return;
    }

    const responseTime =
      performance.now() -
      enemy.spawnedAt;

    updateWord(
      word.id,
      old =>
        masteryResult(
          old,
          enemy.question.mode,
          false,
          responseTime
        )
    );

    removeEnemy(enemy.id);

    setMisses(old =>
      old + 1
    );

    setMissionAnswered(old =>
      old + 1
    );

    recordRecent(false);

    setMessage(
      `✗ ${word.english} = ${word.target}`
    );
  }


  function handleTyping(value) {
    const normalized =
      normalize(
        value,
        language
      );

    if (!normalized) {
      return;
    }

    const matching =
      enemiesRef.current
        .filter(enemy => {
          if (
            enemy.question.mode ===
            "recognition"
          ) {
            return false;
          }

          return (
            normalize(
              enemy.question
                .answer,
              language
            ) === normalized
          );
        })
        .sort(
          (a, b) =>
            a.x - b.x
        );

    if (matching.length) {
      const enemy =
        matching[0];

      setTyped("");

      defeatEnemy(
        enemy,
        value
      );
    }
  }


  function handleEnter() {
    if (
      !enemiesRef.current.length
    ) {
      return;
    }

    const closest =
      [...enemiesRef.current]
        .sort(
          (a, b) =>
            a.x - b.x
        )[0];

    if (
      closest.question.mode ===
      "recognition"
    ) {
      return;
    }

    setTyped("");

    if (
      closest.question.mode ===
      "typing"
    ) {
      speak(
        course.find(
          word =>
            word.id ===
            closest.wordId
        )?.target ?? ""
      );
    }

    missEnemy(
      closest,
      typed
    );
  }


  function answerRecognition(
    enemy,
    choice
  ) {
    const correct =
      normalize(
        choice,
        language
      ) ===
      normalize(
        enemy.question.answer,
        language
      );

    if (correct) {
      defeatEnemy(
        enemy,
        choice
      );
    }

    else {
      missEnemy(
        enemy,
        choice
      );
    }
  }


  function startConfetti() {
    const pieces =
      Array.from(
        { length: 120 },
        (_, index) => ({
          id: index,
          left:
            Math.random() *
            100,
          delay:
            Math.random() *
            1.5,
          duration:
            2.5 +
            Math.random() *
              2.5,
          rotate:
            Math.random() *
            720,
          size:
            6 +
            Math.random() *
              8
        })
      );

    setConfetti(pieces);
  }


  function stopConfetti() {
    setConfetti([]);
  }


  function saveProgress() {
    if (!language) {
      return;
    }

    localStorage.setItem(
      saveKey(language),
      JSON.stringify({
        course,
        unlockedCount,
        missionNumber
      })
    );
  }


  function loadProgress() {
    try {
      const raw =
        localStorage.getItem(
          saveKey(language)
        );

      if (!raw) {
        setMessage(
          "No saved progress found."
        );

        return;
      }

      const data =
        JSON.parse(raw);

      setCourse(
        data.course ??
          makeCourse(language)
      );

      setUnlockedCount(
        data.unlockedCount ??
          12
      );

      setMissionNumber(
        data.missionNumber ??
          1
      );

      startMission();
    }

    catch {
      setMessage(
        "Could not load saved progress."
      );
    }
  }


  function startMission() {
    stopConfetti();

    setEnemies([]);

    setMissionAnswered(0);
    setMissionCorrect(0);
    setMissionNewWords([]);

    setScore(0);
    setMisses(0);

    setScreen("game");

    setRunning(true);

    lastSpawnRef.current =
      performance.now();

    lastTimeRef.current =
      performance.now();

    setTimeout(() => {
      spawnEnemy();
      inputRef.current?.focus();
    }, 100);
  }


  function finishMission() {
    setRunning(false);
    setEnemies([]);

    saveProgress();

    startConfetti();

    setScreen(
      "missionComplete"
    );
  }


  function nextMission() {
    stopConfetti();

    setMissionNumber(
      old => old + 1
    );

    setTimeout(
      startMission,
      0
    );
  }


  function beginLanguage(
    selected
  ) {
    setLanguage(selected);

    setCourse(
      makeCourse(selected)
    );

    setUnlockedCount(12);

    setScreen("start");
  }


  function beginCourse(count) {
    setUnlockedCount(
      Math.min(
        course.length,
        count
      )
    );

    startMission();
  }


  useEffect(() => {
    if (!running) {
      return;
    }

    function frame(time) {
      let dt =
        (time -
          lastTimeRef.current) /
        1000;

      lastTimeRef.current =
        time;

      dt =
        Math.min(
          dt,
          0.1
        );

      if (
        time -
          lastSpawnRef.current >=
        SPAWN_DELAY
      ) {
        spawnEnemy();

        lastSpawnRef.current =
          time;
      }

      setEnemies(old => {
        const updated = [];

        const missed = [];

        for (const enemy of old) {
          const x =
            enemy.x -
            enemy.speed *
              dt;

          if (
            x +
              enemy.width <
            0
          ) {
            missed.push(enemy);
          }

          else {
            updated.push({
              ...enemy,
              x
            });
          }
        }

        if (missed.length) {
          setTimeout(() => {
            for (const enemy of missed) {
              missEnemy(enemy);
            }
          }, 0);
        }

        return updated;
      });

      animationRef.current =
        requestAnimationFrame(
          frame
        );
    }

    animationRef.current =
      requestAnimationFrame(
        frame
      );

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );
    };
  }, [
    running,
    course,
    unlockedCount,
    language,
    newWordChance
  ]);


  useEffect(() => {
    if (
      screen !== "game"
    ) {
      return;
    }

    if (
      missionAnswered >=
      MISSION_LENGTH
    ) {
      finishMission();
    }

    else if (
      misses >=
      MAX_MISSES
    ) {
      finishMission();
    }
  }, [
    missionAnswered,
    misses,
    screen
  ]);


  useEffect(() => {
    if (
      screen === "game"
    ) {
      inputRef.current?.focus();
    }
  }, [
    screen,
    enemies
  ]);

  return {
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
  };
}
