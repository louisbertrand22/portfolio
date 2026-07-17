export const fr = {
  nav: {
    logo: 'Portfolio',
    home: 'Accueil',
    about: 'À propos',
    education: 'Formation',
    experience: 'Expérience',
    projects: 'Projets',
    sigl: 'SIGL',
    skills: 'Compétences',
    hobbies: 'Hobbies',
    cv: 'CV',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    name: 'Louis Bertrand',
    subtitle: 'Étudiant Ingénieur à l\'EPITA · Développeur Full Stack',
    description: 'Majeure SIGL à l\'EPITA - architecture logicielle, cloud, mobilité et transformation digitale. Je conçois des produits full-stack robustes, du backend au frontend, pensés pour durer.',
    viewWork: 'Voir Mes Projets',
    getInTouch: 'Me Contacter',
  },
  about: {
    title: 'À Propos de Moi',
    paragraph1: "Étudiant ingénieur à l'EPITA en majeure SIGL (Systèmes d'Information et Génie Logiciel), je suis passionné par la conception d'applications robustes et scalables - alliant une architecture backend solide à des interfaces frontend soignées.",
    paragraph2: "Mes projets couvrent le développement web full-stack, l'automatisation DevOps et la conception de systèmes. En dehors des cours, j'aime explorer de nouvelles technologies et mener des projets personnels qui me poussent à progresser.",
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
        position: 'DevOps',
        company: 'Ministère de l\'Éducation nationale',
        type: 'Temps partiel',
        period: 'Fév. 2026 - Jan. 2027',
        location: 'Paris, Île-de-France, France',
        description: 'DevOps responsable de la sécurité de l\'infrastructure, en temps partiel en parallèle des cours : sécurisation et durcissement des environnements Kubernetes et des chaînes de déploiement.',
        logo: 'education-nationale-logo.svg',
      },
      {
        position: 'Développeur Python',
        company: 'QUANTEAM (Groupe RAINBOW PARTNERS)',
        type: 'Stage',
        period: 'Sept. 2025 - Fév. 2026',
        location: 'Neuilly-sur-Seine, Île-de-France, France',
        description: 'Stage sur site',
        logo: 'QuanteamLogo169.jpeg',
      },
    ],
  },
  projects: {
    title: 'Projets en Vedette',
    viewProject: 'Voir le Projet →',
    viewReadme: 'Voir le README →',
    items: [
      {
        title: 'Tableau de Bord F1',
        description: 'Application full-stack affichant des statistiques F1 avec des pratiques DevOps modernes',
      },
      {
        title: 'FootySim',
        description: 'Simulateur de championnat de football avec ORM SQLAlchemy et opérations de base de données asynchrones',
      },
      {
        title: 'FootySim Backend',
        description: 'API REST backend construite avec FastAPI et SQLAlchemy asynchrone pour la simulation de championnat de football',
      },
      {
        title: 'Sudoku OCR',
        description: 'Résolveur de Sudoku en Python utilisant la reconnaissance optique de caractères',
      },
      {
        title: 'DevOpsTest',
        description: 'Application web Flask démontrant les pratiques DevOps avec la conteneurisation Docker, l\'orchestration Kubernetes et un pipeline CI/CD automatisé utilisant GitHub Actions',
      },
      {
        title: 'MySSO',
        description: 'Implémentation SSO personnalisée avec support OpenID Connect et OAuth2, PKCE, gestion du consentement utilisateur et signature JWT RSA',
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
        title: 'Architecture Cloud',
        description: 'Création d\'une infrastructure cloud hybride s\'appuyant sur les technologies OpenStack, complétée par des services PaaS d\'AWS et Microsoft Azure. Le projet couvre la mise en réseau multi-cloud, le provisionnement de ressources de calcul, la gestion du stockage et les configurations haute disponibilité.',
      },
      {
        title: 'Transformation SIRH — Maîtrise d\'Ouvrage',
        description: 'Chef de projet d\'une équipe de 6 étudiants sur une mission de conseil MOA pour BeBlood, groupe de biologie médicale de 12 000 collaborateurs dans 5 pays européens : élaboration d\'une stratégie de transformation du SIRH sur 3 ans, articulée autour d\'Oracle HCM. Ce projet m\'a permis de développer mes compétences en pilotage d\'équipe projet, en analyse de besoins métier complexes, en gestion des parties prenantes et en communication avec un décideur DSI en contexte réel.',
      },
    ],
  },
  skills: {
    title: 'Compétences & Technologies',
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
        title: 'Musculation',
        description: 'Des entraînements fréquents en salle, portés par la discipline et la régularité.',
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
    copyright: '© 2026 Louis Bertrand.',
  },
}
