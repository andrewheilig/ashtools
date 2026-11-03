import "./translations.js";

export const MISSION_LENGTH = 30;

export const REVIEW_DELAYS = [
  0,
  20_000,
  2 * 60_000,
  10 * 60_000,
  30 * 60_000,
  2 * 60 * 60_000,
  24 * 60 * 60_000
];

export const LANGUAGE_INFO = {
  spanish: {
    name: "Spanish",
    flag: "🇪🇸",
    speech: "es-US",
    special: ["á", "é", "í", "ó", "ú", "ñ", "ü"],
    ignoreAccents: true
  },

  french: {
    name: "French",
    flag: "🇫🇷",
    speech: "fr-FR",
    special: ["à", "â", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "ù", "û", "ü", "œ"],
    ignoreAccents: true
  },

  japanese: {
    name: "Japanese",
    flag: "🇯🇵",
    speech: "ja-JP",
    special: [],
    ignoreAccents: false
  }
};

export function getCourse(language) {
  const data =
    window.TRANSLATIONS?.[language] ??
    [];

  return data.map((row, index) => ({
    id: `${language}-${index}`,

    english: row[0],
    target: row[1],
    unit: row[2] ?? 1,
    info: row[3] ?? {},

    seen: 0,
    correct: 0,
    wrong: 0,

    typingMastery: 0,
    recognitionMastery: 0,
    listeningMastery: 0,

    typingDue: 0,
    recognitionDue: 0,
    listeningDue: 0,

    lastSeen: 0,

    fastCorrect: 0
  }));
}

export function normalize(text, language) {
  let value =
    String(text ?? "")
      .trim()
      .toLowerCase();

  if (
    LANGUAGE_INFO[language]
      .ignoreAccents
  ) {
    value = value
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );
  }

  return value;
}

export function randomItem(array) {
  if (!array.length) {
    return null;
  }

  return array[
    Math.floor(
      Math.random() *
        array.length
    )
  ];
}

export function weakestMastery(word) {
  return Math.min(
    word.typingMastery,
    word.recognitionMastery,
    word.listeningMastery
  );
}

export function statusFor(word) {
  const mastery =
    weakestMastery(word);

  if (word.seen === 0) {
    return "NEW";
  }

  if (mastery <= 1) {
    return "learning";
  }

  if (mastery <= 3) {
    return "practicing";
  }

  return "learned";
}

export function loadSave(language) {
  try {
    const raw =
      localStorage.getItem(
        `languageDefender_${language}_v2`
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveKey(language) {
  return `languageDefender_${language}_v2`;
}
