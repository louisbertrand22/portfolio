# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite.

## Features

- 🎨 Modern and clean design with gradient hero section
- 📱 Fully responsive (mobile, tablet, and desktop)
- ⚡ Fast and optimized with Vite
- 🎯 TypeScript for type safety
- 🎭 Smooth animations and transitions
- 🧭 Sticky navigation with mobile hamburger menu
- 📦 Production-ready build configuration

## Sections

- **Hero**: Eye-catching introduction with call-to-action buttons
- **About**: Personal introduction and background
- **Projects**: Showcase of featured projects with technology tags
- **Skills**: Display of technical skills and competencies
- **Contact**: Links to email and social media profiles

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **CSS3** - Modern styling with animations
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/louisbertrand22/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build

Build for production:
```bash
npm run build
```

The production files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Lint

Run ESLint to check code quality:
```bash
npm run lint
```

## Customization

To customize the portfolio for your own use:

1. Update personal information in `src/App.tsx`:
   - Name in the hero section
   - About section text
   - Projects array with your own projects
   - Skills array with your technologies
   - Contact links (email, GitHub, LinkedIn)

2. Modify colors in `src/index.css`:
   - Change CSS variables in `:root` to match your brand

3. Update the page title in `index.html`

## Project Structure

```
portfolio/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## License

MIT

## Author

Louis Bertrand
