# 🚀 Quick Deploy Reference

## Fastest Options (< 5 minutes)

### Option 1: GitHub Pages (Automatic)
**Best for: Personal portfolios, completely free**

1. Go to repository **Settings** → **Pages**
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `main` branch
4. Done! Your site deploys automatically

🔗 Your site: `https://<username>.github.io/portfolio/`

---

### Option 2: Vercel (One Click)
**Best for: Production sites, excellent performance**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/louisbertrand22/portfolio)

1. Click the button above
2. Login with GitHub
3. Deploy
4. Done!

---

### Option 3: Netlify (One Click)
**Best for: Sites with forms or serverless functions**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/louisbertrand22/portfolio)

1. Click the button above
2. Login with GitHub
3. Deploy
4. Done!

---

## CLI Deployment

### Vercel CLI
```bash
npm i -g vercel
vercel
```

### Netlify CLI
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## Docker (Advanced)

```bash
# Quick start
docker compose up -d

# Or build manually
docker build -t portfolio .
docker run -d -p 3000:80 portfolio
```

---

## 📚 More Information

- **Detailed guides**: See [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Platform comparison**: See [DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md)
- **Troubleshooting**: Check the deployment guide

---

## ✅ Deployment Checklist

Before deploying, make sure you've:

- [ ] Updated personal info in `src/App.tsx`
- [ ] Changed colors in `src/index.css` (optional)
- [ ] Updated page title in `index.html`
- [ ] Tested locally with `npm run build && npm run preview`
- [ ] Committed all changes to git

---

## 🆘 Common Issues

**Build fails?**
- Run `npm run build` locally to see the error
- Check that all dependencies are in `package.json`

**GitHub Pages shows 404?**
- Did you select "GitHub Actions" in Settings → Pages?
- Check the Actions tab to see if deployment completed

**Wrong base path?**
- GitHub Pages: Uses `/portfolio/` automatically
- Other platforms: Uses `/` (root)

---

## 🎯 Recommended Approach

For most users:
1. **Start**: GitHub Pages (free, automatic)
2. **Upgrade**: Vercel/Netlify (when you need custom domain)
3. **Advanced**: Docker (when you need full control)

---

**Need help?** Open an issue or check the [full deployment guide](../DEPLOYMENT.md)
