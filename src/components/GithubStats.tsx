import { useEffect, useState } from 'react'
import type { Language } from '@/translations'

const GITHUB_USERNAME = 'louisbertrand22'
const CACHE_KEY = 'gh-stats-cache-v1'
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6h — keeps repeat visits from re-hitting the unauthenticated rate limit

// Official per-language colors (same convention GitHub itself uses for repo language dots).
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Java: '#b07219',
  Dockerfile: '#384d54',
  Vue: '#41b883',
}
const FALLBACK_LANGUAGE_COLOR = '#8b98a5'

interface LanguageStat { name: string; pct: number; color: string }
interface ContributionDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
interface GithubStatsData {
  totalContributions: number
  contributions: ContributionDay[]
  languages: LanguageStat[]
}

function readCache(): GithubStatsData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data as GithubStatsData
  } catch { return null }
}

function writeCache(data: GithubStatsData) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch { /* unavailable */ }
}

async function loadGithubStats(): Promise<GithubStatsData> {
  const [reposRes, contribRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`),
  ])
  if (!reposRes.ok || !contribRes.ok) throw new Error('GitHub fetch failed')

  const repos: { language: string | null; fork: boolean }[] = await reposRes.json()
  const contrib: { total: Record<string, number>; contributions: { date: string; count: number; level: number }[] } = await contribRes.json()

  // Weighted by repo count rather than raw byte size: a single repo with a large
  // committed asset (docs, fixtures…) would otherwise dominate the distribution.
  const reposByLanguage = new Map<string, number>()
  repos.filter(r => !r.fork && r.language).forEach(r => {
    reposByLanguage.set(r.language as string, (reposByLanguage.get(r.language as string) ?? 0) + 1)
  })
  const totalRepos = [...reposByLanguage.values()].reduce((a, b) => a + b, 0) || 1
  const languages: LanguageStat[] = [...reposByLanguage.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      pct: Math.round((count / totalRepos) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? FALLBACK_LANGUAGE_COLOR,
    }))

  const totalContributions = contrib.total?.lastYear
    ?? contrib.contributions.reduce((sum, d) => sum + d.count, 0)

  return {
    totalContributions,
    contributions: contrib.contributions.map(d => ({ date: d.date, count: d.count, level: d.level as 0 | 1 | 2 | 3 | 4 })),
    languages,
  }
}

// Chronological days → GitHub-style columns of 7 (Sun–Sat), padded to align on week boundaries.
function groupByWeek(days: ContributionDay[]): (ContributionDay | null)[][] {
  const weeks: (ContributionDay | null)[][] = []
  let week: (ContributionDay | null)[] = []
  days.forEach((day, i) => {
    const dow = new Date(`${day.date}T00:00:00`).getDay()
    if (i === 0) {
      for (let k = 0; k < dow; k++) week.push(null)
    }
    week.push(day)
    if (dow === 6 || i === days.length - 1) {
      weeks.push(week)
      week = []
    }
  })
  return weeks
}

const MONTH_NAMES: Record<Language, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
}

interface GithubStatsProps {
  language: Language
  labels: {
    loading: string
    contributionsLabel: string
    less: string
    more: string
    viewProfile: string
  }
}

export default function GithubStats({ language, labels }: GithubStatsProps) {
  const [data, setData] = useState<GithubStatsData | null>(() => readCache())
  const [error, setError] = useState(false)

  useEffect(() => {
    if (data) return
    loadGithubStats().then(d => { setData(d); writeCache(d) }).catch(() => setError(true))
  }, [data])

  if (error) return null

  if (!data) {
    return (
      <div className="modal-loading">
        <div className="loading-spinner" />{labels.loading}
      </div>
    )
  }

  const weeks = groupByWeek(data.contributions)
  const monthNames = MONTH_NAMES[language]
  let lastMonth = -1

  return (
    <div className="github-stats">
      <div className="github-summary">
        <span className="github-summary-count">
          {data.totalContributions.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
        </span>
        <span className="github-summary-label">{labels.contributionsLabel}</span>
      </div>

      <div className="github-heatmap-wrap">
        <div className="github-heatmap-scroll">
          <div className="github-heatmap-months" aria-hidden="true">
            {weeks.map((week, wi) => {
              const firstDay = week.find(d => d !== null)
              if (!firstDay) return <span key={wi} className="github-heatmap-month" />
              const month = new Date(`${firstDay.date}T00:00:00`).getMonth()
              const show = month !== lastMonth
              if (show) lastMonth = month
              return <span key={wi} className="github-heatmap-month">{show ? monthNames[month] : ''}</span>
            })}
          </div>
          <div className="github-heatmap-grid">
            {weeks.map((week, wi) => (
              <div className="github-heatmap-col" key={wi}>
                {week.map((day, di) => day ? (
                  <div
                    key={di}
                    className={`github-cell level-${day.level}`}
                    title={`${day.count} · ${day.date}`}
                  />
                ) : <div key={di} className="github-cell empty" aria-hidden="true" />)}
              </div>
            ))}
          </div>
        </div>
        <div className="github-heatmap-legend">
          <span>{labels.less}</span>
          {([0, 1, 2, 3, 4] as const).map(l => (
            <span key={l} className={`github-cell level-${l}`} />
          ))}
          <span>{labels.more}</span>
        </div>
      </div>

      {data.languages.length > 0 && (
        <div className="github-languages">
          <div className="github-languages-bar">
            {data.languages.map(l => (
              <span key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
            ))}
          </div>
          <div className="github-languages-legend">
            {data.languages.map(l => (
              <div key={l.name} className="github-language-item">
                <span className="github-language-dot" style={{ background: l.color }} />
                <span className="github-language-name">{l.name}</span>
                <span className="github-language-pct">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="github-stats-link"
      >
        {labels.viewProfile}
      </a>
    </div>
  )
}
