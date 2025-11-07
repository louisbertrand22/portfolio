import { Translations } from '../translations'

interface ExperienceProps {
  t: Translations
}

export function Experience({ t }: ExperienceProps) {
  return (
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
  )
}
