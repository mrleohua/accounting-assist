import React, { useEffect, useRef, useState } from 'react'

function MatrixRain() {
  const canvasRef = useRef(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId = null
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    const chars = '01'
    const fontSize = 16
    let columns = Math.floor(width / fontSize)
    let drops = Array(columns).fill(1)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / fontSize)
      drops = Array(columns).fill(1)
    }
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!active) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#0f0'
      ctx.font = fontSize + 'px monospace'
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      animationId = requestAnimationFrame(draw)
    }
    draw()

    const timer = setTimeout(() => {
      setActive(false)
      cancelAnimationFrame(animationId)
    }, 30000)

    return () => { window.removeEventListener('resize', resize); clearTimeout(timer); cancelAnimationFrame(animationId); }
  }, [active])

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />
}

const pdfUrl = `${import.meta.env.BASE_URL}ifrs/2025-IFRS-Standards-Combined.pdf`

function ifrsAnswer(question) {
  const q = (question || '').toLowerCase()
  const results = []

  if (q.includes('ifrs 1') || q.includes('first-time') || q.includes('transition')) {
    results.push({
      title: 'IFRS 1 — First-time adoption (core)',
      bullets: [
        'Use the same accounting policies in the opening IFRS statement of financial position and throughout all periods presented, applying the latest IFRSs effective at the end of the first IFRS reporting period.',
        'Recognise required assets/liabilities, derecognise prohibited items, reclassify and remeasure to comply with IFRS.',
        'Adjustments from previous GAAP go to retained earnings at the transition date.',
        'Disclose reconciliations of equity and total comprehensive income between previous GAAP and IFRS.'
      ],
      citations: ['IFRS 1 ¶7–12', 'IFRS 1 ¶24–25'],
      example: 'Entity adopts IFRS in 20X5; apply 20X5-effective IFRSs to the opening SFP at 1 Jan 20X4 and to all presented periods.'
    })
  }

  if (q.includes('ifrs 15') || q.includes('revenue')) {
    results.push({
      title: 'IFRS 15 — Revenue (five steps)',
      bullets: [
        'Identify the contract; identify performance obligations; determine the transaction price; allocate the price; recognise revenue when/as obligations are satisfied.'
      ],
      citations: ['IFRS 15 ¶9–31', 'IFRS 15 ¶35–38'],
      example: 'Licence + support: if distinct, recognise licence at a point in time and support over time.'
    })
  }

  if (q.includes('ifrs 9') || q.includes('classification') || q.includes('sppi')) {
    results.push({
      title: 'IFRS 9 — Financial instruments (classification & SPPI)',
      bullets: [
        'Classify financial assets based on business model and cash flow characteristics (SPPI test).',
        'Typical categories: amortised cost; FVOCI; FVTPL.',
        'Impairment uses expected credit loss (ECL) model.'
      ],
      citations: ['IFRS 9 ¶4.1.1–4.1.4', 'IFRS 9 Appendix B4 (SPPI)'],
      example: 'Plain-vanilla bond held to collect cash flows with SPPI → amortised cost (subject to ECL).'
    })
  }

  if (results.length === 0) {
    results.push({
      title: 'General approach',
      bullets: [
        'Please mention the standard (e.g., IFRS 15, IFRS 9) and the specific topic.',
        'This assistant uses the embedded IFRS PDF for authoritative wording; upload it via GitHub as shown below.'
      ],
      citations: [],
      example: 'Example: "Under IFRS 15, when do we recognise revenue for software customisation?"'
    })
  }

  return results
}

function AnswerBlock({ result }) {
  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h3 style={{ marginTop: 0 }}>{result.title}</h3>
      <ul>
        {result.bullets.map((b, i) => (<li key={i}>{b}</li>))}
      </ul>
      {result.example && <p><strong>Example:</strong> {result.example}</p>}
      {result.citations && result.citations.length > 0 && (
        <p className="source"><strong>Citations:</strong> {result.citations.join('; ')} (see IFRS PDF)</p>
      )}
    </div>
  )
}

export default function App() {
  const [question, setQuestion] = useState('How do we apply IFRS 1 on first-time adoption?')
  const [results, setResults] = useState([])
  const [files, setFiles] = useState([])

  const run = () => setResults(ifrsAnswer(question))
  const onFiles = (e) => setFiles(Array.from(e.target.files || []))

  return (
    <div className="app">
      <MatrixRain />

      <header className="header">
        <div className="title">Accounting Assist</div>
        <div className="subtitle">IFRS Virtual Assistant (chartered accountant tone)</div>
      </header>

      <main className="content">
        <section className="card">
          <h2>Ask a question</h2>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask an IFRS question…"
            rows={4}
          />
          <div className="actions">
            <button className="btn" onClick={run}>Ask</button>
            <a className="btn-link" href={pdfUrl} target="_blank" rel="noreferrer">Open IFRS primary source (PDF)</a>
          </div>
          <div className="badges">
            <span className="badge">Primary: Embedded IFRS PDF</span>
          </div>
        </section>

        <section className="card">
          <h2>Your documents</h2>
          <label className="btn" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Upload documents (PDF, DOCX, images)
            <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" onChange={onFiles} style={{ display: 'none' }} />
          </label>
          <div className="hint">Uploaded files are listed below (client-side only in this static version).</div>
          {files.length > 0 && (
            <ul className="file-list">
              {files.map((f, i) => (<li key={i}>{f.name}</li>))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Answer</h2>
          {results.length === 0 ? (
            <div className="hint">Ask a question to see a structured answer with example and citations.</div>
          ) : (
            results.map((r, i) => <AnswerBlock key={i} result={r} />)
          )}
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Accounting Assist. For guidance only — always consult the standards and apply professional judgement.</span>
      </footer>
    </div>
  )
}
