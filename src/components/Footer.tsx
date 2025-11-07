import { Translations } from '../translations'

interface FooterProps {
  t: Translations
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  )
}
