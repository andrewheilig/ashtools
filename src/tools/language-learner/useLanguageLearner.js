import { useEffect, useMemo, useRef, useState } from "react";
import {
  LANGUAGE_INFO,
  MISSION_LENGTH,
  REVIEW_DELAYS,
  getCourse,
  loadSave,
  normalize,
  randomItem,
  saveKey,
  statusFor,
  weakestMastery
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

  const [missionNumber, setMissionNumber] =
    useState(1);

  const [missionAnswered, setMissionAnswered] =
    useState(0);

  const [missionCorrect, setMissionCorrect] =
    useState(0);

  const [missionNewWords, setMissionNewWords] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [misses, setMisses] =
    useState(0);

  const [recentResults, setRecentResults] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(null);

  const [typed, setTyped] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [placement, setPlacement] =
    useState([]);

  const [placementIndex, setPlacementIndex] =
    useState(0);

  const [placementResults, setPlacementResults] =
    useState([]);

  const inputRef =
    useRef(null);

  const questionStart =
    useRef(Date.now());

  const missionComplete =
    missionAnswered >=
    MISSION_LENGTH;

  const activeWords =
    useMemo(
      () =>
        course.slice(
          0,
          unlockedCount
        ),
      [course, unlockedCount]
    );

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

  const accuracy =
    missionAnswered
      ? missionCorrect /
        missionAnswered
      : 1;

  const recentAccuracy =
    recentResults.length
      ? recentResults.filter(
          result =>
            result.correct
        ).length /
        recentResults.length
      : 1;

  const newWordChance =
    useMemo(() => {
      if (
        recentAccuracy >
        0.9
      ) {
        return 0.65;
      }

      if (
        recentAccuracy >
        0.75
      ) {
        return 0.45;
      }

      if (
        recentAccuracy >
        0.55
      ) {
        return 0.25;
      }

      return 0.1;
    }, [recentAccuracy]);

  function updateWord(
    id,
    updater
  ) {
    setCourse(old =>
      old.map(word =>
        word.id === id
          ? updater(word)
          : word
      )
    );
  }

  function chooseMode(word) {
    if (word.seen < 2) {
      return "typing";
    }

    const choices = [
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

    choices.sort(
      (a, b) =>
        a.mastery -
        b.mastery
    );

    if (
      Math.random() <
      0.65
    ) {
      return choices[0].mode;
    }

    return randomItem(
      choices
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

    const newWord =
      active.find(
        word =>
          word.seen === 0
      );

    if (
      newWord &&
      Math.random() <
        newWordChance
    ) {
      return newWord;
    }

    const due =
      active.filter(word => {
        if (word.seen === 0) {
          return false;
        }

        return (
          word.typingDue <=
            Date.now() ||
          word.recognitionDue <=
            Date.now() ||
          word.listeningDue <=
            Date.now()
        );
      });

    if (due.length) {
      const sorted =
        [...due].sort(
          (a, b) =>
            weakestMastery(a) -
            weakestMastery(b)
        );

      return sorted[
        Math.floor(
          Math.random() *
            Math.min(
              6,
              sorted.length
            )
        )
      ];
    }

    const seen =
      active.filter(
        word =>
          word.seen > 0
      );

    return (
      randomItem(seen) ||
      newWord ||
      randomItem(active)
    );
  }

  function buildRecognitionChoices(
    word
  ) {
    const others =
      activeWords.filter(
        candidate =>
          candidate.id !==
          word.id
      );

    const options = [
      word.english
    ];

    while (
      options.length < 4 &&
      others.length
    ) {
      const candidate =
        randomItem(others);

      if (
        !options.includes(
          candidate.english
        )
      ) {
        options.push(
          candidate.english
        );
      }
    }

    return options.sort(
      () =>
        Math.random() - 0.5
    );
  }

  function makeQuestion() {
    const word =
      chooseWord();

    if (!word) {
      return;
    }

    const mode =
      chooseMode(word);

    let question;

    if (
      mode === "typing"
    ) {
      question = {
        word,
        mode,
        prompt:
          word.english,
        answer:
          word.target
      };
    }

    else if (
      mode ===
      "recognition"
    ) {
      question = {
        word,
        mode,
        prompt:
          word.target,
        answer:
          word.english,
        choices:
          buildRecognitionChoices(
            word
          )
      };
    }

    else {
      question = {
        word,
        mode,
        prompt:
          "What did you hear?",
        answer:
          word.english
      };
    }

    setCurrentQuestion(
      question
    );

    setTyped("");

    questionStart.current =
      Date.now();

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
      mode === "listening"
    ) {
      setTimeout(
        () =>
          speak(
            word.target
          ),
        100
      );
    }

    setTimeout(
      () =>
        inputRef.current?.focus(),
      0
    );
  }

  function scheduleMastery(
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
      const firstExposure =
        word.seen <= 1;

      if (
        firstExposure &&
        mode === "typing" &&
        responseTime < 1800
      ) {
        mastery =
          Math.max(
            mastery,
            4
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

  function recordResult(
    correct
  ) {
    setRecentResults(old => {
      const next = [
        ...old,
        {
          correct,
          time: Date.now()
        }
      ];

      return next.slice(-20);
    });
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
      setUnlockedCount(
        old =>
          Math.min(
            course.length,
            old + 8
          )
      );
    }
  }

  function answerQuestion(
    value
  ) {
    if (!currentQuestion) {
      return;
    }

    const elapsed =
      Date.now() -
      questionStart.current;

    const expected =
      normalize(
        currentQuestion.answer,
        language
      );

    const actual =
      normalize(
        value,
        language
      );

    const correct =
      expected === actual;

    const word =
      currentQuestion.word;

    updateWord(
      word.id,
      old =>
        scheduleMastery(
          old,
          currentQuestion.mode,
          correct,
          elapsed
        )
    );

    recordResult(correct);

    setMissionAnswered(
      old => old + 1
    );

    if (correct) {
      setScore(
        old => old + 1
      );

      setMissionCorrect(
        old => old + 1
      );

      if (
        word.seen <= 1 &&
        !missionNewWords.includes(
          word.id
        )
      ) {
        setMissionNewWords(
          old => [
            ...old,
            word.id
          ]
        );
      }

      setMessage(
        `✓ ${word.target}`
      );
    }

    else {
      setMisses(
        old => old + 1
      );

      setMessage(
        `✗ ${word.english} = ${word.target}`
      );
    }

    maybeUnlock();

    setTimeout(() => {
      if (
        missionAnswered + 1 <
        MISSION_LENGTH
      ) {
        makeQuestion();
      }
    }, 400);
  }

  function speak(text) {
    if (
      !language ||
      !window.speechSynthesis
    ) {
      return;
    }

    const config =
      LANGUAGE_INFO[
        language
      ];

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      config.speech;

    utterance.rate =
      language === "japanese"
        ? 0.82
        : 0.86;

    const voices =
      speechSynthesis.getVoices();

    const best =
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(
              config.speech
                .slice(0, 2)
                .toLowerCase()
            ) &&
          !voice.localService
      ) ||
      voices.find(
        voice =>
          voice.lang
            .toLowerCase()
            .startsWith(
              config.speech
                .slice(0, 2)
                .toLowerCase()
            )
      );

    if (best) {
      utterance.voice =
        best;
    }

    speechSynthesis.cancel();

    speechSynthesis.speak(
      utterance
    );
  }

  function beginLanguage(
    lang
  ) {
    setLanguage(lang);

    const loaded =
      getCourse(lang);

    setCourse(loaded);

    setUnlockedCount(12);

    setMissionNumber(1);

    setScreen("start");
  }

  function beginCourse(
    startCount
  ) {
    setUnlockedCount(
      Math.min(
        course.length,
        startCount
      )
    );

    setMissionAnswered(0);
    setMissionCorrect(0);
    setMissionNewWords([]);
    setScore(0);
    setMisses(0);
    setRecentResults([]);

    setScreen("game");

    setTimeout(
      makeQuestion,
      50
    );
  }

  function saveProgress() {
    if (!language) {
      return;
    }

    const data = {
      language,
      course,
      unlockedCount,
      missionNumber
    };

    localStorage.setItem(
      saveKey(language),
      JSON.stringify(data)
    );

    setMessage(
      "Progress saved!"
    );
  }

  function loadProgress() {
    if (!language) {
      return;
    }

    const saved =
      loadSave(language);

    if (!saved) {
      setMessage(
        "No saved progress found."
      );

      return;
    }

    setCourse(
      saved.course ??
        getCourse(language)
    );

    setUnlockedCount(
      saved.unlockedCount ??
        12
    );

    setMissionNumber(
      saved.missionNumber ??
        1
    );

    setMissionAnswered(0);
    setMissionCorrect(0);
    setMissionNewWords([]);
    setScore(0);
    setMisses(0);

    setScreen("game");

    setTimeout(
      makeQuestion,
      50
    );
  }

  function finishMission() {
    saveProgress();

    setScreen(
      "missionComplete"
    );
  }

  function nextMission() {
    setMissionNumber(
      old => old + 1
    );

    setMissionAnswered(0);
    setMissionCorrect(0);
    setMissionNewWords([]);
    setScore(0);
    setMisses(0);

    setScreen("game");

    setTimeout(
      makeQuestion,
      50
    );
  }

  function buildPlacement() {
    const count = 36;

    const questions = [];

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const index =
        Math.round(
          i /
            (count - 1) *
            (course.length - 1)
        );

      questions.push({
        index,
        word:
          course[index]
      });
    }

    setPlacement(
      questions
    );

    setPlacementIndex(0);

    setPlacementResults([]);

    setScreen(
      "placement"
    );
  }

  function answerPlacement(
    value
  ) {
    const question =
      placement[
        placementIndex
      ];

    if (!question) {
      return;
    }

    const correct =
      normalize(
        value,
        language
      ) ===
      normalize(
        question.word.target,
        language
      );

    const results = [
      ...placementResults,
      {
        courseIndex:
          question.index,
        correct
      }
    ];

    setPlacementResults(
      results
    );

    if (
      placementIndex + 1 >=
      placement.length
    ) {
      finishPlacement(
        results
      );
    }

    else {
      setPlacementIndex(
        old => old + 1
      );

      setTyped("");
    }
  }

  function finishPlacement(
    results
  ) {
    let best = 12;

    for (
      let i = 4;
      i <
      results.length;
      i++
    ) {
      const window =
        results.slice(
          i - 4,
          i + 1
        );

      const rate =
        window.filter(
          r => r.correct
        ).length /
        window.length;

      if (rate >= 0.6) {
        best =
          results[i]
            .courseIndex;
      }
    }

    const start =
      Math.min(
        course.length,
        best + 12
      );

    setCourse(old =>
      old.map(
        (word, index) => {
          if (
            index <
            start - 12
          ) {
            return {
              ...word,

              seen: 1,

              typingMastery:
                4,

              recognitionMastery:
                4,

              listeningMastery:
                3
            };
          }

          return word;
        }
      )
    );

    setUnlockedCount(start);

    setMissionAnswered(0);
    setMissionCorrect(0);
    setMissionNewWords([]);

    setScreen("game");

    setTimeout(
      makeQuestion,
      50
    );
  }

  useEffect(() => {
    if (
      missionComplete &&
      screen === "game"
    ) {
      finishMission();
    }
  }, [
    missionComplete,
    screen
  ]);

  useEffect(() => {
    if (
      screen === "game"
    ) {
      inputRef.current?.focus();
    }
  }, [
    currentQuestion,
    screen
  ]);

  return {
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
  };
}
