import {
  siTypescript, siPython, siCplusplus, siOpenjdk, siReact, siNodedotjs, siFastapi, siDjango,
  siPostgresql, siDocker, siKubernetes, siHelm, siArgo, siTerraform, siOpenstack, siCilium,
  siKeycloak, siGit, siGithubactions,
} from 'simple-icons'
import { Cloud, Database, Braces, Repeat, Sparkles, type LucideIcon } from 'lucide-react'

const brand: Record<string, { path: string }> = {
  'TypeScript / JS': siTypescript,
  Python: siPython,
  'C++': siCplusplus,
  Java: siOpenjdk,
  React: siReact,
  'Node.js': siNodedotjs,
  FastAPI: siFastapi,
  Django: siDjango,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  Helm: siHelm,
  ArgoCD: siArgo,
  'CI/CD': siGithubactions,
  Terraform: siTerraform,
  OpenStack: siOpenstack,
  Cilium: siCilium,
  Keycloak: siKeycloak,
  Git: siGit,
}

const generic: Record<string, LucideIcon> = {
  AWS: Cloud,
  SQL: Database,
  'REST APIs': Braces,
  'Agile / Scrum': Repeat,
  'IA / Prompt Engineering': Sparkles,
}

export default function SkillIcon({ name }: { name: string }) {
  const b = brand[name]
  if (b) {
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d={b.path} fill="currentColor" />
      </svg>
    )
  }
  const Icon = generic[name]
  return Icon ? <Icon className="skill-icon" strokeWidth={2} aria-hidden="true" /> : null
}
