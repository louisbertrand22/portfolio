# Deployment Guide

This document provides detailed instructions for deploying your portfolio website to various platforms.

## Table of Contents

- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Docker (Self-Hosted)](#docker-self-hosted)
- [Other Platforms](#other-platforms)

## GitHub Pages

GitHub Pages is a free hosting service provided by GitHub, perfect for static websites and portfolios.

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys your site whenever you push to the `main` branch. The site is configured to use the custom domain **portfolio.lucho-dev.xyz**.

**Setup Steps:**

1. **First-time setup:**
   - Go to your repository on GitHub
   - Click on "Settings" → "Pages"
   - Under "Build and deployment", select **"GitHub Actions"** as the source
   - Save your changes
   
   > **Note:** If you push to the `main` branch before configuring this setting, the deployment may fail with a "Not Found" error. Simply enable GitHub Actions as the source in Settings → Pages, then push again or manually re-run the failed workflow.

2. **Configure custom domain (if using a custom domain):**
   - In Settings → Pages, under "Custom domain", enter your domain (e.g., `portfolio.lucho-dev.xyz`)
   - A CNAME file is already included in the repository at `public/CNAME`
   - Configure DNS settings with your domain provider:
     - **Option 1 (A records):** Add A records pointing to GitHub Pages IP addresses:
       - 185.199.108.153
       - 185.199.109.153
       - 185.199.110.153
       - 185.199.111.153
     - **Option 2 (CNAME):** Add a CNAME record pointing to `<username>.github.io`
   - Enable "Enforce HTTPS" after DNS propagates (recommended)

3. **Push to main branch:**
   ```bash
   git push origin main
   ```

4. **Monitor deployment:**
   - Go to the "Actions" tab in your repository
   - You'll see the "Deploy to GitHub Pages" workflow running
   - Once complete (usually 1-2 minutes), your site will be live

5. **Access your site:**
   - With custom domain: `https://portfolio.lucho-dev.xyz/`
   - Without custom domain: `https://<username>.github.io/portfolio/`
   - Replace `<username>` with your GitHub username

**Important:** This repository includes a `.nojekyll` file in the `public/` folder that is automatically copied to the deployment. This file prevents GitHub Pages from using Jekyll processing, which is essential for single-page applications to work correctly.

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the site
npm run build

# The built files will be in the dist/ directory
# You can manually upload these to GitHub Pages or use gh-pages package
```

### Switching Between Custom Domain and GitHub Pages Subdirectory

**For custom domain deployment (current setup):**
- The site uses root path `/`
- CNAME file contains your custom domain
- Build command: `npm run build`

**For GitHub Pages subdirectory (e.g., username.github.io/portfolio/):**
- Remove the CNAME file from `public/` directory
- Update `.github/workflows/deploy.yml` build command to: `npm run build -- --mode github-pages`
- This will use `/portfolio/` as the base path

## Vercel

Vercel is a cloud platform optimized for frontend frameworks and static sites.

### Quick Deploy

Click this button to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/louisbertrand22/portfolio)

### Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your portfolio repository
5. Vercel will automatically detect the settings from `vercel.json`
6. Click "Deploy"

Your site will be available at a Vercel domain (e.g., `portfolio-username.vercel.app`)

## Netlify

Netlify is another excellent platform for deploying static sites and frontend applications.

### Quick Deploy

Click this button to deploy directly:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/louisbertrand22/portfolio)

### Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy for testing:**
   ```bash
   netlify deploy
   ```

4. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

### Using Netlify Dashboard

1. Go to [netlify.com](https://www.netlify.com)
2. Sign in with your GitHub account
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your portfolio repository
5. Netlify will automatically detect the settings from `netlify.toml`
6. Click "Deploy site"

Your site will be available at a Netlify domain (e.g., `portfolio-username.netlify.app`)

### Custom Domain

Both Vercel and Netlify support custom domains:
- In the platform's dashboard, go to your project settings
- Find the "Domains" section
- Add your custom domain and follow the DNS configuration instructions

## Docker (Self-Hosted)

Deploy your portfolio on any server or cloud platform using Docker.

### Prerequisites

- Docker installed on your server
- (Optional) Docker Compose

### Using Docker Compose (Recommended)

1. **Clone your repository on the server:**
   ```bash
   git clone https://github.com/<username>/portfolio.git
   cd portfolio
   ```

2. **Start the application:**
   ```bash
   docker compose up -d
   ```

3. **Access your site:**
   - The site will be available at `http://your-server-ip:3000`

4. **View logs:**
   ```bash
   docker compose logs -f
   ```

5. **Stop the application:**
   ```bash
   docker compose down
   ```

### Using Docker Directly

1. **Build the Docker image:**
   ```bash
   docker build -t portfolio .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 80:80 --name portfolio-app portfolio
   ```

3. **Access your site:**
   - The site will be available at `http://your-server-ip`

4. **View logs:**
   ```bash
   docker logs -f portfolio-app
   ```

5. **Stop and remove the container:**
   ```bash
   docker stop portfolio-app
   docker rm portfolio-app
   ```

### Docker on Cloud Platforms

The Docker setup works on various cloud platforms:

- **AWS**: Use ECS, EKS, or EC2 with Docker
- **Google Cloud**: Use Cloud Run, GKE, or Compute Engine
- **Azure**: Use Container Instances, AKS, or VMs
- **DigitalOcean**: Use App Platform or Droplets
- **Heroku**: Use Container Registry

## Other Platforms

This portfolio can be deployed to many other platforms:

### Render

1. Go to [render.com](https://render.com)
2. Create a new "Static Site"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy

### Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set build output directory: `dist`
5. Deploy

### Firebase Hosting

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
   - Select `dist` as the public directory
   - Configure as single-page app: Yes
4. Deploy: `firebase deploy`

### Surge

1. Install Surge: `npm i -g surge`
2. Build your site: `npm run build`
3. Deploy: `surge dist`

## Configuration Notes

### Base Path

The application is configured to work correctly on different platforms:

- **GitHub Pages with custom domain**: Uses `/` as the base path (current setup for portfolio.lucho-dev.xyz)
- **GitHub Pages without custom domain**: Uses `/portfolio/` as the base path (configured via `--mode github-pages`)
- **Vercel/Netlify/Docker**: Uses `/` as the base path (default)

To switch between custom domain and subdirectory:
- **For custom domain**: Use `npm run build` (base path: `/`)
- **For subdirectory**: Use `npm run build -- --mode github-pages` (base path: `/portfolio/`)

### Environment Variables

This portfolio doesn't require environment variables for basic deployment. If you add features that need them (e.g., API keys), set them in your platform's dashboard:

- **GitHub Pages**: Use repository secrets
- **Vercel/Netlify**: Use environment variables in project settings
- **Docker**: Use environment variables in `docker-compose.yml` or pass with `-e`

## Troubleshooting

### Custom Domain Not Working

**Symptom**: Your custom domain doesn't load the site or shows a 404 error.

**Solution**:
1. Verify DNS settings with your domain provider:
   - Check that A records or CNAME record are correctly configured
   - Use `dig` or `nslookup` to verify DNS propagation: `dig portfolio.lucho-dev.xyz`
2. In GitHub repository Settings → Pages:
   - Ensure "Custom domain" is set to your domain (e.g., `portfolio.lucho-dev.xyz`)
   - Wait for the DNS check to complete (green checkmark)
   - Enable "Enforce HTTPS" once DNS is verified
3. Verify the CNAME file exists:
   - Check `public/CNAME` contains your domain
   - After deployment, verify `dist/CNAME` also contains it
4. Wait for DNS propagation (can take up to 24-48 hours)

### ERR_ABORTED 404 /src/main.tsx Error

**Symptom**: You see an error like `GET https://portfolio.lucho-dev.xyz/src/main.tsx net::ERR_ABORTED 404 (Not Found)` in your browser console.

**Cause**: This happens when the site is built with the wrong base path or accessed during deployment.

**Solution**: 
- Wait a few minutes for deployment to complete
- Clear browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)
- Verify the build used the correct base path in the workflow logs
- Check that index.html in the deployed site references `/assets/*.js` (not `/portfolio/assets/*.js`)

### GitHub Pages Configuration Error

If you get a "Not Found" or "404" error during the deployment:
- **Cause**: GitHub Pages is not yet configured in your repository settings
- **Solution**: 
  1. Go to Settings → Pages in your repository
  2. Under "Build and deployment", select "GitHub Actions" as the source
  3. Save your changes
  4. Either push to main branch again, or go to Actions tab and manually re-run the failed workflow
- **Note**: The workflow has the required permissions already configured, so no additional permission changes are needed

### GitHub Pages 404 Error

If you get a 404 error on GitHub Pages after successful deployment:
- Check that the workflow completed successfully in the Actions tab
- Wait a few minutes for DNS to propagate (especially for custom domains)
- **For custom domain setup**:
  - Verify the correct URL: `https://portfolio.lucho-dev.xyz/`
  - Check DNS configuration in your domain provider
  - Ensure custom domain is configured in Settings → Pages
- **For standard GitHub Pages**:
  - Verify the correct URL format: `https://<username>.github.io/portfolio/`
  - If using subdirectory, ensure build command includes `--mode github-pages`
- Ensure the `.nojekyll` file exists in the `public/` folder (it's automatically copied to `dist/` during build)
  - This file prevents GitHub Pages from processing the site with Jekyll, which can cause 404 errors for single-page applications
  - The file should be empty and is already included in this repository

### Build Failures

If deployment fails during the build step:
- Check the build logs in your platform's dashboard or Actions tab
- Ensure all dependencies are listed in `package.json`
- Try building locally with `npm run build` to reproduce the error

### Routing Issues

For single-page applications, you may need to configure redirects:
- **Vercel/Netlify**: Already configured in `vercel.json` and `netlify.toml`
- **Other platforms**: Add a `_redirects` file or configure in the platform dashboard

## Support

If you encounter issues:
1. Check the platform's documentation
2. Review the deployment logs for error messages
3. Search for similar issues on GitHub or Stack Overflow
4. Open an issue in the repository

## Summary

This portfolio is designed to be easily deployed to multiple platforms:

- **Easiest**: GitHub Pages (automatic deployment included)
- **Best for production**: Vercel or Netlify (automatic SSL, CDN, custom domains)
- **Most control**: Docker on your own server or cloud platform

Choose the platform that best fits your needs and follow the instructions above. Happy deploying! 🚀
