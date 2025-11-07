import { Translations } from '../translations'

interface Project {
  technologies: string[]
  link: string
}

interface ProjectsProps {
  t: Translations
  projects: Project[]
  onProjectClick: (index: number) => void
}

export function Projects({ t, projects, onProjectClick }: ProjectsProps) {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t.projects.title}</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card"
              onClick={() => onProjectClick(index)}
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
  )
}
