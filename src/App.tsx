import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Briefcase, MapPin, Mail, Copy, ArrowUpRight, Download, ExternalLink, FileText } from 'lucide-react'

const hobbyKinds: HobbyKind[] = ['guitar', 'running', 'football', 'f1']
import { toast } from 'sonner'
import './App.css'
import { translations, Language } from './translations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Terminal from '@/components/Terminal'
import GithubStats from '@/components/GithubStats'
import ProjectCover, { type CoverKind } from '@/components/ProjectCover'
import SkillIcon from '@/components/SkillIcon'
import HobbyArt, { type HobbyKind } from '@/components/HobbyArt'
import CustomCursor from '@/components/CustomCursor'
import IntroScreen from '@/components/IntroScreen'
import { useLenis } from '@/hooks/useLenis'
import { useMagnetic } from '@/hooks/useMagnetic'

// Markdown rendering is only needed once a project modal opens
const ReadmeMarkdown = lazy(() => import('@/components/ReadmeMarkdown'))

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

const heroLogos = [
  { src: '/education-nationale-logo-trim.svg', alt: "Ministère de l'Éducation nationale" },
  { src: '/quanteam-logo-trim.png', alt: 'Quanteam' },
  { src: '/Epitalogo.png', alt: 'EPITA' },
]

const navGroup: Record<string, 'home' | 'about' | 'projects' | 'contact'> = {
  home: 'home',
  about: 'about', experience: 'about', education: 'about',
  sigl: 'projects', projects: 'projects',
  contact: 'contact',
}

// index-aligned with t.siglProjects.items
const siglMeta = [
  { code: 'UBSI', category: 'tech' },
  { code: 'ARCL', category: 'tech' },
  { code: 'MOAE', category: 'strategy' },
  { code: 'SDSI', category: 'strategy' },
  { code: 'CNP', category: 'tech' },
] as const
const spotlightIndex = 4

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    featured: true,
    technologies: ['Next.js', 'TypeScript', 'Firebase', 'Stripe', 'Gemini', 'Expo'],
    private: true,
    site: 'https://magic-cards.fr',
    preview: '/magiccards_home.jpg',
    gallery: ['/magiccards_home.jpg', '/magiccards_explore.jpg', '/magiccards_leitner.jpg', '/magiccards_download.jpg'],
  },
  { featured: false, technologies: ['Python', 'SQLAlchemy', 'Alembic', 'CLI'],                  link: 'https://github.com/louisbertrand22/FootySim', cover: 'footysim' as CoverKind },
  { featured: false, technologies: ['FastAPI', 'SQLAlchemy', 'Python', 'REST API'],              link: 'https://github.com/louisbertrand22/FootySim-backend', cover: 'footysim-api' as CoverKind },
  { featured: false, technologies: ['Flask', 'Docker', 'Kubernetes', 'CI/CD'],                  link: 'https://github.com/louisbertrand22/DevOpsTest', cover: 'devops' as CoverKind },
  {
    featured: true,
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'OAuth2', 'Prisma'],
    link: 'https://github.com/louisbertrand22/MySSO',
    site: 'https://my-sso.louis-bertrand.fr',
    preview: '/mysso_landingpage.png',
    gallery: ['/mysso_landingpage.png', '/consent.png', '/sso_1.png', '/sso_2.png'],
  },
  { featured: false, technologies: ['C', 'Autotools', 'POSIX'], private: true, cover: 'shell42' as CoverKind },
  { featured: false, technologies: ['Rust', 'POSIX'], link: 'https://github.com/louisbertrand22/MiniShell_Rust', cover: 'minishell' as CoverKind },
  { featured: false, technologies: ['C++', 'Flex', 'Bison', 'AST', 'IR', 'Autotools'], private: true, cover: 'tiger' as CoverKind },
  {
    featured: false,
    technologies: ['Python', 'OpenCV', 'TensorFlow', 'Streamlit', 'pytest'],
    link: 'https://github.com/louisbertrand22/sudoku-ocr',
    site: 'https://sudoku-ocr.streamlit.app/',
    cover: 'sudoku' as CoverKind,
  },
]

