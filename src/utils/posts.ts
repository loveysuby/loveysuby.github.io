import type { CollectionEntry } from 'astro:content'

import { getBlogCollection, sortMDByDate } from 'astro-pure/server'

/**
 * Posts live in `src/content/blog/<lang>/<slug>.md`. English is the default language and is
 * served at `/blog/<slug>`; other languages are served at `/blog/<lang>/<slug>`.
 */
export const LANGS = { en: 'English', ko: '한국어', zh: '中文', ja: '日本語' } as const
export type Lang = keyof typeof LANGS
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

/** Available languages of one post, in the order of `LANGS`. */
export async function getTranslations(slug: string) {
  const versions = (await getAllPosts()).filter((p) => p.slug === slug)
  return (Object.keys(LANGS) as Lang[])
    .filter((lang) => versions.some((v) => v.lang === lang))
    .map((lang) => ({ lang, label: LANGS[lang], href: `/blog/${urlId(lang, slug)}` }))
}
