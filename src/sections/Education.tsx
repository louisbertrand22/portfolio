import { Translations } from '../translations'

interface EducationProps {
  t: Translations
}

export function Education({ t }: EducationProps) {
  return (
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
  )
}
