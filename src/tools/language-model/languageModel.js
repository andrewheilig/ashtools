/* =======================
   Math helpers
======================= */

const EPS = 1e-9;

function gelu(x) {
  const c = Math.sqrt(2 / Math.PI);
  return 0.5 * x * (1 + Math.tanh(c * (x + 0.044715 * x ** 3)));
}

function geluDerivative(x) {
  const c = Math.sqrt(2 / Math.PI);
  const inner = c * (x + 0.044715 * x ** 3);
  const tanhInner = Math.tanh(inner);
  const innerDerivative = c * (1 + 3 * 0.044715 * x ** 2);
  return 0.5 * (1 + tanhInner) + 0.5 * x * (1 - tanhInner ** 2) * innerDerivative;
}

function softmax(logits, temperature = 1) {
  const scaled = logits.map(x => x / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / (sum + EPS));
}

function crossEntropy(target, probs) {
  return -Math.log(probs[target] + EPS);
}

function dLogitsFromCE(probs, target, temperature = 0.8) {
  const grad = probs.slice();
  grad[target] -= 1;
  const scale = 1 / temperature;
  for (let i = 0; i < grad.length; i++) grad[i] *= scale;
  return grad;
}

function clipGradient(x, limit = 1) {
  return Math.max(-limit, Math.min(limit, x));
}

function applyRepetitionPenalty(logits, recentTokens, penalty = 1.2) {
  const out = logits.slice();
  for (const t of recentTokens) out[t] /= penalty;
  return out;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


/* =======================
   Linear algebra helpers
======================= */

function zeros(n) {
  return Array(n).fill(0);
}

function randMat(r, c) {
  return Array.from({ length: r }, () =>
    Array.from({ length: c }, () => (Math.random() * 2 - 1) * 0.02)
  );
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/* =======================
   Masked self-attention
======================= */

class MaskedSelfAttention {
  constructor(d) {
    this.d = d;
    this.WQ = randMat(d, d);
    this.WK = randMat(d, d);
    this.WV = randMat(d, d);
  }

  proj(x, W) {
    return W.map(row => dot(row, x));
  }

  forward(seq) {
    const Q = seq.map(x => this.proj(x, this.WQ));
    const K = seq.map(x => this.proj(x, this.WK));
    const V = seq.map(x => this.proj(x, this.WV));
    const weights = [];
    const scale = Math.sqrt(this.d);

    const out = seq.map((_, i) => {
      const scores = [];
      for (let j = 0; j <= i; j++) scores.push(dot(Q[i], K[j]) / scale);
      const w = softmax(scores);
      weights.push(w);

      const value = zeros(this.d);
      for (let j = 0; j <= i; j++) {
        for (let k = 0; k < this.d; k++) value[k] += w[j] * V[j][k];
      }
      return value;
    });

    return { out, cache: { seq, Q, K, V, weights } };
  }

  backwardLast(cache, dOut, lr) {
    const { seq, Q, K, V, weights } = cache;
    const last = seq.length - 1;
    const w = weights[last];
    const dWeights = V.map(v => dot(dOut, v));
    const weightedMean = dot(dWeights, w);
    const dScores = w.map((value, j) => value * (dWeights[j] - weightedMean));
    const dQ = zeros(this.d);
    const dK = seq.map(() => zeros(this.d));
    const dV = seq.map(() => zeros(this.d));
    const scale = Math.sqrt(this.d);

    for (let j = 0; j < seq.length; j++) {
      for (let k = 0; k < this.d; k++) {
        dV[j][k] += w[j] * dOut[k];
        dQ[k] += dScores[j] * K[j][k] / scale;
        dK[j][k] += dScores[j] * Q[last][k] / scale;
      }
    }

    const dSeq = seq.map(() => zeros(this.d));
    for (let j = 0; j < seq.length; j++) {
      for (let row = 0; row < this.d; row++) {
        for (let col = 0; col < this.d; col++) {
          dSeq[j][col] += this.WK[row][col] * dK[j][row];
          dSeq[j][col] += this.WV[row][col] * dV[j][row];
        }
      }
    }
    for (let row = 0; row < this.d; row++) {
      for (let col = 0; col < this.d; col++) {
        dSeq[last][col] += this.WQ[row][col] * dQ[row];
      }
    }

    for (let row = 0; row < this.d; row++) {
      for (let col = 0; col < this.d; col++) {
        this.WQ[row][col] -= lr * clipGradient(dQ[row] * seq[last][col]);
        let gradK = 0;
        let gradV = 0;
        for (let j = 0; j < seq.length; j++) {
          gradK += dK[j][row] * seq[j][col];
          gradV += dV[j][row] * seq[j][col];
        }
        this.WK[row][col] -= lr * clipGradient(gradK);
        this.WV[row][col] -= lr * clipGradient(gradV);
      }
    }

    return dSeq;
  }
}

/* =======================
   FFN
======================= */

class FeedForward {
  constructor(d, h) {
    this.W1 = randMat(h, d);
    this.W2 = randMat(d, h);
  }

  forward(x) {
    const pre = this.W1.map(row => dot(row, x));
    const hidden = pre.map(gelu);
    const out = this.W2.map(row => dot(row, hidden));
    return { out, cache: { x, pre, hidden } };
  }

  backward(cache, dOut, lr) {
    const { x, pre, hidden } = cache;
    const dHidden = hidden.map((_, j) =>
      this.W2.reduce((sum, row, i) => sum + row[j] * dOut[i], 0)
    );
    const dPre = dHidden.map((value, j) => value * geluDerivative(pre[j]));
    const dX = x.map((_, j) =>
      this.W1.reduce((sum, row, i) => sum + row[j] * dPre[i], 0)
    );

    for (let i = 0; i < this.W2.length; i++) {
      for (let j = 0; j < hidden.length; j++) {
        this.W2[i][j] -= lr * clipGradient(dOut[i] * hidden[j]);
      }
    }
    for (let i = 0; i < this.W1.length; i++) {
      for (let j = 0; j < x.length; j++) {
        this.W1[i][j] -= lr * clipGradient(dPre[i] * x[j]);
      }
    }

    return dX;
  }
}

/* =======================
   LayerNorm
======================= */

function layerNormWithCache(v, eps = 1e-5) {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  const std = Math.sqrt(variance + eps);
  const out = v.map(x => (x - mean) / std);
  return { out, cache: { out, std } };
}

function layerNormBackward(dOut, cache) {
  const { out, std } = cache;
  const n = out.length;
  const sumGrad = dOut.reduce((a, b) => a + b, 0);
  const sumGradNorm = dOut.reduce((sum, value, i) => sum + value * out[i], 0);
  return dOut.map((value, i) =>
    (n * value - sumGrad - out[i] * sumGradNorm) / (n * std)
  );
}

/* =======================
   Transformer block
======================= */

class TransformerBlock {
  constructor(vocab, maxLen, d, h) {
    this.tokenEmb = randMat(vocab, d);
    this.posEmb = randMat(maxLen, d);
    this.attn = new MaskedSelfAttention(d);
    this.ffn = new FeedForward(d, h);
  }

  forwardWithCache(tokens) {
    const input = tokens.map((token, i) =>
      this.tokenEmb[token].map((value, j) => value + this.posEmb[i][j])
    );
    const attention = this.attn.forward(input);
    const residual1 = input.map((value, i) =>
      value.map((item, j) => item + attention.out[i][j])
    );
    const norm1 = residual1.map(value => layerNormWithCache(value));
    const ffn = norm1.map(item => this.ffn.forward(item.out));
    const residual2 = norm1.map((item, i) =>
      item.out.map((value, j) => value + ffn[i].out[j])
    );
    const norm2 = residual2.map(value => layerNormWithCache(value));

    return {
      out: norm2.map(item => item.out),
      cache: { tokens, attention: attention.cache, norm1, ffn, norm2 },
    };
  }

  forward(tokens) {
    return this.forwardWithCache(tokens).out;
  }

  backwardLast(cache, dOut, lr) {
    const { tokens, attention, norm1, ffn, norm2 } = cache;
    const last = tokens.length - 1;
    const dResidual2 = layerNormBackward(dOut, norm2[last].cache);
    const dNorm1 = this.ffn.backward(ffn[last].cache, dResidual2, lr)
      .map((value, i) => value + dResidual2[i]);
    const dResidual1 = layerNormBackward(dNorm1, norm1[last].cache);
    const dInput = tokens.map(() => zeros(dOut.length));
    for (let i = 0; i < dOut.length; i++) dInput[last][i] += dResidual1[i];

    const dAttentionInput = this.attn.backwardLast(attention, dResidual1, lr);
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < dOut.length; j++) {
        dInput[i][j] += dAttentionInput[i][j];
        const grad = clipGradient(dInput[i][j]);
        this.tokenEmb[tokens[i]][j] -= lr * grad;
        this.posEmb[i][j] -= lr * grad;
      }
    }
  }
}

