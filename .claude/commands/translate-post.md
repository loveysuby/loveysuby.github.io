---
description: Translate a blog post into the languages it is missing (en, ko, zh, ja)
argument-hint: src/content/blog/<lang>/<slug>.md
---

Translate the post at `$ARGUMENTS` into every language in `en`, `ko`, `zh`, `ja` that does not
yet have `src/content/blog/<lang>/<slug>.md`. The given file is the source and must not be edited.

Rules for each translation:

- Translate the complete text faithfully. Keep the same headings, paragraphs, tables, lists and
  blockquotes in the same order. Do not summarize, add explanations, or restructure.
- Frontmatter: keep the same keys. Translate `title` (under 100 characters) and `description`
  (at most 160 characters). Keep `publishDate`, `tags`, and `draft` unchanged. Do not add a
  `language` field; it is derived from the folder name.
- Leave unchanged: fenced code blocks, inline code, LaTeX (`$...$`, `$$...$$`), URLs, image
  paths, HTML tags.
- ```` ```mermaid ```` blocks: keep syntax, node IDs and arrows; translate only label text.
- Keep established English technical terms in English (KV cache, prefill, TTFT, vLLM, ...).
- Japanese uses だ・である体. Chinese is Simplified Chinese.

After writing the files, run `npm run build` and report, per language, the line count and the
number of mermaid blocks, `$$` lines and table rows compared with the source.
