import { useReducedMotion } from 'framer-motion'
import ScrollExpand from '@/components/react-bits/ScrollExpand/ScrollExpand'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface ProjectShowcaseProps {
  src: string
  alt: string
  title: string
  label: string
  pitch: string
  cta: string
  site: string
  siteLabel: string
  onOpen: () => void
}

// the capture is landscape: only expand it where the viewport is too
const WIDE_QUERY = '(min-width: 1024px) and (orientation: landscape)'
/**
 * The flagship product's real screenshot grows from a framed card to full bleed as the page
 * scrolls, then its pitch and actions settle on top. Portrait or narrow screens and reduced motion get the
 * settled composition as a static figure, since a desktop capture cropped to portrait says little.
 */
export default function ProjectShowcase({ src, alt, title, label, pitch, cta, site, siteLabel, onOpen }: ProjectShowcaseProps) {
  const wide = useMediaQuery(WIDE_QUERY)
  const reduceMotion = useReducedMotion()

  const caption = (
    <div className="showcase-caption">
      <span className="showcase-label">{label}</span>
      <h3 className="showcase-title">{title}</h3>
      <p className="showcase-pitch">{pitch}</p>
      <div className="showcase-actions">
        <button type="button" className="showcase-cta" onClick={onOpen}>{cta}</button>
        <a className="showcase-site" href={site} target="_blank" rel="noopener noreferrer">{siteLabel}</a>
      </div>
    </div>
  )

  if (!wide || reduceMotion) {
    return (
      <div className="container">
        <figure className="showcase-static">
          <img src={src} alt={alt} loading="lazy" />
          {caption}
        </figure>
      </div>
    )
  }

  return (
    <ScrollExpand
      className="showcase-expand"
      src={src}
      alt={alt}
      useWindowScroll
      startWidth={66}
      startHeight={70}
      startRadius={18}
      endRadius={0}
      mediaZoom={1.12}
      scrollDistance={0.9}
      holdDistance={0.3}
      overlayScrim={1}
    >
      {caption}
    </ScrollExpand>
  )
}
