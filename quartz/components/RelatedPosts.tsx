import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { Date, getDate } from "./Date"
import { classNames } from "../util/lang"

interface Options {
  title: string
  limit: number
}

const defaultOptions: Options = {
  title: "Related Posts",
  limit: 3,
}

export default ((userOpts?: Partial<Options>) => {
  const RelatedPosts: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    const currentTags = new Set(fileData.frontmatter?.tags ?? [])
    if (currentTags.size === 0) {
      return null
    }

    const scored = allFiles
      .filter((page) => {
        const slug = page.slug ?? ""
        return slug !== fileData.slug && !slug.endsWith("index") && slug !== "about"
      })
      .map((page) => {
        const shared = (page.frontmatter?.tags ?? []).filter((t) => currentTags.has(t)).length
        return { page, shared }
      })
      .filter(({ shared }) => shared > 0)
      .sort((a, b) => {
        if (b.shared !== a.shared) return b.shared - a.shared
        const da = a.page.dates?.created?.getTime() ?? 0
        const db = b.page.dates?.created?.getTime() ?? 0
        return db - da
      })
      .slice(0, opts.limit)

    if (scored.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "related-posts")}>
        <h3>{opts.title}</h3>
        <ul>
          {scored.map(({ page }) => (
            <li>
              <a href={resolveRelative(fileData.slug!, page.slug!)}>
                <span class="related-title">{page.frontmatter?.title ?? page.slug}</span>
                {page.dates && (
                  <span class="related-date">
                    <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  RelatedPosts.css = `
  .related-posts {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--lightgray);
  }

  .related-posts > h3 {
    font-family: var(--codeFont);
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--gray);
    margin: 0 0 1rem 0;
  }

  .related-posts > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .related-posts > ul > li {
    margin: 0;
  }

  .related-posts > ul > li > a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.7rem 1rem;
    border: 1px solid var(--lightgray);
    border-radius: var(--radius, 10px);
    background-color: var(--surface);
    text-decoration: none;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  .related-posts > ul > li > a:hover {
    border-color: color-mix(in srgb, var(--secondary) 45%, var(--lightgray));
  }

  .related-posts .related-title {
    color: var(--dark);
    font-weight: 500;
    font-size: 0.95rem;
    line-height: 1.4;
    transition: color 0.15s ease;
  }

  .related-posts > ul > li > a:hover .related-title {
    color: var(--secondary);
  }

  .related-posts .related-date {
    flex-shrink: 0;
    font-family: var(--codeFont);
    font-size: 0.72rem;
    color: var(--gray);
  }
  `

  return RelatedPosts
}) satisfies QuartzComponentConstructor<Partial<Options>>