/* =======================
   Language model (with full updates)
======================= */

class LanguageModel {
  constructor(vocabSize, maxLen, d, h) {
    this.block = new TransformerBlock(vocabSize, maxLen, d, h);
    this.Wo = randMat(vocabSize, d);
    this.bo = zeros(vocabSize);
  }

  forward(tokens, temperature = 1, withCache = false) {
    const blockResult = this.block.forwardWithCache(tokens);
    const h = blockResult.out.at(-1);
    const logits = this.Wo.map((row, j) => dot(row, h) + this.bo[j]);
    const probs = softmax(logits, temperature);
    return { h, logits, probs, blockCache: withCache ? blockResult.cache : null };
  }

  trainStep(tokens, target, lr = 0.01, temperature = 1) {
    const { h, probs, blockCache } = this.forward(tokens, temperature, true);
    const loss = crossEntropy(target, probs);
    const dLogits = dLogitsFromCE(probs, target, temperature);
    const dH = zeros(h.length);

    for (let j = 0; j < this.Wo.length; j++) {
      for (let i = 0; i < h.length; i++) {
        dH[i] += this.Wo[j][i] * dLogits[j];
      }
    }

    for (let j = 0; j < this.Wo.length; j++) {
      for (let i = 0; i < h.length; i++) {
        this.Wo[j][i] -= lr * clipGradient(dLogits[j] * h[i]);
      }
      this.bo[j] -= lr * clipGradient(dLogits[j]);
    }

    this.block.backwardLast(blockCache, dH, lr);
    return loss;
  }

  forwardForGeneration(tokens, temperature = 1.2, repPenalty = 1.3, repWindow = 5) {
    const h = this.block.forward(tokens).at(-1);
    const rawLogits = this.Wo.map((row, j) => dot(row, h) + this.bo[j]);
    const recent = tokens.slice(-repWindow);
    const penalized = applyRepetitionPenalty(rawLogits, recent, repPenalty);
    return { probs: softmax(penalized, temperature) };
  }
}


export { LanguageModel, shuffleInPlace };
