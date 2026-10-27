import './App.css';
import { useEffect, useRef, useState } from 'react';
import { CORPORA, prepareCustomCorpus } from './corpora';
import { LanguageModel, shuffleInPlace } from './languageModel';
import { applyBpe, preprocess, trainBpe } from './tokenizer';
import {
  buildContinuationMemory,
  createCandidates,
  diagnosePrompt,
  findTokenSequence,
  generateGreedy,
  normalizeStatement,
} from './generation';

/* =======================
   React App
======================= */

export default function App() {
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [ready, setReady] = useState(false);
  const [diagnostic, setDiagnostic] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [maxOutputTokens, setMaxOutputTokens] = useState(40);
  const [corpusChoice, setCorpusChoice] = useState('formal');
  const [customCorpus, setCustomCorpus] = useState('');
  const [trainingCorpus, setTrainingCorpus] = useState(() => ({
    label: CORPORA.formal.label,
    text: CORPORA.formal.text,
    revision: 0,
  }));
  const runtimeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const yieldToBrowser = () => new Promise(resolve => setTimeout(resolve, 0));

    const run = async () => {
      setReady(false);
      runtimeRef.current = null;
      setCandidates([]);
      setDiagnostic('');
      setOutput('Preparing training data...');
      await yieldToBrowser();
      if (cancelled) return;

    const corpus = trainingCorpus.text;

    const tokenizer = trainBpe(preprocess(corpus), 40);
    const tokens = tokenizer.tokens;
    const vocab = [...new Set([...tokenizer.vocabTokens, '<unk>'])];
    const id = Object.fromEntries(vocab.map((t, i) => [t, i]));
    const ids = tokens.map(t => id[t]);

    const contextLength = 16;
    const continuationMemory = buildContinuationMemory(ids, contextLength);
    const model = new LanguageModel(vocab.length, contextLength, 24, 48);

    // build training examples (prefix -> next)
    const examples = [];
    for (let i = 0; i < ids.length - 1; i++) {
      examples.push({
        prefix: ids.slice(Math.max(0, i + 1 - contextLength), i + 1),
        next: ids[i + 1],
      });
    }

    const epochs = 16;

    for (let e = 0; e < epochs; e++) {
      shuffleInPlace(examples);
      const trainingExamples = examples;

      let loss = 0;
      for (let i = 0; i < trainingExamples.length; i++) {
        const ex = trainingExamples[i];
        loss += model.trainStep(ex.prefix, ex.next, 0.01, 1);

        if (i % 32 === 31 || i === trainingExamples.length - 1) {
          const percent = Math.round(((i + 1) / trainingExamples.length) * 100);
          setOutput(
            `Training epoch ${e + 1}/${epochs}: ${i + 1}/${trainingExamples.length} (${percent}%)`
          );
          await yieldToBrowser();
          if (cancelled) return;
        }
      }

      console.log('epoch', e, 'avg loss', (loss / trainingExamples.length).toFixed(3));
    }
    console.log(
      'EOS in vocab:',
      vocab.includes('<eos>'),
      'EOS index:',
      vocab.indexOf('<eos>')
    );
    

    if (!cancelled) {
      runtimeRef.current = {
        model,
        vocab,
        id,
        learnedMerges: tokenizer.learnedMerges,
        contextLength,
        continuationMemory,
        corpusIds: ids,
        corpusStatements: preprocess(corpus)
          .split('<eos>')
          .map(normalizeStatement)
          .filter(Boolean),
      };
      setReady(true);
      setOutput(
        generateGreedy(model, ids.slice(0, 3), vocab, id, contextLength, continuationMemory)
      );
    }
    };

    run().catch(error => {
      console.error(error);
      if (!cancelled) setOutput(`Training failed: ${error.message}`);
    });

    return () => {
      cancelled = true;
    };
  }, [trainingCorpus]);

  const trainSelectedCorpus = () => {

    if (corpusChoice === 'custom') {
      const prepared = prepareCustomCorpus(customCorpus);
      if (!prepared) return;
      setTrainingCorpus({ label: 'Custom corpus', text: prepared, revision: Date.now() });
      return;
    }

    const selected = CORPORA[corpusChoice];
    setTrainingCorpus({
      label: selected.label,
      text: selected.text,
      revision: Date.now(),
    });
  };

  const continuePrompt = event => {
    event.preventDefault();
    const runtime = runtimeRef.current;
    if (!runtime || !prompt.trim()) return;

    const promptTokens = applyBpe(preprocess(prompt), runtime.learnedMerges);
    const unknownId = runtime.id['<unk>'];
    const promptIds = promptTokens.map(token => runtime.id[token] ?? unknownId);
    const promptIsInCorpus = findTokenSequence(runtime.corpusIds, promptIds) !== -1;
    const continuation = generateGreedy(
      runtime.model,
      promptIds,
      runtime.vocab,
      runtime.id,
      runtime.contextLength,
      promptIsInCorpus ? runtime.continuationMemory : null,
      maxOutputTokens
    );
    setOutput(continuation);
    setDiagnostic(diagnosePrompt(runtime, promptIds));
  };

  const generateCandidates = () => {
    const runtime = runtimeRef.current;
    if (!runtime || !prompt.trim()) return;

    const promptTokens = applyBpe(preprocess(prompt), runtime.learnedMerges);
    const unknownId = runtime.id['<unk>'];
    const promptIds = promptTokens.map(token => runtime.id[token] ?? unknownId);
    setCandidates(createCandidates(runtime, prompt, promptIds, maxOutputTokens, 10));
  };

  return (
    <div className="App">
      <section className="corpus-controls">
        <h3>Training corpus</h3>
        <label htmlFor="corpus-choice">Corpus:</label>{' '}
        <select
          id="corpus-choice"
          value={corpusChoice}
          onChange={event => setCorpusChoice(event.target.value)}
        >
          {Object.entries(CORPORA).map(([key, corpus]) => (
            <option key={key} value={key}>{corpus.label}</option>
          ))}
          <option value="custom">Paste your own</option>
        </select>{' '}
        <button
          type="button"
          onClick={trainSelectedCorpus}
          disabled={corpusChoice === 'custom' && !customCorpus.trim()}
        >
          Train selected corpus
        </button>
        <p>
          Active: {trainingCorpus.label}
        </p>
        {corpusChoice !== 'custom' && (
          <p>{CORPORA[corpusChoice].description}</p>
        )}
        {corpusChoice === 'custom' && (
          <>
            <label htmlFor="custom-corpus">One training example per line:</label>
            <textarea
              id="custom-corpus"
              rows="10"
              value={customCorpus}
              onChange={event => setCustomCorpus(event.target.value)}
              placeholder={'what is 2 plus 3? the answer is 5.\na triangle has three sides.'}
            />
            <small>Missing &lt;eos&gt; markers are appended automatically.</small>
          </>
        )}
      </section>
      <form onSubmit={continuePrompt}>
        <label htmlFor="prompt">Text to continue:</label>{' '}
        <input
          id="prompt"
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          placeholder="Type a prompt"
        />{' '}
        <label htmlFor="max-output-tokens">Max output tokens:</label>{' '}
        <input
          id="max-output-tokens"
          type="number"
          min="1"
          max="200"
          value={maxOutputTokens}
          onChange={event => {
            const value = Number(event.target.value);
            setMaxOutputTokens(Math.min(200, Math.max(1, value || 1)));
          }}
        />{' '}
        <button type="submit" disabled={!ready || !prompt.trim()}>
          Continue
        </button>
        {' '}
        <button
          type="button"
          onClick={generateCandidates}
          disabled={!ready || !prompt.trim()}
        >
          Generate new candidates
        </button>
      </form>
      <h3>Continuation:</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{output}</p>
      {diagnostic && (
        <>
          <h3>Diagnostic:</h3>
          <p>{diagnostic}</p>
        </>
      )}
      {candidates.length > 0 && (
        <>
          <h3>Novel candidates:</h3>
          <ol>
            {candidates.map((candidate, index) => (
              <li key={`${candidate.text}-${index}`}>
                <p>{candidate.text}</p>
                <small>
                  {candidate.status.toUpperCase()}: {candidate.reason}
                </small>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
