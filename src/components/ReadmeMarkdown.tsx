import { Children, isValidElement, type ReactNode } from 'react'
import Markdown, { type Components } from 'react-markdown'

// Heading ids are prefixed so they can't collide with the page's own section ids
const ID_PREFIX = 'readme-'

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map(child => {
      if (typeof child === 'string' || typeof child === 'number') return String(child)
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children)
      return ''
    })
    .join('')
}

// Same slugs as GitHub, so a README's own table of contents (`#installation`) keeps working
function slugify(text: string) {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-')
}

/**
 * Renders a GitHub README fetched from the API. Relative links and images
 * point inside the repo, so they are rewritten against GitHub instead of
 * resolving (and 404ing) on the portfolio's own domain.
 */
export default function ReadmeMarkdown({ content, repo }: { content: string; repo: string }) {
  const resolve = (url: string, base: string) =>
    /^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(url) ? url : new URL(url.replace(/^\//, ''), base).href

  const blobBase = `https://github.com/${repo}/blob/HEAD/`
  const rawBase = `https://raw.githubusercontent.com/${repo}/HEAD/`

  // GitHub suffixes repeated headings with -1, -2…
  const seen = new Map<string, number>()
  const headingId = (children: ReactNode) => {
    const slug = slugify(textOf(children))
    const n = seen.get(slug) ?? 0
    seen.set(slug, n + 1)
    return ID_PREFIX + (n ? `${slug}-${n}` : slug)
  }

  const heading = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): Components[typeof Tag] =>
    ({ children }) => <Tag id={headingId(children)}>{children}</Tag>

  return (
    <Markdown
      components={{
        h1: heading('h1'), h2: heading('h2'), h3: heading('h3'),
        h4: heading('h4'), h5: heading('h5'), h6: heading('h6'),
        a: ({ href, children }) => {
          if (href?.startsWith('#')) {
            const id = ID_PREFIX + decodeURIComponent(href.slice(1))
            return (
              <a
                href={href}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                {children}
              </a>
            )
          }
          return (
            <a href={href ? resolve(href, blobBase) : href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        },
        img: ({ src, alt }) => (
          <img src={typeof src === 'string' ? resolve(src, rawBase) : undefined} alt={alt ?? ''} loading="lazy" />
        ),
      }}
    >
      {content}
    </Markdown>
  )
}
