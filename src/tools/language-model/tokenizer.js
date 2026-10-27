/* =======================
   BPE tokenizer (simple)
======================= */

function preprocess(text) {
  return text.toLowerCase().replace(/\s+/g, ' ');
}

function mergeTokens(words, [a, b]) {
  const merged = a + b;
  return words.map(word => {
    const out = [];
    for (let i = 0; i < word.length; ) {
      if (word[i] === a && word[i + 1] === b) {
        out.push(merged);
        i += 2;
      } else {
        out.push(word[i++]);
      }
    }
    return out;
  });
}

function splitForBpe(text) {
  const parts = text.match(/<eos>|[a-z0-9]+|[^a-z0-9\s]|\s+/g) || [];
  return parts.map(part =>
    /^[a-z0-9]+$/.test(part) ? part.split('') : [part]
  );
}

function applyBpe(text, learnedMerges) {
  let words = splitForBpe(text);
  for (const pair of learnedMerges) words = mergeTokens(words, pair);
  return words.flat();
}

function trainBpe(text, mergeCount = 50) {
  const eosToken = '<eos>';
  let words = splitForBpe(text);
  const learnedMerges = [];
  const vocabTokens = new Set(words.flat());

  for (let m = 0; m < mergeCount; m++) {
    const counts = {};

    for (const word of words) {
      if (word.length === 1 && word[0] === eosToken) continue;
      for (let j = 0; j < word.length - 1; j++) {
        const k = word[j] + '||' + word[j + 1];
        counts[k] = (counts[k] || 0) + 1;
      }
    }

    const best = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0];

    if (!best) break;

    const pair = best[0].split('||');
    learnedMerges.push(pair);
    vocabTokens.add(pair[0] + pair[1]);
    words = mergeTokens(words, pair);
  }

  return { tokens: words.flat(), learnedMerges, vocabTokens: [...vocabTokens] };
}


export { applyBpe, preprocess, trainBpe };
