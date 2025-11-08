import { useState, useEffect } from 'react'
import './App.css'
import { translations, Language } from './translations'
import Markdown from 'react-markdown'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const t = translations[language]

  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch {
      // localStorage unavailable, ignore
    }
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en')
  }
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const fetchReadme = async (repoUrl: string) => {
    setIsLoadingReadme(true)
    try {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) {
        throw new Error('Invalid GitHub URL')
      }
      const [, owner, repo] = match
      
      // Fetch README from GitHub API
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch README')
      }
      
      const content = await response.text()
      setReadmeContent(content)
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
    {
      technologies: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL'],
      link: 'https://github.com/louisbertrand22/devdocshub'
    },
    {
      technologies: ['React', 'FastAPI', 'Docker', 'CI/CD'],
      link: 'https://github.com/louisbertrand22/stats-f1'
    },
    {
      technologies: ['Angular', 'C#', '.NET Core', 'Docker'],
      link: 'https://github.com/louisbertrand22/Task-Managing'
    },
    {
      technologies: ['Python', 'SQLAlchemy', 'Alembic', 'CLI'],
      link: 'https://github.com/louisbertrand22/FootySim'
    },
    {
      technologies: ['FastAPI', 'SQLAlchemy', 'Python', 'REST API'],
      link: 'https://github.com/louisbertrand22/FootySim-backend'
    },
    {
      technologies: ['Python', 'OCR', 'Computer Vision'],
      link: 'https://github.com/louisbertrand22/sudoku-ocr'
    },
    {
      technologies: ['Angular', 'Go', 'PostgreSQL', 'JWT'],
      link: 'https://github.com/louisbertrand22/habit-tracker'
    },
    {
      technologies: ['Flask', 'Docker', 'Kubernetes', 'CI/CD'],
      link: 'https://github.com/louisbertrand22/DevOpsTest'
    },
    {
      technologies: ['Flask', 'Python', 'JWT', 'Docker'],
      link: 'https://github.com/louisbertrand22/FlashCards'
    }
  ]



  const skills = [
    'JavaScript/TypeScript',
    'React',
    'Node.js',
    'HTML5 & CSS3',
    'Git & GitHub',
    'Responsive Design',
    'REST APIs',
    'Agile/Scrum',
    'PostgreSQL',
    'JWT',
    'FastAPI',
    'Docker',
    'CI/CD'
  ]

  return (
    <div className="app">
      <header className="header">
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
                ☰
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
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                {t.hero.greeting} <span className="highlight">{t.hero.name}</span>
              </h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>
              <p className="hero-description">
                {t.hero.description}
              </p>
              <div className="hero-buttons">
                <a href="#projects" className="btn btn-primary">{t.hero.viewWork}</a>
                <a href="#contact" className="btn btn-secondary">{t.hero.getInTouch}</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2 className="section-title">{t.about.title}</h2>
            <div className="about-content">
              <p>
                {t.about.paragraph1}
              </p>
              <p>
                {t.about.paragraph2}
              </p>
            </div>
          </div>
        </section>

        <section id="education" className="education">
          <div className="container">
            <h2 className="section-title">{t.education.title}</h2>
            <div className="education-grid">
              {t.education.items.map((edu, index) => (
                <div key={index} className="education-card">
                  {edu.logo && (
                    <div className="education-logo">
                      <img src={edu.logo} alt={`${edu.school} logo`} />
                    </div>
                  )}
                  <h3 className="education-school">{edu.school}</h3>
                  <p className="education-degree">{edu.degree}</p>
                  <p className="education-period">{edu.period}</p>
                  <p className="education-description">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="experience">
          <div className="container">
            <h2 className="section-title">{t.experience.title}</h2>
            <div className="experience-grid">
              {t.experience.items.map((exp, index) => (
                <div key={index} className="experience-card">
                  {exp.logo && (
                    <div className="experience-logo">
                      <img src={exp.logo} alt={`${exp.company} logo`} />
                    </div>
                  )}
                  <h3 className="experience-position">{exp.position}</h3>
                  <p className="experience-company">{exp.company}</p>
                  <p className="experience-type">{exp.type}</p>
                  <p className="experience-period">{exp.period}</p>
                  <p className="experience-location">{exp.location}</p>
                  <p className="experience-description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title">{t.projects.title}</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="project-card"
                  onClick={() => openProjectModal(index)}
                  style={{ cursor: 'pointer' }}
                >
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
            <h2 className="section-title">{t.skills.title}</h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-card">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">{t.contact.title}</h2>
            <div className="contact-content">
              <p>
                {t.contact.description}
              </p>
              <div className="contact-links">
                <a href="mailto:louisbert91@gmail.com" className="contact-link">
                  📧 Email
                </a>
                <a href="https://github.com/louisbertrand22/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  💻 GitHub
                </a>
                <a href="https://www.linkedin.com/in/louis-bertrand222" target="_blank" rel="noopener noreferrer" className="contact-link">
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
              <div className="modal-loading">Loading README...</div>
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
