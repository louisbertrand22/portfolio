import type { ReactNode } from 'react'

export type CoverKind = 'footysim' | 'footysim-api' | 'devops' | 'shell42' | 'minishell' | 'tiger' | 'sudoku'

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cover-window">
      <div className="cover-window-bar">
        <span /><span /><span />
        <em>{title}</em>
      </div>
      <div className="cover-window-body">{children}</div>
    </div>
  )
}

function Stages({ steps, live }: { steps: string[]; live?: number }) {
  return (
    <ol className="cover-stages">
      {steps.map((s, i) => (
        <li key={s} className={i === live ? 'is-live' : undefined}>{s}</li>
      ))}
    </ol>
  )
}

// Wikipedia's classic puzzle: givens are read by OCR, the rest filled in by the solver
const sudokuSolution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
const sudokuGivens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'

function SudokuGrid() {
  return (
    <div className="cover-sudoku">
      {[...sudokuSolution].map((d, i) => (
        <span key={i} className={sudokuGivens[i] === '.' ? 'is-solved' : undefined}>{d}</span>
      ))}
    </div>
  )
}

export default function ProjectCover({ kind }: { kind: CoverKind }) {
  switch (kind) {
    case 'footysim':
      return (
        <Window title="zsh — footysim">
          <p><b>$</b> python -m footysim.cli schedule</p>
          <p><b>$</b> python -m footysim.cli simulate-season 1</p>
          <p><b>$</b> python -m footysim.cli table 1</p>
          <p><b>$</b> python -m footysim.cli topscorers 1<i className="cover-caret" /></p>
        </Window>
      )
    case 'footysim-api':
      return (
        <Window title="GET /api/v1/table/1">
          <p><span className="c-verb">GET</span> /api/v1/table/<span className="c-num">1</span> <span className="c-ok">200 OK</span></p>
          <p>[{'{'}</p>
          <p>&nbsp;&nbsp;<span className="c-key">"club"</span>: <span className="c-str">"…"</span>, <span className="c-key">"played"</span>: <span className="c-num">38</span>,</p>
          <p>&nbsp;&nbsp;<span className="c-key">"gd"</span>: <span className="c-num">41</span>, <span className="c-key">"pts"</span>: <span className="c-num">84</span></p>
          <p>{'}'}, …]</p>
        </Window>
      )
    case 'devops':
      return (
        <div className="cover-pipeline">
          <Stages steps={['pytest', 'Docker', 'ACR', 'AKS']} live={3} />
          <p className="cover-pipeline-caption">GitHub Actions: test, build, push, deploy</p>
        </div>
      )
    case 'shell42':
      return (
        <Window title="42sh">
          <p><b>42sh$</b> echo hello | tr a-z A-Z</p>
          <p className="c-out">HELLO</p>
          <p><b>42sh$</b> ls src &gt; files.txt &amp;&amp; wc -l &lt; files.txt</p>
          <p><b>42sh$</b> <i className="cover-caret" /></p>
        </Window>
      )
    case 'minishell':
      return (
        <div className="cover-pipeline">
          <Stages steps={['lexer', 'parser', 'AST', 'executor']} live={3} />
          <p className="cover-pipeline-caption">cargo run · src/</p>
        </div>
      )
    case 'tiger':
      return (
        <Window title="fact.tig">
          <p><span className="c-verb">let</span> <span className="c-verb">function</span> fact(n : <span className="c-key">int</span>) : <span className="c-key">int</span> =</p>
          <p>&nbsp;&nbsp;<span className="c-verb">if</span> n = <span className="c-num">0</span> <span className="c-verb">then</span> <span className="c-num">1</span> <span className="c-verb">else</span> n * fact(n - <span className="c-num">1</span>)</p>
          <p><span className="c-verb">in</span> print_int(fact(<span className="c-num">10</span>)) <span className="c-verb">end</span></p>
          <Stages steps={['Flex', 'Bison', 'AST', 'desugar']} />
        </Window>
      )
    case 'sudoku':
      return (
        <Window title="sudoku-ocr — photo.jpg">
          <div className="cover-sudoku-layout">
            <SudokuGrid />
            <div>
              <p><span className="c-verb">detect</span> grille 9×9</p>
              <p><span className="c-verb">warp</span> <span className="c-num">450</span>×<span className="c-num">450</span></p>
              <p><span className="c-verb">ocr</span> CNN <span className="c-str">Keras</span></p>
              <p><span className="c-verb">solve</span> backtracking</p>
              <p className="c-ok">✓ 81/81</p>
            </div>
          </div>
        </Window>
      )
  }
}
