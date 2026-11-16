import type { CollectionEntry } from 'astro:content'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

/**
 * Posts live in `src/content/blog/<lang>/<slug>.md`. English is the default language and is
 * served at `/blog/<slug>`; other languages are served at `/blog/<lang>/<slug>`.
 */
export const LANGS = { en: 'English', ko: '한국어', zh: '中文', ja: '日本語' } as const
export type Lang = keyof typeof LANGS
export const LANG_KEYS = Object.keys(LANGS) as Lang[]
export const DEFAULT_LANG: Lang = 'en'
/** Values for `<html lang>` and `hreflang`. */
export const HTML_LANG: Record<Lang, string> = { en: 'en', ko: 'ko', zh: 'zh-Hans', ja: 'ja' }

export type Post = CollectionEntry<'blog'>
export type LocalizedPost = Post & { lang: Lang; slug: string; entry: Post }

export function parseId(id: string): { lang: Lang; slug: string } {
  const [first, ...rest] = id.split('/')
  if (first in LANGS && rest.length) return { lang: first as Lang, slug: rest.join('/') }
  return { lang: DEFAULT_LANG, slug: id }
}

export const urlId = (lang: Lang, slug: string) =>
  lang === DEFAULT_LANG ? slug : `${lang}/${slug}`

/**
 * Every post in every language. `id` is rewritten to the URL id so that theme components,
 * which build links as `/blog/${id}`, point at the right page. `entry` keeps the original
 * collection entry for `render()`.
 */
export async function getAllPosts(): Promise<LocalizedPost[]> {
  const entries = await getBlogCollection()
  return entries.map((entry) => {
    const { lang, slug } = parseId(entry.id)
    return {
      ...entry,
      id: urlId(lang, slug),
      data: { ...entry.data, language: LANGS[lang] },
      lang,
      slug,
      entry
    }
  })
}

/** One entry per post: the requested language if it exists, else English, else any. Newest first. */
export async function getPosts(lang: Lang = DEFAULT_LANG): Promise<LocalizedPost[]> {
  const bySlug = new Map<string, LocalizedPost[]>()
  for (const post of await getAllPosts()) {
    bySlug.set(post.slug, [...(bySlug.get(post.slug) ?? []), post])
  }
  const picked = [...bySlug.values()].map(
    (versions) =>
      versions.find((v) => v.lang === lang) ??
      versions.find((v) => v.lang === DEFAULT_LANG) ??
      versions[0]
  )
  return sortMDByDate(picked) as LocalizedPost[]
}

/**
 * The given posts in every language, in the given order. A post without a translation in a
 * language is kept as it is. List pages render one list per language and the reader's language
 * (see the `data-pref-lang` script in BaseLayout.astro) decides which one is shown.
 */
export async function postsByLang(posts: Post[]): Promise<Record<Lang, LocalizedPost[]>> {
  const all = await getAllPosts()
  const pick = (post: Post, lang: Lang) => {
    // `post.id` is the URL id here (`<slug>` or `<lang>/<slug>`), which parseId also accepts.
    const { slug } = parseId(post.id)
    return all.find((p) => p.slug === slug && p.lang === lang) ?? (post as LocalizedPost)
  }
  return Object.fromEntries(
    LANG_KEYS.map((lang) => [lang, posts.map((post) => pick(post, lang))])
  ) as Record<Lang, LocalizedPost[]>
}

/** Available languages of one post, in the order of `LANGS`. */
export async function getTranslations(slug: string) {
  const versions = (await getAllPosts()).filter((p) => p.slug === slug)
  return (Object.keys(LANGS) as Lang[])
    .filter((lang) => versions.some((v) => v.lang === lang))
    .map((lang) => ({ lang, label: LANGS[lang], href: `/blog/${urlId(lang, slug)}` }))
}

export type PostGroup = { key: string; posts: LocalizedPost[] }

/** Groups posts by the keys `keysOf` returns. A post with several keys appears in each group. */
export function groupPosts(
  posts: LocalizedPost[],
  keysOf: (post: LocalizedPost) => string[]
): PostGroup[] {
  const map = new Map<string, LocalizedPost[]>()
  for (const post of posts)
    for (const key of keysOf(post)) map.set(key, [...(map.get(key) ?? []), post])
  return [...map.entries()].map(([key, posts]) => ({ key, posts }))
}

/** Largest group first, then alphabetical. */
export const byCountThenName = (a: PostGroup, b: PostGroup) =>
  b.posts.length - a.posts.length || a.key.localeCompare(b.key)

/** Posts grouped by tag, as shown in the archive's "By Tag" view and on the tags page. */
export const groupByTag = (posts: LocalizedPost[]) =>
  groupPosts(posts, (p) => p.data.tags).sort(byCountThenName)
