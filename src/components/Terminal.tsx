import { memo, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { translations, Language } from '@/translations'

const ease = [0.22, 1, 0.36, 1] as const

const bodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3, delayChildren: 0.85 } },
}
const lineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.06 } },
}

const sections = ['home', 'about', 'experience', 'education', 'sigl', 'projects', 'skills', 'hobbies', 'cv', 'contact']

const commandNames = [
  'help', 'whoami', 'about', 'ls', 'cd', 'cat', 'projects', 'education', 'experience', 'skills', 'hobbies',
  'cv', 'resume', 'contact', 'github', 'linkedin', 'theme', 'lang', 'echo', 'date', 'history', 'man',
  'neofetch', 'coffee', 'clear', 'exit', 'sudo',
]

const helpText = `Available commands:
  help              show this help
  whoami            who am I
  about             short bio
  ls                list sections
  cd <section>      jump to a section
  cat <file>        read a file (try stack.json)
  projects          list my projects
  education         my degrees
  experience        my work history
  skills            my tech stack
  hobbies           what I do off-screen
  cv | resume       download my CV
  contact           how to reach me
  github | linkedin open my profile in a new tab
  theme             toggle dark/light mode
  lang              switch EN ↔ FR
  echo <text>       repeat after you
  date              current date
  history           show past commands
  man <cmd>         read the manual
  neofetch          system info, portfolio edition
  coffee            brew one
  clear             clear the terminal
...and a few hidden ones 👀`

const manPages: Record<string, string> = {
  cd: 'CD(1)\n\nNAME\n  cd — jump to a section\n\nSYNOPSIS\n  cd <section>\n\nDESCRIPTION\n  Smooth-scrolls the page to <section>. Run \'ls\' for valid targets.',
  sudo: 'SUDO(1)\n\nNAME\n  sudo — attempt a privileged action\n\nSYNOPSIS\n  sudo hire-louis\n\nDESCRIPTION\n  There is exactly one command on this system worth escalating privileges for.',
  coffee: 'COFFEE(1)\n\nNAME\n  coffee — brew one\n\nDESCRIPTION\n  Essential build dependency. No flags, no decaf.',
  neofetch: 'NEOFETCH(1)\n\nNAME\n  neofetch — display system info\n\nDESCRIPTION\n  Prints a summary of this machine (me), portfolio edition.',
  cv: 'CV(1)\n\nNAME\n  cv — download résumé\n\nSYNOPSIS\n  cv | resume\n\nDESCRIPTION\n  Downloads cv-louis-bertrand.pdf. No sign-up required.',
}

const stackJson = `{
  "frontend": ["React", "TypeScript"],
  "backend": ["FastAPI", "Node.js", "Python"],
  "ops": ["Docker", "Kubernetes", "CI/CD", "Terraform"]
}`

const coffeeArt = `      ( (
       ) )
    ┌─────────┐
    │  ☕     ├─┐
    │         │ │
    │         ├─┘
    └─────────┘
  Coffee ready. Back to coding.`

type Line = { id: number; type: 'cmd' | 'out' | 'err'; text: string }

interface TerminalProps {
  language: Language
  onToggleTheme: () => void
  onToggleLanguage: () => void
}

