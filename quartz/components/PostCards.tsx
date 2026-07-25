import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import readingTime from "reading-time"

interface Options {
  title: string
  limit: number
  showDescription: boolean
  showTags: boolean
  linkToMore: SimpleSlug | false
  linkToMoreLabel: string
  scopeToFolder: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  title: "All Posts",
  limit: 100,
  showDescription: true,
  showTags: true,
  linkToMore: false,
  linkToMoreLabel: "View all posts",
  scopeToFolder: false,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

const isPinned = (page: QuartzPluginData) =>
  (page.frontmatter as Record<string, any>)?.pinned === true

export default ((userOpts?: Partial<Options>) => {
  const PostCards: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }

    // On folder pages, only consider posts under that folder
    const folderPrefix = opts.scopeToFolder
      ? `${(fileData.slug ?? "").split("/").slice(0, -1).join("/")}/`
      : null

    const matching = allFiles.filter((page) => {
      if (!opts.filter(page)) return false
      if (folderPrefix === null) return true
      return (page.slug ?? "").startsWith(folderPrefix)
    })

    // Pinned posts always float to the top, keeping the base sort within each bucket
    const sorted = matching.sort((a, b) => {
      const pinDiff = Number(isPinned(b)) - Number(isPinned(a))
      return pinDiff !== 0 ? pinDiff : opts.sort(a, b)
    })

    const pages = sorted.slice(0, opts.limit)
    const remaining = Math.max(0, sorted.length - pages.length)

    if (pages.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "post-cards")}>
        <h3>{opts.title}</h3>
        <ul>
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? page.slug
            const tags = page.frontmatter?.tags ?? []
            const minutes = page.text ? Math.ceil(readingTime(page.text).minutes) : undefined
            const summary = (page.frontmatter as Record<string, any>)?.summary ?? page.description

            return (
              <li>
                <article class={isPinned(page) ? "pinned" : ""}>
                  <p class="post-meta">
                    {isPinned(page) && <span class="post-pin">Pinned</span>}
                    {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                    {minutes !== undefined && (
                      <>
                        <span class="post-meta-sep">·</span>
                        <span>
                          {i18n(cfg.locale).components.contentMeta.readingTime({ minutes })}
                        </span>
                      </>
                    )}
                  </p>
                  <h4>
                    <a href={resolveRelative(fileData.slug!, page.slug!)}>{title}</a>
                  </h4>
                  {opts.showDescription && summary && <p class="post-description">{summary}</p>}
                  {opts.showTags && tags.length > 0 && (
                    <ul class="post-tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            data-no-popover="true"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            )
          })}
        </ul>
        {opts.linkToMore && remaining > 0 && (
          <a class="post-cards-more" href={resolveRelative(fileData.slug!, opts.linkToMore)}>
            {opts.linkToMoreLabel} ({remaining > 0 ? sorted.length : 0}) →
          </a>
        )}
      </div>
    )
  }

  PostCards.css = `
  .post-cards > h3 {
    font-family: var(--codeFont);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--gray);
    margin: 2rem 0 0 0;
  }

  .post-cards > ul {
    list-style: none;
    margin: 1.25rem 0 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .post-cards > ul > li {
    margin: 0;
  }

  .post-cards article {
    position: relative;
    padding: 1.15rem 1.4rem;
    border: 1px solid var(--lightgray);
    border-radius: var(--radiusLg, 14px);
    background-color: var(--surface);
    box-shadow: var(--shadowSm);
    overflow: hidden;
    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
  }

  .post-cards article::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--secondary);
    transform: scaleY(0);
    transition: transform 0.18s ease;
  }

  .post-cards article:hover {
    border-color: color-mix(in srgb, var(--secondary) 45%, var(--lightgray));
    box-shadow: var(--shadowMd);
    transform: translateY(-2px);
  }

  .post-cards article:hover::before {
    transform: scaleY(1);
  }

  .post-cards .post-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0;
    font-family: var(--codeFont);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--gray);
    line-height: 1.4;
  }

  .post-cards .post-meta-sep {
    opacity: 0.6;
  }

  .post-cards .post-pin {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    margin-right: 0.15rem;
    border-radius: 4px;
    background-color: var(--highlight);
    color: var(--secondary);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .post-cards article.pinned {
    border-color: color-mix(in srgb, var(--secondary) 30%, var(--lightgray));
  }

  .post-cards article.pinned::before {
    transform: scaleY(1);
    opacity: 0.45;
  }

  .post-cards article.pinned:hover::before {
    opacity: 1;
  }

  a.post-cards-more {
    display: inline-block;
    margin-top: 1rem;
    font-family: var(--codeFont);
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--gray);
    background-color: transparent;
    transition: color 0.15s ease;
  }

  a.post-cards-more:hover {
    color: var(--secondary) !important;
  }

  .post-cards h4 {
    margin: 0.4rem 0 0 0;
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.45;
  }

  .post-cards h4 > a {
    color: var(--dark);
    background-color: transparent;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .post-cards h4 > a::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  .post-cards article:hover h4 > a {
    color: var(--secondary) !important;
  }

  .post-cards .post-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--gray);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-cards ul.post-tags {
    position: relative;
    z-index: 1;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0.75rem 0 0 0;
    padding: 0;
  }

  .post-cards ul.post-tags > li {
    margin: 0;
  }
  `

  return PostCards
}) satisfies QuartzComponentConstructor<Partial<Options>>
