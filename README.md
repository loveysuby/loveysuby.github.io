# loveysuby.github.io

Personal blog of Hyoseop Song. Built with [Astro](https://astro.build) and the
[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) theme
(Apache-2.0, see `licenses/astro-theme-pure.LICENSE`; adapted from upstream commit `4ecd476`).

## Writing

Posts live in `src/content/blog/<lang>/<slug>.md`, where `<lang>` is `en`, `ko`, `zh` or `ja`.
Files with the same `<slug>` are translations of one post.

| Language | URL |
| --- | --- |
| English (default) | `/blog/<slug>` |
| Others | `/blog/<lang>/<slug>` |

Lists (home, blog, archive, tags, RSS) show one entry per post: the English version when it
exists, otherwise whichever language is available. Each post page shows a language switcher and
emits `hreflang` links. Comments are shared across the language versions of a post.

Frontmatter:

```yaml
---
title: "Post title"            # up to 100 characters
description: "One or two sentences."   # up to 160 characters
publishDate: 2026-07-24
tags:
  - llm
category: "AI Infra"         # optional; badge and archive grouping
heroImage: { src: '../_images/<slug>.jpg', alt: '...' }   # optional; background of the post's card in lists and its link preview image (not shown on the post page)
draft: false
---
```

LaTeX (`$...$`, `$$...$$`) and ```` ```mermaid ```` blocks are supported.

Optional home page sections (education, certifications, websites, skills) are filled in
`src/data/profile.ts`; a section appears once its list has an entry.

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Changes made on top of the theme

- `src/assets/styles/app.css`: purple palette, smaller table of contents
- `src/layouts/BaseLayout.astro`: taller top gradient, shown on every page
- `src/layouts/ContentLayout.astro`: client-side mermaid rendering
- `src/components/Giscus.astro`: giscus comments (replaces Waline)
- `astro.config.ts`: static output, redirects from the old `/post/*` URLs
- `src/utils/posts.ts`, `src/components/LanguageSwitcher.astro`: per-language posts
- `src/pages/index.xml.ts`: RSS at the old `/index.xml` path (also at `/rss.xml`)
