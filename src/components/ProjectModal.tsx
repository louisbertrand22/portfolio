import Markdown from 'react-markdown'
import { Translations } from '../translations'

interface ProjectModalProps {
  t: Translations
  selectedProject: number
  readmeContent: string
  isLoadingReadme: boolean
  onClose: () => void
}

export function ProjectModal({
  t,
  selectedProject,
  readmeContent,
  isLoadingReadme,
  onClose
}: ProjectModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        <h2 className="modal-title">{t.projects.items[selectedProject].title}</h2>
        {isLoadingReadme ? (
          <div className="modal-loading">Loading README...</div>
        ) : (
          <div className="modal-readme">
            <Markdown>{readmeContent}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}
