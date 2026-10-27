import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'

const Pennywise = lazy(() => import('./tools/pennywise/Pennywise.jsx'))
const LanguageModelLab = lazy(() => import('./tools/language-model/App.jsx'))
const tools = [
  { path: '/pennywise', title: 'Pennywise', category: 'Coin strategy game', description: 'Play coins, collect change, and challenge a Greedy or Threshold computer opponent.', Component: Pennywise, className: 'pennywise' },
  { path: '/language-model', title: 'Language Model Lab', category: 'Text generation experiment', description: 'Train a small language model, continue prompts, and explore new candidates with built-in or custom corpora.', Component: LanguageModelLab },
]
const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/'

function App() {
  const [path, setPath] = useState(currentPath)
  const tool = tools.find((entry) => entry.path === path)
  const Tool = tool?.Component

  useEffect(() => {
    const onPopState = () => setPath(currentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = tool ? `${tool.title} | ASH Tools` : 'ASH Tools'
  }, [tool])

  function navigate(event, path) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    window.history.pushState(null, '', path)
    setPath(currentPath())
    window.scrollTo(0, 0)
  }

  return (
    <main className="app-shell">
      {tool ? (
        <>
          <a className="back-link" href="/" onClick={(event) => navigate(event, '/')}>
            ← ASH Tools
          </a>
          <div className={tool.className}>
            <Suspense fallback={<p>Loading {tool.title}…</p>}>
              <Tool />
            </Suspense>
          </div>
        </>
      ) : (
        <>
          <section className="hero-panel" aria-labelledby="page-title">
            <div>
              <p className="eyebrow">Tool hub</p>
              <h1 id="page-title">ASH Tools</h1>
              <p className="intro">A home for handy tools. More coming soon.</p>
            </div>
            <div className="result-display">
              <span>Tools</span>
              <strong>{tools.length}</strong>
            </div>
          </section>
          <section className="tool-grid" aria-label="Available tools">
            {tools.map((entry) => (
              <a key={entry.path} className="tool-card" href={entry.path} onClick={(event) => navigate(event, entry.path)}>
                <span>{entry.category}</span>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
              </a>
            ))}
          </section>
        </>
      )}
    </main>
  )
}

export default App
