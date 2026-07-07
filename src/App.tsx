import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Guitar, Footprints, Dumbbell } from 'lucide-react'

const hobbyIcons = [Guitar, Footprints, Dumbbell]
import { toast } from 'sonner'
import './App.css'
import { translations, Language } from './translations'
import Markdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Terminal from '@/components/Terminal'

// ─── Animation variants ───────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease, delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: (delay: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease, delay },
  }),
}

const viewport = { once: true, margin: '-60px 0px' } as const

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  { featured: true,  technologies: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL'],          link: 'https://github.com/louisbertrand22/devdocshub' },
  { featured: false, technologies: ['React', 'FastAPI', 'Docker', 'CI/CD'],                     link: 'https://github.com/louisbertrand22/stats-f1' },
  { featured: false, technologies: ['Python', 'SQLAlchemy', 'Alembic', 'CLI'],                  link: 'https://github.com/louisbertrand22/FootySim' },
  { featured: false, technologies: ['FastAPI', 'SQLAlchemy', 'Python', 'REST API'],              link: 'https://github.com/louisbertrand22/FootySim-backend' },
  { featured: false, technologies: ['Python', 'OCR', 'Computer Vision'],                        link: 'https://github.com/louisbertrand22/sudoku-ocr' },
  { featured: false, technologies: ['Angular', 'Go', 'PostgreSQL', 'JWT'],                      link: 'https://github.com/louisbertrand22/habit-tracker' },
  { featured: false, technologies: ['Flask', 'Docker', 'Kubernetes', 'CI/CD'],                  link: 'https://github.com/louisbertrand22/DevOpsTest' },
  { featured: true,  technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'OAuth2', 'Prisma'], link: 'https://github.com/louisbertrand22/MySSO' },
]

const filterTechs = ['All', 'Python', 'TypeScript', 'Docker', 'FastAPI', 'PostgreSQL']

