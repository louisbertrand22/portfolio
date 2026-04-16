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
    { technologies: ['Angular', 'C#', '.NET Core', 'Docker'], link: 'https://github.com/louisbertrand22/Task-Managing' },
    { technologies: ['Python', 'SQLAlchemy', 'Alembic', 'CLI'], link: 'https://github.com/louisbertrand22/FootySim' },
    { technologies: ['FastAPI', 'SQLAlchemy', 'Python', 'REST API'], link: 'https://github.com/louisbertrand22/FootySim-backend' },
    { technologies: ['Python', 'OCR', 'Computer Vision'], link: 'https://github.com/louisbertrand22/sudoku-ocr' },
    { technologies: ['Angular', 'Go', 'PostgreSQL', 'JWT'], link: 'https://github.com/louisbertrand22/habit-tracker' },
    { technologies: ['Flask', 'Docker', 'Kubernetes', 'CI/CD'], link: 'https://github.com/louisbertrand22/DevOpsTest' },
    { technologies: ['Flask', 'Python', 'JWT', 'Docker'], link: 'https://github.com/louisbertrand22/FlashCards' },
    { technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'OAuth2', 'Prisma'], link: 'https://github.com/louisbertrand22/MySSO' },
  ]

  const skills = [
    { name: 'TypeScript / JS', icon: '⚡' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'FastAPI', icon: '🚀' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Kubernetes', icon: '☸️' },
    { name: 'CI/CD', icon: '🔄' },
    { name: 'HTML5 & CSS3', icon: '🎨' },
    { name: 'Git & GitHub', icon: '📦' },
    { name: 'REST APIs', icon: '🔗' },
    { name: 'Agile/Scrum', icon: '📋' },
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
                {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
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

        <section id="skills" className="skills">
          <div className="container">
            <h2 className="section-title animate-on-scroll">{t.skills.title}</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="skill-card animate-on-scroll"
                  style={{ '--delay': `${(index % 5) * 0.07}s` } as React.CSSProperties}
                >
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
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
                  <span className="contact-link-icon">📧</span>
                  Email
                </a>
                <a href="https://github.com/louisbertrand22/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">💻</span>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/louis-bertrand222" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span className="contact-link-icon">🔗</span>
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
