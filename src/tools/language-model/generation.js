const EPS = 1e-9;

function buildContinuationMemory(ids, contextLength) {
  const memory = new Map();

  for (let targetIndex = 1; targetIndex < ids.length; targetIndex++) {
    const maxContext = Math.min(contextLength, targetIndex);
    for (let length = 1; length <= maxContext; length++) {
      const key = ids.slice(targetIndex - length, targetIndex).join(',');
      const counts = memory.get(key) || new Map();
      const target = ids[targetIndex];
      counts.set(target, (counts.get(target) || 0) + 1);
      memory.set(key, counts);
    }
  }

  return memory;
}

function recalledNextToken(memory, ctx, contextLength) {
  if (!memory) return null;

  for (let length = Math.min(contextLength, ctx.length); length >= 1; length--) {
    const counts = memory.get(ctx.slice(-length).join(','));
    if (!counts) continue;

    return [...counts.entries()].reduce((best, entry) =>
      entry[1] > best[1] ? entry : best
    )[0];
  }
  return null;
}

function generateGreedy(model, seedIds, vocab, id, contextLength, memory, maxTokens = 20) {
  const out = [];
  const ctx = seedIds.slice(-contextLength);

  for (let i = 0; i < maxTokens; i++) {
    const generationContext = ctx.slice(-contextLength);
    const { probs } = model.forwardForGeneration(generationContext, 1.2, 1.3, 5);

    console.log("Context:", JSON.stringify(
      generationContext.map(i => vocab[i]).join("")
    ));

    console.log("EOS probability:", probs[id["<eos>"]]);

    console.table(
      probs
        .map((p, i) => ({
          token: JSON.stringify(vocab[i]),
          probability: p
        }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 10)
    );

    const recalled = recalledNextToken(memory, generationContext, contextLength);
    const k = recalled ?? probs.indexOf(Math.max(...probs));

    console.log(
      "Selected token:",
      JSON.stringify(vocab[k]),
      "probability:",
      probs[k]
    );

    ctx.push(k);
    if (vocab[k] === '<eos>') break;
    out.push(vocab[k]);
  }

  return out.join('');
}

function sampleTopK(probs, blockedIds = [], k = 10, temperature = 0.9) {
  const blocked = new Set(blockedIds);
  const ranked = probs
    .map((p, id) => ({ id, score: Math.log(p + EPS) / temperature }))
    .filter(item => !blocked.has(item.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  const max = Math.max(...ranked.map(item => item.score));
  const weights = ranked.map(item => Math.exp(item.score - max));
  const total = weights.reduce((a, b) => a + b, 0);
  let choice = Math.random() * total;

  for (let i = 0; i < ranked.length; i++) {
    choice -= weights[i];
    if (choice <= 0) return ranked[i].id;
  }
  return ranked.at(-1).id;
}

function generateSampled(model, seedIds, vocab, id, contextLength, maxTokens = 40) {
  const out = [];
  const ctx = seedIds.slice(-contextLength);
  const eosId = id['<eos>'];

  for (let i = 0; i < maxTokens; i++) {
    const generationContext = ctx.slice(-contextLength);
    const { probs } = model.forwardForGeneration(generationContext, 1, 1.15, 5);
    const tokenId = sampleTopK(probs, [], 10, 0.9);

    ctx.push(tokenId);
    if (tokenId === eosId) break;
    out.push(vocab[tokenId]);
  }

  return out.join('');
}

function normalizeStatement(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function verifyMathClaim(text) {
  const normalized = normalizeStatement(text);
  let match = normalized.match(
    /what is (-?\d+) (plus|minus|times) (-?\d+)\?\s*the answer is (-?\d+)/
  );
  if (match) {
    const a = Number(match[1]);
    const b = Number(match[3]);
    const claimed = Number(match[4]);
    const actual = match[2] === 'plus' ? a + b : match[2] === 'minus' ? a - b : a * b;
    return actual === claimed
      ? { status: 'verified', reason: `${a} ${match[2]} ${b} = ${actual}` }
      : { status: 'rejected', reason: `Counterexample: the correct result is ${actual}, not ${claimed}.` };
  }

  match = normalized.match(
    /solve (-?\d+)x \+ \((-?\d+)\) = (-?\d+).*?x = (-?\d+)/
  );
  if (match) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    const result = Number(match[3]);
    const x = Number(match[4]);
    const lhs = a * x + b;
    return lhs === result
      ? { status: 'verified', reason: `Substitution gives ${a}×${x} + (${b}) = ${result}.` }
      : { status: 'rejected', reason: `Counterexample: substituting x = ${x} gives ${lhs}, not ${result}.` };
  }

  match = normalized.match(
    /a number times (-?\d+), then plus (-?\d+), gives (-?\d+)\. the number is (-?\d+)/
  );
  if (match) {
    const multiplier = Number(match[1]);
    const addend = Number(match[2]);
    const result = Number(match[3]);
    const number = Number(match[4]);
    const actual = number * multiplier + addend;
    return actual === result
      ? { status: 'verified', reason: `${number}×${multiplier} + ${addend} = ${result}` }
      : { status: 'rejected', reason: `Counterexample: the left side equals ${actual}, not ${result}.` };
  }

  match = normalized.match(
    /a bag has (\d+) red beads and (\d+) blue beads\. there are (\d+) beads/
  );
  if (match) {
    const red = Number(match[1]);
    const blue = Number(match[2]);
    const claimed = Number(match[3]);
    const actual = red + blue;
    return actual === claimed
      ? { status: 'verified', reason: `${red} + ${blue} = ${actual}` }
      : { status: 'rejected', reason: `Counterexample: there are ${actual} beads, not ${claimed}.` };
  }

  match = normalized.match(
    /(\d+) (?:tickets|candles|apples|pencils|notebooks|oranges) cost (\d+) dollars\. each costs (\d+) dollars/
  );
  if (match) {
    const count = Number(match[1]);
    const total = Number(match[2]);
    const each = Number(match[3]);
    const actual = count * each;
    return actual === total
      ? { status: 'verified', reason: `${count} × ${each} = ${total}` }
      : { status: 'rejected', reason: `Counterexample: ${count} × ${each} = ${actual}, not ${total}.` };
  }

  match = normalized.match(/(\d+) percent of (\d+) is (\d+)/);
  if (match) {
    const percent = Number(match[1]);
    const amount = Number(match[2]);
    const claimed = Number(match[3]);
    const actual = percent * amount / 100;
    return actual === claimed
      ? { status: 'verified', reason: `${percent}% of ${amount} = ${actual}` }
      : { status: 'rejected', reason: `Counterexample: ${percent}% of ${amount} is ${actual}, not ${claimed}.` };
  }

  match = normalized.match(
    /the pattern (-?\d+), (-?\d+), (-?\d+), (-?\d+) adds (-?\d+) each time/
  );
  if (match) {
    const values = match.slice(1, 5).map(Number);
    const step = Number(match[5]);
    const differences = values.slice(1).map((value, i) => value - values[i]);
    const valid = differences.every(value => value === step);
    return valid
      ? { status: 'verified', reason: `Every consecutive difference is ${step}.` }
      : { status: 'rejected', reason: `Counterexample: the differences are ${differences.join(', ')}.` };
  }

  return {
    status: 'unverified',
    reason: 'The JavaScript verifier does not recognize this claim format.',
  };
}

function createCandidates(runtime, promptText, promptIds, maxTokens, count = 10) {
  const candidates = [];
  const seen = new Set();
  const corpus = new Set(runtime.corpusStatements);
  const maxAttempts = count * 6;

  for (let attempt = 0; attempt < maxAttempts && candidates.length < count; attempt++) {
    const continuation = generateSampled(
      runtime.model,
      promptIds,
      runtime.vocab,
      runtime.id,
      runtime.contextLength,
      maxTokens
    );
    const text = `${promptText}${continuation}`.trim();
    const normalized = normalizeStatement(text);
    if (!normalized || seen.has(normalized) || corpus.has(normalized)) continue;

    seen.add(normalized);
    candidates.push({ text, ...verifyMathClaim(text) });
  }

  return candidates;
}

function findTokenSequence(haystack, needle) {
  if (needle.length === 0) return -1;
  for (let start = 0; start <= haystack.length - needle.length; start++) {
    let matches = true;
    for (let i = 0; i < needle.length; i++) {
      if (haystack[start + i] !== needle[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return start;
  }
  return -1;
}

function diagnosePrompt(runtime, promptIds, maxSteps = 20) {
  const matchStart = findTokenSequence(runtime.corpusIds, promptIds);
  if (matchStart === -1) {
    const corpusPrefix = runtime.corpusIds.slice(0, promptIds.length);
    const mismatchIndex = promptIds.findIndex((id, i) => id !== corpusPrefix[i]);
    const promptToken = runtime.vocab[promptIds[mismatchIndex]];
    const corpusToken = runtime.vocab[corpusPrefix[mismatchIndex]];
    return `Encoding check: no exact token-ID match was found. First corpus-prefix mismatch at token ${mismatchIndex}: prompt ${JSON.stringify(promptToken)} (ID ${promptIds[mismatchIndex]}), corpus ${JSON.stringify(corpusToken)} (ID ${corpusPrefix[mismatchIndex]}).`;
  }

  const continuationStart = matchStart + promptIds.length;
  const expectedIds = runtime.corpusIds.slice(
    continuationStart,
    continuationStart + maxSteps
  );
  const ctx = promptIds.slice(-runtime.contextLength);
  let correct = 0;
  let evaluated = 0;
  let firstMismatch = null;

  for (let step = 0; step < expectedIds.length; step++) {
    evaluated++;
    const expected = expectedIds[step];
    const { probs } = runtime.model.forward(ctx.slice(-runtime.contextLength), 1);
    const predicted = probs.indexOf(Math.max(...probs));

    if (predicted === expected) {
      correct++;
    } else if (!firstMismatch) {
      firstMismatch = {
        step: step + 1,
        expected: runtime.vocab[expected],
        predicted: runtime.vocab[predicted],
      };
    }

    // Teacher forcing: append the known correct token, not the prediction.
    ctx.push(expected);
    if (runtime.vocab[expected] === '<eos>') break;
  }

  const mismatchText = firstMismatch
    ? ` First mismatch at step ${firstMismatch.step}: expected ${JSON.stringify(firstMismatch.expected)}, predicted ${JSON.stringify(firstMismatch.predicted)}.`
    : ' No mismatches.';

  return `Encoding check: exact token-ID match at corpus index ${matchStart}. Teacher-forced top-1: ${correct}/${evaluated}.${mismatchText}`;
}


export {
  buildContinuationMemory,
  createCandidates,
  diagnosePrompt,
  findTokenSequence,
  generateGreedy,
  normalizeStatement,
};
