import F1Car from './F1Car'

export type HobbyKind = 'guitar' | 'running' | 'football' | 'f1'

function Fretboard() {
  const frets = [0, 22, 42, 60, 76, 90, 103, 115, 126, 136, 145, 153, 160]
  const y = (f: number) => 22 + f * 1.55
  const sx = (i: number) => 30 + i * 20
  const mid = (n: number) => (y(frets[n - 1]) + y(frets[n])) / 2
  return (
    <svg className="art art-guitar" viewBox="0 0 160 300" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <rect x="0" y="0" width="160" height="300" className="art-neck" />
      <rect x="0" y="12" width="160" height="10" className="art-nut" />
      {frets.slice(1).map(f => (
        <line key={f} x1="0" x2="160" y1={y(f)} y2={y(f)} className="art-fret" />
      ))}
      {[3, 5, 7, 9].map(n => (
        <circle key={n} cx="80" cy={mid(n)} r="5" className="art-inlay" />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={i} x1={sx(i)} x2={sx(i)} y1="12" y2="300" className="art-string" strokeWidth={2.4 - i * 0.3} />
      ))}
      {/* G major chord */}
      {[[0, 3], [1, 2], [5, 3]].map(([str, fret]) => (
        <circle key={`${str}-${fret}`} cx={sx(str)} cy={mid(fret)} r="7.5" className="art-finger" />
      ))}
    </svg>
  )
}

function Route() {
  return (
    <svg className="art art-running" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M0 110 H320 M0 80 H320 M0 50 H320 M0 20 H320" className="art-grid" />
      <path d="M60 0 V140 M140 0 V140 M220 0 V140 M300 0 V140" className="art-grid" />
      <path
        d="M24 112 C 60 112, 70 64, 108 70 S 150 118, 186 96 S 214 34, 252 40 S 272 72, 284 58"
        className="art-route"
      />
      <circle cx="24" cy="112" r="5" className="art-route-start" />
      <circle cx="284" cy="58" r="7" className="art-route-end" />
      <circle cx="284" cy="58" r="2.5" className="art-route-end-core" />
    </svg>
  )
}

function Pitch() {
  return (
    <svg className="art art-football" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <rect key={i} x={i * 40} y="0" width="40" height="140" className={i % 2 ? 'art-mow' : 'art-mow-alt'} />
      ))}
      <g className="art-lines">
        <rect x="10" y="10" width="300" height="120" />
        <line x1="160" y1="10" x2="160" y2="130" />
        <circle cx="160" cy="70" r="24" />
        <rect x="10" y="38" width="36" height="64" />
        <rect x="274" y="38" width="36" height="64" />
        <rect x="10" y="54" width="14" height="32" />
        <rect x="296" y="54" width="14" height="32" />
      </g>
      <circle cx="160" cy="70" r="3" className="art-spot" />
      <circle cx="212" cy="52" r="6" className="art-ball" />
    </svg>
  )
}

function Grid() {
  return (
    <div className="art art-f1">
      <div className="art-f1-checker" />
      <div className="art-f1-speed" />
      <div className="art-f1-car"><F1Car /></div>
    </div>
  )
}

export default function HobbyArt({ kind }: { kind: HobbyKind }) {
  switch (kind) {
    case 'guitar': return <Fretboard />
    case 'running': return <Route />
    case 'football': return <Pitch />
    case 'f1': return <Grid />
  }
}