const skills = [
  'TypeScript / JS', 'React', 'Node.js', 'Python', 'FastAPI',
  'PostgreSQL', 'Docker', 'Kubernetes', 'CI/CD', 'ArgoCD', 'Terraform',
  'Git', 'REST APIs', 'Agile / Scrum', 'Cloud'
]
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false)
  const [hasScrolled,   setHasScrolled]   = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedTech,  setSelectedTech]  = useState('All')
  const [language, setLanguage] = useState<Language>(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem('language') } catch { /* unavailable */ }
    return (saved === 'en' || saved === 'fr') ? saved : 'en'
  })
  const [selectedProject,  setSelectedProject]  = useState<number | null>(null)
  const [readmeContent,    setReadmeContent]    = useState('')
  const [isLoadingReadme,  setIsLoadingReadme]  = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const t = translations[language]

  // Persist language
  useEffect(() => {
    try { localStorage.setItem('language', language) } catch { /* unavailable */ }
  }, [language])

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Scroll → glassmorphism nav + progress + back-to-top
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      setHasScrolled(scrollTop > 20)
      setShowBackToTop(scrollTop > 400)
      const el = document.documentElement
      const scrollHeight = el.scrollHeight - el.clientHeight
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin: '0px 0px -80% 0px', threshold: 0 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const fetchReadme = async (repoUrl: string) => {
    setIsLoadingReadme(true)
    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) throw new Error('Invalid GitHub URL')
      const [, owner, repo] = match
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        { headers: { Accept: 'application/vnd.github.v3.raw' } }
      )
      if (!response.ok) throw new Error('Failed to fetch README')
      setReadmeContent(await response.text())
    } catch {
      setReadmeContent('# README not available\n\nSorry, the README for this project could not be loaded.')
    } finally {
      setIsLoadingReadme(false)
    }
  }

  const openProjectModal = (index: number) => {
    setSelectedProject(index)
    fetchReadme(projects[index].link)
  }

  const closeProjectModal = () => {
    setSelectedProject(null)
    setReadmeContent('')
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Stable references so the memoized Terminal skips App's scroll-driven re-renders
  const toggleTheme = useCallback(() => setIsDarkMode(p => !p), [])
  const toggleLanguage = useCallback(() => setLanguage(p => p === 'en' ? 'fr' : 'en'), [])

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText('louisbert91@gmail.com').then(() => {
      toast(t.contact.emailCopied, { icon: '✓' })
    })
  }

  const filteredProjects = projects
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter(p => selectedTech === 'All' || p.technologies.includes(selectedTech))

  const badgeText = language === 'en' ? 'Open to opportunities' : 'Disponible pour des opportunités'
  const featuredLabel = language === 'en' ? 'Featured' : 'À la une'

  return (
    <div className="app">

      {/* ── SCROLL PROGRESS ── */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* ── NAV ── */}
      <header className={`header${hasScrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <nav className="nav">
            <div className="logo">{t.nav.logo}</div>
            <div className="nav-controls">
              <button className="language-toggle" onClick={() => setLanguage(p => p === 'en' ? 'fr' : 'en')} aria-label="Toggle language">
                {language === 'en' ? 'FR' : 'EN'}
              </button>
              <button className="theme-toggle" onClick={() => setIsDarkMode(p => !p)} aria-label="Toggle theme">
                {isDarkMode ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
              <button className="menu-toggle" onClick={() => setIsMenuOpen(o => !o)} aria-label="Toggle menu">
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              {(['home', 'about', 'education', 'experience', 'projects', 'sigl', 'skills', 'hobbies', 'contact'] as const).map(key => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={activeSection === key ? 'active' : undefined}
                  >
                    {t.nav[key]}
                    {activeSection === key && (
                      <motion.span className="nav-indicator" layoutId="nav-indicator" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section id="home" className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />
          </div>
          <motion.div
            className="hero-scroll" aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <span className="hero-scroll-text">Scroll</span>
            <div className="hero-scroll-line"><div className="hero-scroll-thumb" /></div>
          </motion.div>
          <div className="container">
            <div className="hero-layout">
              <motion.div className="hero-content" initial="hidden" animate="visible" variants={stagger}>
                <motion.div className="hero-badge" variants={cardItem}>
                  <span className="hero-badge-dot" />{badgeText}
                </motion.div>
                <motion.h1 className="hero-title" variants={fadeUp} custom={0.05}>
                  {t.hero.greeting} <span className="highlight">{t.hero.name}</span>
                </motion.h1>
                <motion.p className="hero-subtitle" variants={fadeUp} custom={0.1}>{t.hero.subtitle}</motion.p>
                <motion.p className="hero-description" variants={fadeUp} custom={0.15}>{t.hero.description}</motion.p>
                <motion.div className="hero-buttons" variants={fadeUp} custom={0.2}>
                  <Button asChild size="default">
                    <a href="#projects">{t.hero.viewWork}</a>
                  </Button>
                  <Button asChild variant="secondary" size="default">
                    <a href="#contact">{t.hero.getInTouch}</a>
                  </Button>
                </motion.div>
              </motion.div>
              <Terminal
                language={language}
                onToggleTheme={toggleTheme}
                onToggleLanguage={toggleLanguage}
              />
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="about">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.about.title}
            </motion.h2>
            <motion.div className="about-content" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
              <p>{t.about.paragraph1}</p>
              <p>{t.about.paragraph2}</p>
            </motion.div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section id="education" className="education">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.education.title}
            </motion.h2>
            <div className="timeline">
              {t.education.items.map((edu, index) => (
                <motion.div key={index} className="timeline-item" initial="hidden" whileInView="visible" viewport={viewport} variants={slideLeft} custom={index * 0.1}>
                  <div className="timeline-connector"><div className="timeline-dot" /></div>
                  <div className="timeline-card">
                    {edu.logo && <div className="timeline-logo"><img src={edu.logo} alt={`${edu.school} logo`} /></div>}
                    <h3 className="timeline-title">{edu.school}</h3>
                    <p className="timeline-subtitle">{edu.degree}</p>
                    <span className="timeline-period-badge">{edu.period}</span>
                    <p className="timeline-description">{edu.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="experience">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.experience.title}
            </motion.h2>
            <div className="timeline">
              {t.experience.items.map((exp, index) => (
                <motion.div key={index} className="timeline-item" initial="hidden" whileInView="visible" viewport={viewport} variants={slideLeft} custom={index * 0.1}>
                  <div className="timeline-connector"><div className="timeline-dot" /></div>
                  <div className="timeline-card">
                    {exp.logo && <div className="timeline-logo"><img src={exp.logo} alt={`${exp.company} logo`} /></div>}
                    <h3 className="timeline-title">{exp.position}</h3>
                    <p className="timeline-subtitle">{exp.company}</p>
                    <div className="timeline-meta">
                      <span className="timeline-period-badge">{exp.period}</span>
                      <Badge variant="secondary">{exp.type}</Badge>
                      <Badge variant="secondary">{exp.location}</Badge>
                    </div>
                    <p className="timeline-description">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="projects">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.projects.title}
            </motion.h2>

            {/* Filter bar */}
            <motion.div className="project-filters" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.08}>
              {filterTechs.map(tech => (
                <button
                  key={tech}
                  className={`filter-btn${selectedTech === tech ? ' active' : ''}`}
                  onClick={() => setSelectedTech(tech)}
                >
                  {selectedTech === tech && (
                    <motion.span className="filter-btn-bg" layoutId="filter-pill" transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }} />
                  )}
                  <span className="filter-btn-text">{tech}</span>
                </button>
              ))}
            </motion.div>

            {/* Grid */}
            <motion.div className="projects-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(({ originalIndex, featured, technologies }) => (
                  <motion.div
                    key={originalIndex}
                    layout
                    className={`project-card${featured ? ' featured' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    onClick={() => openProjectModal(originalIndex)}
                  >
                    {featured && (
                      <div className="project-preview" aria-hidden="true">
                        <div className="project-preview-dots" />
                        <span className="project-preview-name">{t.projects.items[originalIndex]?.title}</span>
                        <span className="project-featured-badge">{featuredLabel}</span>
                      </div>
                    )}
                    <div className="project-card-accent" />
                    <h3 className="project-title">{t.projects.items[originalIndex]?.title}</h3>
                    <p className="project-description">{t.projects.items[originalIndex]?.description}</p>
                    <div className="project-technologies">
                      {technologies.map((tech, idx) => (
                        <Badge key={idx}>{tech}</Badge>
                      ))}
                    </div>
                    <a href={projects[originalIndex].link} className="project-link" onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                      {t.projects.viewProject}
                    </a>
                    <div className="project-card-readme-hint" aria-hidden="true">
                      {t.projects.viewReadme}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── SIGL ── */}
        <section id="sigl" className="sigl-projects">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.siglProjects.title}
            </motion.h2>
            <motion.p className="sigl-subtitle" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.05}>
              {t.siglProjects.subtitle}
            </motion.p>
            <motion.div className="sigl-grid" initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}>
              <motion.div className="sigl-card" variants={cardItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <div className="sigl-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <path d="M3 9h18M9 21V9m6 12V9"/>
                    <rect x="6" y="12" width="1.5" height="1.5"/><rect x="11" y="12" width="1.5" height="1.5"/><rect x="16" y="12" width="1.5" height="1.5"/>
                    <rect x="6" y="16" width="1.5" height="1.5"/><rect x="11" y="16" width="1.5" height="1.5"/><rect x="16" y="16" width="1.5" height="1.5"/>
                  </svg>
                  <span className="sigl-card-code">UBSI</span>
                </div>
                <div className="sigl-card-content">
                  <h3 className="sigl-card-title">{t.siglProjects.items[0].title}</h3>
                  <p className="sigl-card-description">{t.siglProjects.items[0].description}</p>
                  <div className="sigl-card-technologies">
                    {['UML', 'ArchiMate', 'BPMN', 'Merise', 'SQL'].map(tech => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div className="sigl-card" variants={cardItem} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <div className="sigl-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                  <span className="sigl-card-code">ARCL</span>
                </div>
                <div className="sigl-card-content">
                  <h3 className="sigl-card-title">{t.siglProjects.items[1].title}</h3>
                  <p className="sigl-card-description">{t.siglProjects.items[1].description}</p>
                  <div className="sigl-card-technologies">
                    {['OpenStack', 'AWS', 'Azure', 'Terraform', 'Linux'].map(tech => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="skills">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.skills.title}
            </motion.h2>
            <motion.div className="skills-grid" initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}>
              {skills.map((skill, index) => (
                <motion.div key={index} className="skill-card" variants={cardItem} whileHover={{ y: -2, scale: 1.04, transition: { duration: 0.15 } }}>
                  <span className="skill-name">{skill}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── HOBBIES ── */}
        <section id="hobbies" className="hobbies">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.hobbies.title}
            </motion.h2>
            <motion.div className="hobbies-grid" initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}>
              {t.hobbies.items.map((hobby, index) => {
                const HobbyIcon = hobbyIcons[index]
                return (
                  <motion.div key={index} className="hobby-card" variants={cardItem} whileHover={{ y: -3, transition: { duration: 0.15 } }}>
                    <div className="hobby-icon"><HobbyIcon size={26} strokeWidth={1.75} /></div>
                    <h3 className="hobby-title">{hobby.title}</h3>
                    <p className="hobby-description">{hobby.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="contact">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.contact.title}
            </motion.h2>
            <motion.div className="contact-content" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
              <p>{t.contact.description}</p>
              <div className="contact-links">
                <a href="mailto:louisbert91@gmail.com" className="contact-link" onClick={copyEmail}>
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>Email
                </a>
                <a href="https://github.com/louisbertrand22/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </span>GitHub
                </a>
                <a href="https://www.linkedin.com/in/louis-bertrand222" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>{t.contact.linkedin}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <footer className="footer">
        <div className="container"><p>{t.footer.copyright}</p></div>
      </footer>

      {/* ── BACK TO TOP ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── MODAL ── */}
      <Dialog open={selectedProject !== null} onOpenChange={open => { if (!open) closeProjectModal() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.projects.items[selectedProject ?? 0]?.title}</DialogTitle>
          </DialogHeader>
          {isLoadingReadme ? (
            <div className="modal-loading"><div className="loading-spinner" />Loading README...</div>
          ) : (
            <div className="modal-readme"><Markdown>{readmeContent}</Markdown></div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default App
