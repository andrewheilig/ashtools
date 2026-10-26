import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Tool hub</p>
          <h1 id="page-title">ASH Tools</h1>
          <p className="intro">A home for handy tools. More coming soon.</p>
        </div>
        <div className="result-display">
          <span>Tools</span>
          <strong>0</strong>
        </div>
      </section>
      <section className="empty-state" aria-labelledby="empty-title">
        <h2 id="empty-title">No tools yet</h2>
        <p>New tools will appear here when they’re ready.</p>
      </section>
    </main>
  )
}

export default App
