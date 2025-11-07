import { useState, useEffect } from 'react'
import './App.css'
import { translations, Language } from './translations'
import { Header, Footer, ProjectModal } from './components'
import { Hero, About, Education, Experience, Projects, Skills, Contact } from './sections'

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
      <Header
        t={t}
        language={language}
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        onCloseMenu={() => setIsMenuOpen(false)}
      />

      <main>
        <Hero t={t} />
        <About t={t} />
        <Education t={t} />
        <Experience t={t} />
        <Projects t={t} projects={projects} onProjectClick={openProjectModal} />
        <Skills t={t} skills={skills} />
        <Contact t={t} />
      </main>

      <Footer t={t} />

      {selectedProject !== null && (
        <ProjectModal
          t={t}
          selectedProject={selectedProject}
          readmeContent={readmeContent}
          isLoadingReadme={isLoadingReadme}
          onClose={closeProjectModal}
        />
      )}
    </div>
  )
}

export default App
