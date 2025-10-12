import { useState, useEffect } from 'react'
import './App.css'
import { translations, Language } from './translations'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language')
    return (savedLanguage === 'en' || savedLanguage === 'fr') ? savedLanguage : 'en'
  })

  const t = translations[language]

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en')
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
      technologies: ['Python', 'OCR', 'Computer Vision'],
      link: 'https://github.com/louisbertrand22/sudoku-ocr'
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
    'Agile/Scrum'
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
                  <h3 className="education-school">{edu.school}</h3>
                  <p className="education-degree">{edu.degree}</p>
                  <p className="education-period">{edu.period}</p>
                  <p className="education-description">{edu.description}</p>
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
                <div key={index} className="project-card">
                  <h3 className="project-title">{t.projects.items[index].title}</h3>
                  <p className="project-description">{t.projects.items[index].description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a href={project.link} className="project-link">{t.projects.viewProject}</a>
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
                <a href="mailto:contact@example.com" className="contact-link">
                  {t.contact.email}
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                  {t.contact.github}
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
    </div>
  )
}

export default App
