import { Translations } from '../translations'

interface SkillsProps {
  t: Translations
  skills: string[]
}

export function Skills({ t, skills }: SkillsProps) {
  return (
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
  )
}
