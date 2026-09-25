import Markdown from 'react-markdown'

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

  return (
    <Markdown
      components={{
        a: ({ href, children }) => {
          const url = href ? resolve(href, blobBase) : href
          const external = !!url && !url.startsWith('#')
          return (
            <a href={url} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
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
