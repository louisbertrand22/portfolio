import { Translations, Language } from '../translations'

interface HeaderProps {
  t: Translations
  language: Language
  isDarkMode: boolean
  isMenuOpen: boolean
  onToggleLanguage: () => void
  onToggleTheme: () => void
  onToggleMenu: () => void
  onCloseMenu: () => void
}

export function Header({
  t,
  language,
  isDarkMode,
  isMenuOpen,
  onToggleLanguage,
  onToggleTheme,
  onToggleMenu,
  onCloseMenu
}: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">{t.nav.logo}</div>
          <div className="nav-controls">
            <button 
              className="language-toggle"
              onClick={onToggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>
            <button 
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="menu-toggle"
              onClick={onToggleMenu}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={onCloseMenu}>{t.nav.home}</a></li>
            <li><a href="#about" onClick={onCloseMenu}>{t.nav.about}</a></li>
            <li><a href="#education" onClick={onCloseMenu}>{t.nav.education}</a></li>
            <li><a href="#experience" onClick={onCloseMenu}>{t.nav.experience}</a></li>
            <li><a href="#projects" onClick={onCloseMenu}>{t.nav.projects}</a></li>
            <li><a href="#skills" onClick={onCloseMenu}>{t.nav.skills}</a></li>
            <li><a href="#contact" onClick={onCloseMenu}>{t.nav.contact}</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
