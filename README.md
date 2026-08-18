# 📥 TVPro Landing Page – Next.js + Strapi CMS

A clean, modern landing page built with **Next.js**, powered by **Strapi CMS** and deployed seamlessly via **GitHub Actions** to **Cloudflare Pages**. Media assets are hosted efficiently on **Cloudinary** for performance and scalability.

---

## 📦 Repositories

| Purpose          | Repository Link                         |
|------------------|------------------------------------------|
| Landing Frontend | [GitHub →](https://github.com/kampentar-kampentur/tvpro-landing/tree/main) |
| CMS (Strapi)     | [GitHub →](https://github.com/kampentar-kampentur/strapi)   |

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) – Static optimized landing page  
- **CMS:** [Strapi](https://strapi.io/) – Headless content management  
- **Media Hosting:** [Cloudinary](https://cloudinary.com/) – Efficient image & video delivery  
- **Deployment:**
  - **Landing page:** [Cloudflare Pages](https://pages.cloudflare.com/) via GitHub Actions CI
  - **CMS backend:** Hosted on [Railway](https://railway.app/)

---

## 🚀 Deployment Flow

### 🔹 Frontend (Landing)

1. **Code pushed to GitHub** → triggers **GitHub Actions** workflow
2. Next.js builds the static site
3. Output deployed to **Cloudflare Pages**

### 🔹 Backend (Strapi)

- Hosted on **Railway** with automatic deployment from main branch

---

## 🖼️ Media Handling

- All media content (images, videos, etc.) is **uploaded and served via Cloudinary**
- Cloudinary is **integrated with Strapi**, enabling seamless asset management from the CMS panel

---

## 📇 Content Editing

- The marketing/content team can **manage all text, images, and galleries** directly from Strapi’s admin panel
- Includes content types like:
  - Services
  - Gallery with filters (e.g., “Wall-mounted”, “Wireless”, etc.)
  - SEO metadata

---

## 🌐 Domains

- Domain purchased via **GoDaddy**
- Connected to **Cloudflare DNS** for full control and HTTPS

---

## 📝 To-Do / Future Improvements

- [ ] Enable preview mode via draft/published toggle from Strapi
- [ ] Add analytics (e.g., Plausible / GA4)
- [ ] Enable form submissions (e.g., with Netlify Forms or Strapi endpoint)

---

## 📚 Documentation
- [City Clusters & Suburbs Guide](file:///Users/kampentar/dev/tvpro-landing/docs/cities-and-suburbs-guide.md) — Полное руководство по заведению городов-метрополий, пригородных кластеров, работе с медиа-файлами, генерации SEO-текстов и автоматическому деплою.
- [Blog Specifications Index](file:///Users/kampentar/dev/tvpro-landing/docs/specs_index.md) — Спецификации и модули блога.
- [Design DNA](file:///Users/kampentar/dev/tvpro-landing/docs/design-dna/README.md) — Дизайн-система и компоненты.

---

## 🧠 Notes

- This repo is focused on **frontend delivery** – see the [admin repo](https://github.com/kampentar-kampentur/strapi) for backend configuration and API setup.
- The entire stack is **serverless-friendly**, allowing smooth scaling.

---

