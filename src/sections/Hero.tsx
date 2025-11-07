import { Translations } from '../translations'

interface HeroProps {
  t: Translations
}

export function Hero({ t }: HeroProps) {
  return (
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
  )
}
