import { Translations } from '../translations'

interface AboutProps {
  t: Translations
}

export function About({ t }: AboutProps) {
  return (
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
  )
}