function Terminal({ language, onToggleTheme, onToggleLanguage }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const push = (entries: Array<Omit<Line, 'id'>>) => {
    const withIds = entries.map(e => ({ ...e, id: nextId.current++ }))
    setLines(prev => [...prev, ...withIds].slice(-150))
  }

  const execute = (raw: string) => {
    const [cmd, ...args] = raw.split(/\s+/)
    const arg = args.join(' ')
    const out = (text: string): Array<Omit<Line, 'id'>> => [{ type: 'out', text }]
    const err = (text: string): Array<Omit<Line, 'id'>> => [{ type: 'err', text }]

    switch (cmd) {
      case '':
        return []
      case 'help':
        return out(helpText)
      case 'whoami':
        return out('Louis Bertrand — Software Engineer')
      case 'about':
        return out('Software engineering student at EPITA (SIGL major).\nI build full-stack products that are engineered to last.')
      case 'ls':
        return out([...sections, 'stack.json'].join('  '))
      case 'cd': {
        const target = arg.replace(/^#/, '') || 'home'
        if (!sections.includes(target)) return err(`cd: no such section: ${target}`)
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
        return out(`→ #${target}`)
      }
      case 'cat':
        if (arg === 'stack.json') return out(stackJson)
        return err(`cat: ${arg || 'stdin'}: No such file or directory`)
      case 'projects':
        return out(translations[language].projects.items.map(p => `• ${p.title}`).join('\n'))
      case 'education':
        return out(translations[language].education.items.map(i => `• ${i.school} — ${i.degree} (${i.period})`).join('\n'))
      case 'experience':
        return out(translations[language].experience.items.map(i => `• ${i.position} @ ${i.company} (${i.period})`).join('\n'))
      case 'skills':
        return out('TypeScript · React · Node.js · Python · FastAPI\nPostgreSQL · Docker · Kubernetes · CI/CD · Terraform')
      case 'hobbies':
        return out(translations[language].hobbies.items.map(i => `• ${i.title}`).join('\n'))
      case 'cv':
      case 'resume': {
        const a = document.createElement('a')
        a.href = '/cv-louis-bertrand.pdf'
        a.download = ''
        document.body.appendChild(a)
        a.click()
        a.remove()
        return out('Downloading cv-louis-bertrand.pdf ⬇')
      }
      case 'contact':
        return out('email     louisbert91@gmail.com\ngithub    github.com/louisbertrand22\nlinkedin  linkedin.com/in/louis-bertrand222')
      case 'github':
        window.open('https://github.com/louisbertrand22', '_blank', 'noopener,noreferrer')
        return out('→ github.com/louisbertrand22')
      case 'linkedin':
        window.open('https://linkedin.com/in/louis-bertrand222', '_blank', 'noopener,noreferrer')
        return out('→ linkedin.com/in/louis-bertrand222')
      case 'theme':
        onToggleTheme()
        return out('Theme toggled ✓')
      case 'lang':
        onToggleLanguage()
        return out(language === 'en' ? 'Langue changée en français ✓' : 'Language switched to English ✓')
      case 'echo':
        return out(arg)
      case 'date':
        return out(new Date().toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US'))
      case 'history':
        return cmdHistory.length
          ? out(cmdHistory.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`).join('\n'))
          : out('(empty)')
      case 'man':
        if (!arg) return err('What manual page do you want?')
        if (manPages[arg]) return out(manPages[arg])
        return err(commandNames.includes(arg) ? `No manual entry for ${arg} yet — try 'help'.` : `No manual entry for ${arg}`)
      case 'neofetch': {
        const art = [' __    ____ ', '| |   | __ )', '| |   |  _ \\', '| |___| |_) |', '|_____|____/ ']
        const info = [
          'louis@portfolio',
          '───────────────',
          'OS: LouisOS (EPITA build)',
          'Palette: Nuit de Circuit',
          'Stack: React · FastAPI · Docker · K8s',
          'Status: open to opportunities ✓',
        ]
        const width = Math.max(...art.map(l => l.length)) + 2
        const rows = Math.max(art.length, info.length)
        return out(Array.from({ length: rows }, (_, i) => `${(art[i] ?? '').padEnd(width)}${info[i] ?? ''}`).join('\n'))
      }
      case 'pitstop':
        return out('🏁 Box box box — new paint job applied.\nLivery: Nuit de Circuit (bleu nuit + or podium).\nLap time unaffected. Vibes: significantly improved.')
      case 'coffee':
        return out(coffeeArt)
      case 'clear':
        setLines([])
        return []
      case 'exit':
        return out("There's no escape from a good portfolio. Try 'cd contact' instead 😉")
      case 'sudo':
        if (arg === 'hire-louis') return out('Permission granted ✓\nCV inbound → louisbert91@gmail.com 🚀')
        return err('you are not in the sudoers file. This incident will be reported. 👮')
      case 'rm':
        return err('rm: nice try. This portfolio is immutable.')
      case 'vim':
      case 'nano':
        return out(`${cmd}: sorry, this terminal only has 80 columns of ambition.`)
      default:
        return err(`command not found: ${cmd}. Type 'help' to see what I can do.`)
    }
  }

  const runInput = () => {
    const raw = input.trim()
    push([{ type: 'cmd', text: input }, ...execute(raw)])
    if (raw) setCmdHistory(prev => (prev[prev.length - 1] === raw ? prev : [...prev, raw]))
    setHistIdx(null)
    setInput('')
  }

  const complete = () => {
    if (input.includes(' ') || !input) return
    const matches = commandNames.filter(c => c.startsWith(input))
    if (matches.length === 1) setInput(matches[0] + ' ')
    else if (matches.length > 1) push([{ type: 'cmd', text: input }, { type: 'out', text: matches.join('  ') }])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runInput()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!cmdHistory.length) return
      const idx = histIdx === null ? cmdHistory.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === null) return
      const idx = histIdx + 1
      if (idx >= cmdHistory.length) { setHistIdx(null); setInput('') }
      else { setHistIdx(idx); setInput(cmdHistory[idx]) }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault()
      push([{ type: 'cmd', text: `${input}^C` }])
      setHistIdx(null)
      setInput('')
    }
  }

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
  }

  const hint = language === 'fr' ? "Tape 'help' pour explorer" : "Type 'help' to explore"

  return (
    <motion.div
      className="hero-terminal"
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.3 }}
    >
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot red" /><span className="terminal-dot yellow" /><span className="terminal-dot green" />
        </div>
        <span className="terminal-title">~/portfolio</span>
      </div>
      <motion.div
        className="terminal-body" ref={bodyRef} onClick={focusInput}
        initial="hidden" animate="visible" variants={bodyVariants}
      >
        <motion.p variants={lineVariants}><span className="terminal-prompt">$</span> <span className="terminal-cmd">whoami</span></motion.p>
        <motion.p className="terminal-output" variants={lineVariants}>Louis Bertrand — Software Engineer</motion.p>
        <motion.p variants={lineVariants}><span className="terminal-prompt">$</span> <span className="terminal-cmd">cat stack.json</span></motion.p>
        <motion.p className="terminal-output" variants={lineVariants}>{'{ React, FastAPI, Docker, K8s }'}</motion.p>
        <motion.p variants={lineVariants}><span className="terminal-prompt">$</span> <span className="terminal-cmd">./interactive.sh</span></motion.p>
        <motion.p className="terminal-output" variants={lineVariants}>{hint} ✨</motion.p>
        {lines.map(line => (
          line.type === 'cmd'
            ? <p key={line.id}><span className="terminal-prompt">$</span> <span className="terminal-cmd">{line.text}</span></p>
            : <p key={line.id} className={line.type === 'err' ? 'terminal-error' : 'terminal-output'}>{line.text}</p>
        ))}
        <motion.div className="terminal-input-line" variants={lineVariants}>
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Interactive terminal — type help"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default memo(Terminal)
