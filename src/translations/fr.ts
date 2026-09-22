export const fr = {
  nav: {
    logo: 'LB - Software engineer',
    home: 'Accueil',
    about: 'À propos',
    education: 'Formation',
    experience: 'Expérience',
    projects: 'Projets',
    sigl: 'SIGL',
    skills: 'Compétences',
    github: 'GitHub',
    hobbies: 'Hobbies',
    cv: 'CV',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    name: 'Louis BERTRAND',
    subtitle: 'IT Strategy & Architecture · Cloud & Software Engineering',
    description: 'Étudiant ingénieur à l\'EPITA (majeure SIGL) et développeur full-stack, je conçois des produits robustes du backend au frontend avec React, TypeScript, Python ou Go. Architecture logicielle, cloud et DevOps au service de solutions pensées pour durer.',
    viewWork: 'Voir Mes Projets',
    getInTouch: 'Me Contacter',
  },
  about: {
    title: 'À Propos de Moi',
    paragraph1: "Étudiant ingénieur à l'EPITA en majeure SIGL (Systèmes d'Information et Génie Logiciel), je conçois des applications robustes et scalables, d'une architecture backend solide à des interfaces frontend soignées. En stage chez Quanteam, j'ai conçu et développé de bout en bout Leonard-AI, un chatbot interne déployé pour plus de 200 collaborateurs, avec un environnement Kubernetes créé de zéro pour l'industrialiser ; au Ministère de l'Éducation nationale, je conçois aujourd'hui une architecture réseau Zero Trust avec Cilium et sécurise le cycle de déploiement de plusieurs applications critiques.",
    paragraph2: "Curieux et autonome, j'aime explorer de nouvelles technologies à travers des projets personnels - du DevOps à l'intelligence artificielle - et transformer des idées en produits concrets, du backend au frontend.",
  },
  education: {
    title: 'Formation',
    items: [
      {
        school: 'EPITA: École d\'Ingénieurs en Informatique',
        degree: 'Diplôme d\'ingénieur',
        period: 'Sept. 2022 - Juil. 2027',
        description: 'Diplôme d\'ingénieur en informatique - Majeure Systèmes d\'Information et Génie Logiciel (SIGL) · TOEIC 845',
        logo: 'Epitalogo.png',
      },
      {
        school: 'Univerzita Hradec Králové',
        degree: 'Informatique',
        period: 'Fév. 2024 - Juin 2024',
        description: 'Programme d\'échange Erasmus',
        logo: 'UHK_logo.png',
      },
    ],
  },
  experience: {
    title: 'Expérience Professionnelle',
    items: [
      {
        position: 'Responsable Sécurité Infrastructure',
        company: 'Ministère de l\'Éducation nationale',
        type: 'Temps partiel',
        period: 'Fév. 2026 - Jan. 2027',
        location: 'Paris, Île-de-France, France',
        description: 'Sécurisation du réseau et du cycle de déploiement du parc applicatif, en temps partiel en parallèle des cours. Mise en place d\'une architecture Zero Trust avec Cilium via une stratégie hybride : règles "Default Deny" déployées globalement depuis les templates, et autorisations décentralisées directement dans les charts applicatifs. Sécurisation du cycle de déploiement en approche GitOps (ArgoCD) et intégration du scanner Renovate sur 4 dépôts majeurs, avec ouverture automatique des merge requests de mise à jour : les équipes passent d\'audits manuels ponctuels à un contrôle continu de la dette de sécurité.',
        logo: 'education-nationale-logo.svg',
      },
      {
        position: 'Développeur FullStack',
        company: 'QUANTEAM (Groupe RAINBOW PARTNERS)',
        type: 'Stage',
        period: 'Sept. 2025 - Jan. 2026',
        location: 'Neuilly-sur-Seine, Île-de-France, France',
        description: 'Conception et développement de bout en bout de Leonard-AI, un chatbot interne au service de plus de 200 collaborateurs, qui automatise les tâches répétitives des fonctions support : paie, ressources humaines et business managers. Réalisation de l\'architecture applicative complète — APIs asynchrones en FastAPI et Django — et industrialisation du déploiement sur un nouvel environnement Kubernetes mis en place à cette occasion. L\'outil décharge les équipes support des sollicitations récurrentes à faible valeur ajoutée et leur rend du temps pour leurs missions de fond.',
        logo: 'QuanteamLogo169.jpeg',
      },
    ],
  },
  projects: {
    title: 'Projets en Vedette',
    viewProject: 'Voir le Projet →',
    viewReadme: 'Voir le README →',
    viewDetails: 'Voir les détails →',
    privateRepo: 'Dépôt privé',
    privateNote: 'Le code source est privé — je peux le partager ou vous en faire une démo sur demande.',
    items: [
      {
        title: 'FootySim',
        description: 'Simulateur de championnat de football avec ORM SQLAlchemy et opérations de base de données asynchrones',
      },
      {
        title: 'FootySim Backend',
        description: 'API REST backend construite avec FastAPI et SQLAlchemy asynchrone pour la simulation de championnat de football',
      },
      {
        title: 'DevOpsTest',
        description: 'Application web Flask démontrant les pratiques DevOps avec la conteneurisation Docker, l\'orchestration Kubernetes et un pipeline CI/CD automatisé utilisant GitHub Actions',
      },
      {
        title: 'MySSO',
        description: 'Implémentation SSO personnalisée avec support OpenID Connect et OAuth2, PKCE, gestion du consentement utilisateur et signature JWT RSA',
      },
      {
        title: '42sh',
        description: 'Réimplémentation d\'un shell conforme POSIX en C99 dans le cadre du cursus systèmes d\'EPITA, avec builtins personnalisés exécutés sans fork/exec, build Autotools et suite de tests complète',
      },
      {
        title: 'MiniShell_Rust',
        description: 'Réimplémentation d\'un shell Unix en Rust, avec pipes, redirections d\'entrées/sorties, contrôle des jobs et commandes intégrées, développée en mettant l\'accent sur la sécurité mémoire et une gestion d\'erreurs idiomatique',
      },
    ],
  },
  siglProjects: {
    title: 'EPITA - Projets SIGL',
    subtitle: 'Projets académiques réalisés en groupe dans le cadre de la majeure SIGL (Systèmes d\'Information et Génie Logiciel)',
    items: [
      {
        title: 'Urbanisation des SI',
        description: 'Refonte complète du système d\'information d\'une compagnie aérienne, menée à environ 50 étudiants organisés en équipes applicatives — SAV, Enregistrement, Booking, E-commerce, Fidélité, Suivi de vol et Planification — appuyées par une équipe Socle (infrastructure) et une équipe DevOps, dont je faisais partie. Au sein de l\'équipe DevOps, j\'ai contribué à l\'outillage, aux chaînes CI/CD et aux environnements de déploiement au service de l\'ensemble des équipes applicatives.',
      },
      {
        title: 'Architecture Cloud Hybride Résiliente',
        description: 'Déploiement d\'une infrastructure cloud privée résiliente sous OpenStack, étendue dynamiquement par des services PaaS publics AWS pour allier souveraineté et flexibilité. Automatisation complète du provisionnement des ressources de calcul et de la gestion du stockage distribué (Patroni) via des scripts Terraform en approche multi-provider.',
      },
      {
        title: 'Transformation SIRH — Maîtrise d\'Ouvrage',
        description: 'Chef de projet d\'une équipe de 6 étudiants sur une mission de conseil MOA pour BeBlood, groupe de biologie médicale de 12 000 collaborateurs dans 5 pays européens : élaboration d\'une stratégie de transformation du SIRH sur 3 ans, articulée autour d\'Oracle HCM, incluant l\'analyse des besoins et la modélisation financière (ROI). Ce projet m\'a permis de développer mes compétences en pilotage d\'équipe projet, en gestion des parties prenantes et en communication avec un décideur DSI en contexte réel.',
      },
      {
        title: 'Schéma Directeur SI & Fusion-Acquisition',
        description: 'Élaboration du schéma directeur du système d\'information d\'un groupe logistique dans le cadre d\'une fusion : cartographie de l\'existant, définition de la cible et estimation des budgets. Le projet a aussi couvert la gestion des risques, avec l\'élaboration de plans de continuité d\'activité et la mise en conformité avec les standards de cybersécurité et de protection des données (NIS2).',
      },
    ],
  },
  skills: {
    title: 'Compétences & Technologies',
  },
  github: {
    title: 'Activité GitHub',
    subtitle: 'Un aperçu en direct de mon historique de contributions et des langages les plus utilisés.',
    loading: 'Chargement de l\'activité GitHub…',
    contributionsLabel: 'contributions sur la dernière année',
    less: 'Moins',
    more: 'Plus',
    viewProfile: 'Voir le profil GitHub',
  },
  hobbies: {
    title: 'Hobbies & Passions',
    items: [
      {
        title: 'Guitare',
        description: 'Près de 10 ans de cours au conservatoire — la musique fait partie de mon quotidien.',
      },
      {
        title: 'Course à pied',
        description: 'Je cours régulièrement : un bon moyen de garder le rythme et de me vider la tête.',
      },
      {
        title: 'Football',
        description: 'Je joue régulièrement entre amis — le même esprit d\'équipe sur le terrain qu\'au travail.',
      },
      {
        title: 'Formule 1',
        description: 'Grand fan de Red Bull Racing : je ne rate aucun Grand Prix, entre stratégie de course et passion pour la vitesse.',
      },
    ],
  },
  cv: {
    title: 'Mon CV',
    description: 'Envie d\'en savoir plus sur mon parcours ? Téléchargez mon CV au format PDF.',
    download: 'Télécharger mon CV',
  },
  contact: {
    title: 'Me Contacter',
    description: "Je suis toujours ouvert à discuter de nouveaux projets, d'idées créatives ou d'opportunités de faire partie de votre vision.",
    email: '📧 Email',
    github: '💻 GitHub',
    linkedin: '💼 LinkedIn',
    emailCopied: 'Email copié !',
  },
  footer: {
    copyright: '© 2026 Louis BERTRAND.',
  },
}
