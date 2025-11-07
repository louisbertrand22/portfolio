import { Translations } from '../translations'

interface ContactProps {
  t: Translations
}

export function Contact({ t }: ContactProps) {
  return (
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
  )
}
