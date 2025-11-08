# Portfolio Website

[![CI](https://github.com/louisbertrand22/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/louisbertrand22/portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/louisbertrand22/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/louisbertrand22/portfolio/actions/workflows/deploy.yml)

A modern, responsive portfolio website built with React, TypeScript, and Vite.

> **🌐 Live Site:** https://portfolio.lucho-dev.xyz/

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
- OR Docker and Docker Compose (for containerized deployment)

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

### Docker

#### Using Docker Compose (Recommended)

The easiest way to run the application with Docker:

```bash
docker compose up -d
```

The site will be available at `http://localhost:3000/`

To stop the application:
```bash
docker compose down
```

#### Using Docker Directly

Build the Docker image:
```bash
docker build -t portfolio .
```

Run the container:
```bash
docker run -d -p 3000:80 --name portfolio-app portfolio
```

The site will be available at `http://localhost:3000/`

To stop and remove the container:
```bash
docker stop portfolio-app
docker rm portfolio-app
```

## Deployment

This portfolio can be deployed to various platforms.

📖 **[Quick Deploy Guide](./.github/QUICK_DEPLOY.md)** | **[Platform Comparison](./.github/DEPLOYMENT_OPTIONS.md)** | **[Full Documentation](./DEPLOYMENT.md)**

### Quick Deploy

Choose your preferred platform:

### GitHub Pages (Automated)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch. The site is configured to use the custom domain **portfolio.lucho-dev.xyz**.

**Setup:**
1. Enable GitHub Pages in repository settings (one-time setup):
   - Go to Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
2. Configure custom domain in repository settings:
   - In Settings → Pages, under "Custom domain", the domain `portfolio.lucho-dev.xyz` is configured
   - The CNAME file is included in the repository and will be automatically deployed
3. Configure DNS for your domain (one-time setup):
   - Add an A record pointing to GitHub Pages IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add a CNAME record pointing to `louisbertrand22.github.io`
4. Push to the `main` branch
5. Check the "Actions" tab to monitor the deployment

> **Note:** If you push before configuring GitHub Pages, the deployment will fail with a "Not Found" error. Simply enable "GitHub Actions" as the source in Settings → Pages, then push again or re-run the workflow.

**The site will be available at:** `https://portfolio.lucho-dev.xyz/`

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/louisbertrand22/portfolio)

**Manual deployment:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

The `vercel.json` configuration file is already included.

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/louisbertrand22/portfolio)

**Manual deployment:**
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run `netlify deploy --prod` in the project directory
3. Follow the prompts to deploy

The `netlify.toml` configuration file is already included.

### Docker Deployment

For production deployment using Docker on any cloud provider (AWS, GCP, Azure, DigitalOcean, etc.):

```bash
# Build the image
docker build -t portfolio .

# Run the container
docker run -d -p 80:80 --name portfolio portfolio
```

Or use Docker Compose:
```bash
docker compose up -d
```

> **📖 For detailed deployment instructions, troubleshooting, and more platforms (Render, Cloudflare Pages, Firebase, etc.), see [DEPLOYMENT.md](./DEPLOYMENT.md)**

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
