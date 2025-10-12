import { useState } from 'react'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const projects = [
    {
      title: 'Project One',
      description: 'A modern web application built with React and TypeScript',
      technologies: ['React', 'TypeScript', 'Vite'],
      link: '#'
    },
    {
      title: 'Project Two',
      description: 'Full-stack application with real-time features',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      link: '#'
    },
    {
      title: 'Project Three',
      description: 'Mobile-first responsive website design',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      link: '#'
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
            <div className="logo">Portfolio</div>
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
              <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
              <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a></li>
              <li><a href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a></li>
              <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Hi, I'm <span className="highlight">Louis Bertrand</span>
              </h1>
              <p className="hero-subtitle">Full Stack Developer</p>
              <p className="hero-description">
                I build modern web applications with clean code and great user experiences
              </p>
              <div className="hero-buttons">
                <a href="#projects" className="btn btn-primary">View My Work</a>
                <a href="#contact" className="btn btn-secondary">Get In Touch</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
              <p>
                I'm a passionate full-stack developer with a love for creating elegant solutions
                to complex problems. With expertise in modern web technologies, I specialize in
                building responsive, user-friendly applications that make a difference.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to
                open-source projects, or sharing knowledge with the developer community.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a href={project.link} className="project-link">View Project →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="skills">
          <div className="container">
            <h2 className="section-title">Skills & Technologies</h2>
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
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <p>
                I'm always open to discussing new projects, creative ideas, or opportunities
                to be part of your vision.
              </p>
              <div className="contact-links">
                <a href="mailto:contact@example.com" className="contact-link">
                  📧 Email
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                  💻 GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Louis Bertrand. Built with React & TypeScript.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
