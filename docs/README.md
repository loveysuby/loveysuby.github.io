# Reference docs

`theme/` is a copy of the Astro Theme Pure documentation
(https://github.com/cworld1/astro-theme-pure, commit `4ecd476`, Apache-2.0,
`src/content/docs/`). It is kept here as a reference only and is not built into the site.
The rendered version is at https://astro-pure.js.org/docs.

## Which pages apply to this blog

| Page | Use |
| --- | --- |
| `theme/integrations/components.mdx` | Components for posts: Card, Collapse, Aside, Tabs, Steps, Timeline, CardList, Button, Spoiler, Label, Icon, Svg |
| `theme/integrations/advanced.mdx` | Quote, GithubCard, LinkPreview, QRCode, toast, medium-zoom |
| `theme/setup/content.mdx` | Post frontmatter and code block notation (`title="..."`, `// [!code highlight]`, `// [!code ++]`) |
| `theme/setup/configuration.md` | `src/site.config.ts` options |
| `theme/integrations/unocss.md` | Utility classes and typography |
| `theme/advanced/customize.mdx` | Copying a package component into `src/components/` to change it |
| `theme/advanced/update.mdx` | Breaking changes per theme version |
| `theme/advanced/optimize.mdx`, `theme/advanced/faq.md` | Performance notes, common problems |

Not applicable here: `integrations/comment.mdx` (this blog uses giscus, see
`src/components/Giscus.astro`), `integrations/links.mdx` (page removed),
`setup/deployment.mdx`, `setup/getting-started.mdx`, `setup/using-docker-compose.mdx`,
`advanced/about.mdx`.

## Using components in a post

Components only work in `.mdx` files. Name the post `src/content/blog/<lang>/<slug>.mdx`
and import what it uses below the frontmatter:

```mdx
---
title: "..."
description: "..."
publishDate: 2026-10-06
tags: [llm]
---

import { Aside, Tabs, TabItem, Collapse, Steps, Timeline, Spoiler, Icon, Card } from 'astro-pure/user'
import { GithubCard, LinkPreview, Quote, QRCode } from 'astro-pure/advanced'

<Aside type='tip' title='Title'>Text with **markdown**.</Aside>

<Tabs>
  <TabItem label='vLLM'>...</TabItem>
  <TabItem label='SGLang'>...</TabItem>
</Tabs>

<GithubCard repo='vllm-project/vllm' />

<LinkPreview href='https://docs.vllm.ai/' />
```

Checked on this blog (2026-10-06, dev server): Aside, Tabs, Collapse, Spoiler, Steps, Timeline,
Icon, Card, GithubCard, LinkPreview, QRCode render in an `.mdx` post, together with LaTeX,
mermaid and code block titles.

Notes:

- `Aside` types: `note` (default), `tip`, `caution`, `danger`.
- `GithubCard` loads repository data from the GitHub API in the reader's browser.
- `LinkPreview` fetches the target page while the site is being built.
- `Quote` shows a random quote from the API set in `integ.quote` (`src/site.config.ts`).
- `Icon` names: github, gitlab, discord, youtube, instagram, x, telegram, rss, email, reddit,
  bluesky, tiktok, weibo, steam, bilibili, zhihu, coolapk, netease, link, qrcode, copyright,
  receive-money, alipay, wechat-pay, menu, search, sun, moon, computer, calendar, time, earth,
  hashtag, info, up, tag-2, list, github-circle, document, package, location, bulb, alert,
  octangon.
- A translated post must keep the same imports and component tags as its source.
