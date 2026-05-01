import { useState, useEffect } from 'react'
import './App.css'
import { translations, Language } from './translations'
import Markdown from 'react-markdown'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [language, setLanguage] = useState<Language>(() => {
    let savedLanguage: string | null = null;
    try {
      savedLanguage = localStorage.getItem('language');
    } catch {
      // localStorage unavailable, ignore and use default
    }
    return (savedLanguage === 'en' || savedLanguage === 'fr') ? savedLanguage : 'en'
  })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [readmeContent, setReadmeContent] = useState<string>('')
  const [isLoadingReadme, setIsLoadingReadme] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  const t = translations[language]

  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch {
      // localStorage unavailable, ignore
    }
  }, [language])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'fr' : 'en')
  const toggleTheme = () => setIsDarkMode(prev => !prev)

  const fetchReadme = async (repoUrl: string) => {
    setIsLoadingReadme(true)
    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) throw new Error('Invalid GitHub URL')
      const [, owner, repo] = match
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        { headers: { 'Accept': 'application/vnd.github.v3.raw' } }
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

  const projects = [
    { technologies: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL'], link: 'https://github.com/louisbertrand22/devdocshub' },
    { technologies: ['React', 'FastAPI', 'Docker', 'CI/CD'], link: 'https://github.com/louisbertrand22/stats-f1' },
    { technologies: ['Python', 'SQLAlchemy', 'Alembic', 'CLI'], link: 'https://github.com/louisbertrand22/FootySim' },
    { technologies: ['FastAPI', 'SQLAlchemy', 'Python', 'REST API'], link: 'https://github.com/louisbertrand22/FootySim-backend' },
    { technologies: ['Python', 'OCR', 'Computer Vision'], link: 'https://github.com/louisbertrand22/sudoku-ocr' },
    { technologies: ['Angular', 'Go', 'PostgreSQL', 'JWT'], link: 'https://github.com/louisbertrand22/habit-tracker' },
    { technologies: ['Flask', 'Docker', 'Kubernetes', 'CI/CD'], link: 'https://github.com/louisbertrand22/DevOpsTest' },
    { technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'OAuth2', 'Prisma'], link: 'https://github.com/louisbertrand22/MySSO' },
  ]

  const skills = [
    'TypeScript / JS',
    'React',
    'Node.js',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'HTML5 & CSS3',
    'Git & GitHub',
    'REST APIs',
    'Agile / Scrum',
  ]

  const badgeText = language === 'en' ? 'Open to opportunities' : 'Disponible pour des opportunités'

  return (
    <div className="app">
      <header className={`header${hasScrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <nav className="nav">
            <div className="logo">{t.nav.logo}</div>
            <div className="nav-controls">
              <button
                className="language-toggle"
                onClick={toggleLanguage}
                aria-label="Toggle language"
              >
                {language === 'en' ? 'FR' : 'EN'}
              </button>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#home" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a></li>
              <li><a href="#about" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a></li>
              <li><a href="#education" onClick={() => setIsMenuOpen(false)}>{t.nav.education}</a></li>
              <li><a href="#experience" onClick={() => setIsMenuOpen(false)}>{t.nav.experience}</a></li>
              <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>{t.nav.projects}</a></li>
              <li><a href="#sigl" onClick={() => setIsMenuOpen(false)}>{t.nav.sigl}</a></li>
              <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>{t.nav.skills}</a></li>
              <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />
          </div>
          <div className="hero-scroll" aria-hidden="true">
            <span className="hero-scroll-text">Scroll</span>
            <div className="hero-scroll-line">
              <div className="hero-scroll-thumb" />
            </div>
          </div>
          <div className="container">
            <div className="hero-layout">
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="hero-badge-dot" />
                  {badgeText}
                </div>
                <h1 className="hero-title">
                  {t.hero.greeting} <span className="highlight">{t.hero.name}</span>
                </h1>
                <p className="hero-subtitle">{t.hero.subtitle}</p>
                <p className="hero-description">{t.hero.description}</p>
                <div className="hero-buttons">
                  <a href="#projects" className="btn btn-primary">{t.hero.viewWork}</a>
                  <a href="#contact" className="btn btn-secondary">{t.hero.getInTouch}</a>
                </div>
              </div>
              <div className="hero-terminal" aria-hidden="true">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                  </div>
                  <span className="terminal-title">~/portfolio</span>
                </div>
                <div className="terminal-body">
                  <p><span className="terminal-prompt">$</span> <span className="terminal-cmd">whoami</span></p>
                  <p className="terminal-output">Louis Bertrand - Software Engineer</p>
                  <p><span className="terminal-prompt">$</span> <span className="terminal-cmd">cat stack.json</span></p>
                  <p className="terminal-output">{'{ React, FastAPI, Docker, K8s }'}</p>
                  <p><span className="terminal-prompt">$</span> <span className="terminal-cmd">git log --oneline -1</span></p>
                  <p className="terminal-output">feat: building cool things ✨</p>
                  <p><span className="terminal-prompt">$</span> <span className="terminal-cursor">█</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.about.title}</h2>
            <div
              className="about-content animate-on-scroll"
              style={{ '--delay': '0.1s' } as React.CSSProperties}
            >
              <p>{t.about.paragraph1}</p>
              <p>{t.about.paragraph2}</p>
            </div>
          </div>
        </section>

        <section id="education" className="education">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.education.title}</h2>
            <div className="timeline">
              {t.education.items.map((edu, index) => (
                <div
                  key={index}
                  className="timeline-item animate-on-scroll"
                  style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
                >
                  <div className="timeline-connector">
                    <div className="timeline-dot" />
                  </div>
                  <div className="timeline-card">
                    {edu.logo && (
                      <div className="timeline-logo">
                        <img src={edu.logo} alt={`${edu.school} logo`} />
                      </div>
                    )}
                    <h3 className="timeline-title">{edu.school}</h3>
                    <p className="timeline-subtitle">{edu.degree}</p>
                    <span className="timeline-period-badge">{edu.period}</span>
                    <p className="timeline-description">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="experience">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.experience.title}</h2>
            <div className="timeline">
              {t.experience.items.map((exp, index) => (
                <div
                  key={index}
                  className="timeline-item animate-on-scroll"
                  style={{ '--delay': `${index * 0.15}s` } as React.CSSProperties}
                >
                  <div className="timeline-connector">
                    <div className="timeline-dot" />
                  </div>
                  <div className="timeline-card">
                    {exp.logo && (
                      <div className="timeline-logo">
                        <img src={exp.logo} alt={`${exp.company} logo`} />
                      </div>
                    )}
                    <h3 className="timeline-title">{exp.position}</h3>
                    <p className="timeline-subtitle">{exp.company}</p>
                    <div className="timeline-meta">
                      <span className="timeline-period-badge">{exp.period}</span>
                      <span className="timeline-tag">{exp.type}</span>
                      <span className="timeline-tag">{exp.location}</span>
                    </div>
                    <p className="timeline-description">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.projects.title}</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="project-card animate-on-scroll"
                  style={{ '--delay': `${(index % 3) * 0.1}s` } as React.CSSProperties}
                  onClick={() => openProjectModal(index)}
                >
                  <div className="project-card-accent" />
                  <h3 className="project-title">{t.projects.items[index].title}</h3>
                  <p className="project-description">{t.projects.items[index].description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="project-link"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.projects.viewProject}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sigl" className="sigl-projects">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.siglProjects.title}</h2>
            <p className="sigl-subtitle animate-on-scroll" style={{ '--delay': '0.05s' } as React.CSSProperties}>
              {t.siglProjects.subtitle}
            </p>
            <div className="sigl-grid">
              <div
                className="sigl-card animate-on-scroll"
                style={{ '--delay': '0.1s' } as React.CSSProperties}
              >
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
                    {['UML', 'ArchiMate', 'BPMN', 'Merise', 'SQL'].map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="sigl-card animate-on-scroll"
                style={{ '--delay': '0.15s' } as React.CSSProperties}
              >
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
                    {['OpenStack', 'AWS', 'Azure', 'Terraform', 'Linux'].map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.skills.title}</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="skill-card animate-on-scroll"
                  style={{ '--delay': `${(index % 7) * 0.05}s` } as React.CSSProperties}
                >
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.contact.title}</h2>
            <div
              className="contact-content animate-on-scroll"
              style={{ '--delay': '0.1s' } as React.CSSProperties}
            >
              <p>{t.contact.description}</p>
              <div className="contact-links">
                <a href="mailto:louisbert91@gmail.com" className="contact-link">
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  Email
                </a>
                <a href="https://github.com/louisbertrand22/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </span>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/louis-bertrand222" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>
                  {t.contact.linkedin}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>

      {selectedProject !== null && (
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProjectModal} aria-label="Close modal">
              ✕
            </button>
            <h2 className="modal-title">{t.projects.items[selectedProject].title}</h2>
            {isLoadingReadme ? (
              <div className="modal-loading">
                <div className="loading-spinner" />
                Loading README...
              </div>
            ) : (
              <div className="modal-readme">
                <Markdown>{readmeContent}</Markdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