const filterTechs = ['All', 'C', 'C++', 'Rust', 'Python', 'TypeScript', 'Docker', 'FastAPI', 'PostgreSQL']

const skillGroups = [
  ['TypeScript / JS', 'Python', 'C++', 'Java', 'SQL'],
  ['React', 'Node.js', 'FastAPI', 'Django', 'PostgreSQL', 'REST APIs'],
  ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'CI/CD', 'Terraform', 'AWS', 'OpenStack', 'Cilium'],
  ['Keycloak', 'Git', 'Agile / Scrum', 'IA / Prompt Engineering'],
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
  const [heroRipples, setHeroRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const heroRippleId = useRef(0)
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('introShown') &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch { return false }
  })

  const lenisRef = useLenis()

  // Freeze the page's smooth scroll while the project modal is open
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis || selectedProject === null) return
    lenis.stop()
    return () => lenis.start()
  }, [selectedProject, lenisRef])
  const viewWorkRef = useMagnetic<HTMLAnchorElement>()
  const getInTouchRef = useMagnetic<HTMLAnchorElement>()
  const cvButtonRef = useMagnetic<HTMLAnchorElement>()
  const backToTopRef = useMagnetic<HTMLButtonElement>(0.4)
  const contactEmailRef = useMagnetic<HTMLAnchorElement>()

  const t = translations[language]
  const spotlight = t.siglProjects.items[spotlightIndex]
  const arch = t.siglProjects.cnpArchitecture
  const categoryLabel = (c: 'tech' | 'strategy') =>
    c === 'tech' ? t.siglProjects.categoryTech : t.siglProjects.categoryStrategy

  // Lock scroll while the intro curtain is up
  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showIntro])

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    try { sessionStorage.setItem('introShown', '1') } catch { /* unavailable */ }
  }, [])

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

  // READMEs are cached per repo (the GitHub API allows 60 unauthenticated calls/h),
  // and only the latest request may update the modal
  const readmeCache = useRef(new Map<string, string>())
  const readmeRequest = useRef('')

  const repoSlug = (url?: string) => url?.match(/github\.com\/([^/]+\/[^/]+)/)?.[1]

  const fetchReadme = async (repo: string) => {
    readmeRequest.current = repo
    const cached = readmeCache.current.get(repo)
    if (cached !== undefined) {
      setReadmeContent(cached)
      return
    }
    setReadmeContent('')
    setIsLoadingReadme(true)
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/readme`,
        { headers: { Accept: 'application/vnd.github.v3.raw' } }
      )
      if (!response.ok) throw new Error('Failed to fetch README')
      const content = await response.text()
      readmeCache.current.set(repo, content)
      if (readmeRequest.current === repo) setReadmeContent(content)
    } catch {
      if (readmeRequest.current === repo) setReadmeContent(t.projects.readmeError)
    } finally {
      if (readmeRequest.current === repo) setIsLoadingReadme(false)
    }
  }

  const openProjectModal = (index: number) => {
    setSelectedProject(index)
    const repo = repoSlug(projects[index].link)
    if (repo) fetchReadme(repo)
  }

  const closeProjectModal = () => {
    readmeRequest.current = ''
    setIsLoadingReadme(false)
    setSelectedProject(null)
    setReadmeContent('')
  }

  const scrollToTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Hero section: mouse-reactive spotlight, set directly on the DOM to skip re-renders
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  // Hero section: click ripple burst
  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = ++heroRippleId.current
    setHeroRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setHeroRipples(prev => prev.filter(r => r.id !== id)), 900)
  }

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
    .sort((a, b) => Number(b.featured) - Number(a.featured))

  const badgeText = language === 'en' ? 'Final-year internship - Feb/Mar 2027' : 'Stage de fin d\'études - Fév./Mars 2027'
  const featuredLabel = language === 'en' ? 'Featured' : 'À la une'

  return (
    <div className="app">

      <CustomCursor />

      {showIntro && (
        <IntroScreen name={t.hero.name} subtitle={t.hero.subtitle} onComplete={handleIntroComplete} />
      )}

      {/* ── SCROLL PROGRESS ── */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* ── NAV ── */}
      <header className={`header${hasScrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <nav className="nav">
            <div className="logo">LB<span className="logo-role"> - {t.nav.logo}</span></div>
            <div className="nav-controls">
              <button className="language-toggle" onClick={() => setLanguage(p => p === 'en' ? 'fr' : 'en')}>
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
              {(['home', 'about', 'projects', 'contact'] as const).map(key => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={navGroup[activeSection] === key ? 'active' : undefined}
                  >
                    {t.nav[key]}
                    {navGroup[activeSection] === key && (
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
        <section
          id="home"
          className="hero"
          onMouseMove={handleHeroMouseMove}
          onClick={handleHeroClick}
        >
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-spotlight" />
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />
          </div>
          <AnimatePresence>
            {heroRipples.map(ripple => (
              <motion.span
                key={ripple.id}
                className="hero-ripple"
                style={{ left: ripple.x, top: ripple.y }}
                initial={{ scale: 0, opacity: 0.55 }}
                animate={{ scale: 8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
              />
            ))}
          </AnimatePresence>
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
                    <a href="#projects" ref={viewWorkRef}>{t.hero.viewWork}</a>
                  </Button>
                  <Button asChild variant="secondary" size="default">
                    <a href="#contact" ref={getInTouchRef}>{t.hero.getInTouch}</a>
                  </Button>
                  <a className="hero-cv-link" href="/cv-louis-bertrand.pdf" download>
                    <Download size={15} strokeWidth={2} aria-hidden="true" />{t.hero.downloadCv}
                  </a>
                </motion.div>
                <motion.div className="hero-proof" variants={fadeUp} custom={0.28}>
                  <span className="hero-proof-label">{t.hero.background}</span>
                  <ul className="hero-proof-logos">
                    {heroLogos.map(logo => (
                      <li key={logo.src}><img src={logo.src} alt={logo.alt} loading="eager" /></li>
                    ))}
                  </ul>
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

        {/* ── ABOUT + EXPERIENCE + EDUCATION (sticky photo) ── */}
        <div className="about-experience">
          <div className="container about-experience-grid">
            <motion.div className="sticky-photo" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              <div className="sticky-photo-frame">
                <img src="/photo_profile.jpg" alt={t.hero.name} loading="lazy" />
              </div>
              <div className="sticky-photo-caption">
                <span className="sticky-photo-name">{t.hero.name}</span>
                <span className="sticky-photo-role">{t.hero.subtitle}</span>
              </div>
            </motion.div>

            <div className="about-experience-content">
              <section id="about" className="about">
                <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                  {t.about.title}
                </motion.h2>
                <motion.div className="about-content" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
                  <p>{t.about.paragraph1}</p>
                  <p>{t.about.paragraph2}</p>
                </motion.div>
              </section>

              <section id="experience" className="experience">
                <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                  {t.experience.title}
                </motion.h2>
                <div className="timeline">
                  {t.experience.items.map((exp, index) => (
                    <motion.div key={index} className="timeline-item" initial="hidden" whileInView="visible" viewport={viewport} variants={slideLeft} custom={index * 0.1}>
                      <div className="timeline-connector"><div className="timeline-dot" /></div>
                      <div className="timeline-card">
                        <div className="timeline-head">
                          {exp.logo && <div className="timeline-logo"><img src={exp.logo} alt={`${exp.company} logo`} /></div>}
                          <div className="timeline-heading">
                            <h3 className="timeline-title">{exp.position}</h3>
                            <p className="timeline-subtitle">{exp.company}</p>
                          </div>
                          <span className="timeline-period">{exp.period}</span>
                        </div>
                        <div className="timeline-meta">
                          <span><Briefcase size={13} strokeWidth={2} aria-hidden="true" />{exp.type}</span>
                          <span><MapPin size={13} strokeWidth={2} aria-hidden="true" />{exp.location}</span>
                        </div>
                        <p className="timeline-description">{exp.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="education" className="education">
                <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                  {t.education.title}
                </motion.h2>
                <div className="timeline">
                  {t.education.items.map((edu, index) => (
                    <motion.div key={index} className="timeline-item" initial="hidden" whileInView="visible" viewport={viewport} variants={slideLeft} custom={index * 0.1}>
                      <div className="timeline-connector"><div className="timeline-dot" /></div>
                      <div className="timeline-card">
                        <div className="timeline-head">
                          {edu.logo && <div className="timeline-logo"><img src={edu.logo} alt={`${edu.school} logo`} /></div>}
                          <div className="timeline-heading">
                            <h3 className="timeline-title">{edu.school}</h3>
                            <p className="timeline-subtitle">{edu.degree}</p>
                          </div>
                          <span className="timeline-period">{edu.period}</span>
                        </div>
                        <p className="timeline-description">{edu.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* ── SIGL ── */}
        <section id="sigl" className="sigl-projects">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.siglProjects.title}
            </motion.h2>
            <motion.p className="sigl-subtitle" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.05}>
              {t.siglProjects.subtitle}
            </motion.p>
            <motion.article
              className="sigl-spotlight"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              custom={0.1}
            >
              <div className="sigl-spotlight-main">
                <div className="sigl-card-meta">
                  <span className={`sigl-category sigl-category-${siglMeta[spotlightIndex].category}`}>
                    <span className="sigl-category-dot" />
                    {categoryLabel(siglMeta[spotlightIndex].category)}
                  </span>
                  <span className="sigl-card-code">{siglMeta[spotlightIndex].code}</span>
                </div>
                <h3 className="sigl-spotlight-title">{spotlight.title}</h3>
                <p className="sigl-spotlight-description">{spotlight.description}</p>
                <div className="sigl-card-technologies">
                  {spotlight.tags.map(tech => <Badge key={tech}>{tech}</Badge>)}
                </div>
              </div>
              <aside className="sigl-spotlight-panel">
                <h4 className="arch-title">{arch.title}</h4>
                <figure className="arch">
                  <div className="arch-users">{arch.users}</div>
                  <div className="arch-flow" aria-hidden="true" />
                  <div className="arch-core">
                    <div className="arch-main">
                      <div className="arch-layer">
                        <span className="arch-layer-name">{arch.portal}</span>
                        <div className="arch-chips">
                          {arch.portalItems.map(item => <span key={item} className="arch-chip">{item}</span>)}
                        </div>
                      </div>
                      <div className="arch-flow" aria-hidden="true" />
                      <div className="arch-layer">
                        <span className="arch-layer-name">{arch.services}</span>
                        <div className="arch-services">
                          {arch.serviceItems.map(svc => (
                            <div key={svc.name} className="arch-service">
                              <strong>{svc.name}</strong>
                              <span>{svc.detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="arch-rail">
                      <strong>{arch.identity}</strong>
                      <span>{arch.identityDetail}</span>
                    </div>
                  </div>
                  <div className="arch-flow" aria-hidden="true" />
                  <div className="arch-runtime">{arch.runtime}</div>
                  <div className="arch-clouds">
                    {arch.clouds.map((cloud, i) => (
                      <span key={cloud} className={`arch-cloud${i === 0 ? ' is-live' : ''}`}>{cloud}</span>
                    ))}
                  </div>
                  <figcaption className="arch-caption">{arch.caption}</figcaption>
                </figure>
              </aside>
            </motion.article>

            <motion.div className="sigl-grid" initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}>
              {t.siglProjects.items.map((item, i) => i === spotlightIndex ? null : (
                <motion.article
                  key={siglMeta[i].code}
                  className="sigl-card"
                  data-category={siglMeta[i].category}
                  variants={cardItem}
                >
                  <div className="sigl-card-meta">
                    <span className={`sigl-category sigl-category-${siglMeta[i].category}`}>
                      <span className="sigl-category-dot" />
                      {categoryLabel(siglMeta[i].category)}
                    </span>
                    <span className="sigl-card-code">{siglMeta[i].code}</span>
                  </div>
                  <h3 className="sigl-card-title">{item.title}</h3>
                  <p className="sigl-card-description">{item.description}</p>
                  {item.stat && (
                    <div className="sigl-card-stat">
                      <span className="sigl-card-stat-value">{item.stat.value}</span>
                      <span className="sigl-card-stat-label">{item.stat.label}</span>
                    </div>
                  )}
                  <div className="sigl-card-technologies">
                    {item.tags.map(tech => <Badge key={tech}>{tech}</Badge>)}
                  </div>
                </motion.article>
              ))}
            </motion.div>
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
                {filteredProjects.map(({ originalIndex, featured, technologies, preview, cover, gallery }) => (
                  <motion.div
                    key={originalIndex}
                    layout
                    className={`project-card${featured ? ' featured' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    onClick={() => openProjectModal(originalIndex)}
                  >
                    <div className="project-cover" aria-hidden="true">
                      {preview ? (
                        <img src={preview} alt={t.projects.items[originalIndex]?.galleryAlts?.[0] ?? ''} className="project-cover-img" loading="lazy" />
                      ) : cover ? (
                        <ProjectCover kind={cover} />
                      ) : null}
                      {featured && <span className="project-featured-badge">{featuredLabel}</span>}
                    </div>
                    <div className="project-body">
                      <h3 className="project-title">{t.projects.items[originalIndex]?.title}</h3>
                      <p className="project-description">{t.projects.items[originalIndex]?.description}</p>
                      <div className="project-technologies">
                        {technologies.map((tech, idx) => (
                          <Badge key={idx}>{tech}</Badge>
                        ))}
                      </div>
                      {featured && gallery && gallery.length > 1 && (
                        <div className="project-thumbs" aria-hidden="true">
                          {gallery.slice(1).map(src => (
                            <img key={src} src={src} alt="" loading="lazy" />
                          ))}
                        </div>
                      )}
                      <div className="project-footer">
                        <div className="project-links">
                          {projects[originalIndex].site && (
                            <a href={projects[originalIndex].site} className="project-link" onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                              {t.projects.visitSite}
                            </a>
                          )}
                          {projects[originalIndex].link ? (
                            <a href={projects[originalIndex].link} className="project-link" onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                              {t.projects.viewProject}
                            </a>
                          ) : !projects[originalIndex].site && (
                            <span className="project-link project-link-private">
                              <Lock size={12} strokeWidth={2.25} />{t.projects.privateRepo}
                            </span>
                          )}
                        </div>
                        <span className="project-details-hint">
                          {projects[originalIndex].link ? t.projects.viewReadme : t.projects.viewDetails}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="skills">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.skills.title}
            </motion.h2>
            <motion.div className="skills-groups" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.05}>
              {skillGroups.map((group, i) => (
                <div key={i} className="skills-group">
                  <h3 className="skills-group-title">{t.skills.groups[i]}</h3>
                  <ul className="skills-list">
                    {group.map(skill => <li key={skill}><SkillIcon name={skill} />{skill}</li>)}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── GITHUB ── */}
        <section id="github" className="github">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.github.title}
            </motion.h2>
            <motion.p className="github-subtitle" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.05}>
              {t.github.subtitle}
            </motion.p>
            <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
              <GithubStats language={language} labels={t.github} />
            </motion.div>
          </div>
        </section>

        {/* ── HOBBIES ── */}
        <section id="hobbies" className="hobbies">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.hobbies.title}
            </motion.h2>
            <motion.div className="hobbies-bento" initial="hidden" whileInView="visible" viewport={viewport} variants={stagger}>
              {t.hobbies.items.map((hobby, index) => (
                <motion.article key={hobbyKinds[index]} className={`hobby-tile hobby-tile--${hobbyKinds[index]}`} variants={cardItem}>
                  <div className="hobby-art"><HobbyArt kind={hobbyKinds[index]} /></div>
                  <div className="hobby-text">
                    <h3 className="hobby-title">{hobby.title}</h3>
                    <p className="hobby-description">{hobby.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CV ── */}
        <section id="cv" className="cv">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.cv.title}
            </motion.h2>
            <motion.div className="cv-panel" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
              <a className="cv-preview" href="/cv-louis-bertrand.pdf" target="_blank" rel="noopener noreferrer" aria-label={t.cv.open}>
                <span className="cv-sheet cv-sheet--back" aria-hidden="true" />
                <img src="/cv-preview.jpg" alt={t.cv.previewAlt} loading="lazy" width={760} height={1075} />
              </a>
              <div className="cv-body">
                <p className="cv-lead">{t.cv.description}</p>
                <dl className="cv-facts">
                  {t.cv.facts.map(f => (
                    <div key={f.label} className="cv-fact">
                      <dt>{f.value}</dt>
                      <dd>{f.label}</dd>
                    </div>
                  ))}
                </dl>
                <div className="cv-actions">
                  <Button asChild size="default">
                    <a href="/cv-louis-bertrand.pdf" download ref={cvButtonRef}>
                      <Download size={16} strokeWidth={2} aria-hidden="true" />
                      {t.cv.download}
                    </a>
                  </Button>
                  <a className="cv-open" href="/cv-louis-bertrand.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                    {t.cv.open}
                  </a>
                </div>
                <p className="cv-meta"><FileText size={14} strokeWidth={2} aria-hidden="true" />{t.cv.meta}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="contact">
          <div className="container">
            <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
              {t.contact.title}
            </motion.h2>
            <motion.div className="contact-panel" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} custom={0.1}>
              <div className="contact-intro">
                <span className="contact-availability"><span className="hero-badge-dot" />{badgeText}</span>
                <p className="contact-lead">{t.contact.description}</p>
                <a href="mailto:louisbert91@gmail.com" ref={contactEmailRef} className="contact-cta" onClick={copyEmail}>
                  <Mail size={18} strokeWidth={2} aria-hidden="true" />
                  <span className="contact-cta-address">louisbert91@gmail.com</span>
                  <span className="contact-cta-hint"><Copy size={13} strokeWidth={2} aria-hidden="true" />{t.contact.copy}</span>
                </a>
              </div>
              <ul className="contact-channels">
                <li>
                  <a href="https://www.linkedin.com/in/louis-bertrand222" target="_blank" rel="noopener noreferrer" className="contact-channel">
                    <span className="contact-channel-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </span>
                    <span className="contact-channel-text">
                      <span className="contact-channel-label">{t.contact.linkedin}</span>
                      <span className="contact-channel-value">/in/louis-bertrand222</span>
                    </span>
                    <ArrowUpRight className="contact-channel-arrow" size={18} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/louisbertrand22/" target="_blank" rel="noopener noreferrer" className="contact-channel">
                    <span className="contact-channel-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </span>
                    <span className="contact-channel-text">
                      <span className="contact-channel-label">GitHub</span>
                      <span className="contact-channel-value">@louisbertrand22</span>
                    </span>
                    <ArrowUpRight className="contact-channel-arrow" size={18} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <div className="contact-channel contact-channel--static">
                    <span className="contact-channel-icon"><MapPin size={18} strokeWidth={2} aria-hidden="true" /></span>
                    <span className="contact-channel-text">
                      <span className="contact-channel-label">{t.contact.locationLabel}</span>
                      <span className="contact-channel-value">{t.contact.location}</span>
                    </span>
                  </div>
                </li>
              </ul>
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
            ref={backToTopRef}
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
          {projects[selectedProject ?? -1]?.gallery && (
            <div className="modal-gallery">
              {projects[selectedProject ?? -1].gallery!.map((src, i) => (
                <img key={src} src={src} alt={t.projects.items[selectedProject ?? 0]?.galleryAlts?.[i] ?? ''} loading="lazy" />
              ))}
            </div>
          )}
          {!projects[selectedProject ?? -1]?.link ? (
            <div className="modal-readme">
              <p>{t.projects.items[selectedProject ?? 0]?.description}</p>
              <p className="modal-private-note">
                <Lock size={13} strokeWidth={2.25} />{t.projects.privateNote}
              </p>
            </div>
          ) : isLoadingReadme ? (
            <div className="modal-loading"><div className="loading-spinner" />{t.projects.readmeLoading}</div>
          ) : (
            <div className="modal-readme">
              <Suspense fallback={<div className="modal-loading"><div className="loading-spinner" />{t.projects.readmeLoading}</div>}>
                <ReadmeMarkdown content={readmeContent} repo={repoSlug(projects[selectedProject ?? -1]?.link) ?? ''} />
              </Suspense>
            </div>
          )}
          {projects[selectedProject ?? -1]?.site && (
            <a className="modal-site-link" href={projects[selectedProject ?? -1].site} target="_blank" rel="noopener noreferrer">
              {t.projects.visitSite}
            </a>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default App
