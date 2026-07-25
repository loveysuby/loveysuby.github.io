import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

interface Options {
  title: string
  limit: number
  showCount: boolean
}

const defaultOptions: Options = {
  title: "Topics",
  limit: 12,
  showCount: true,
}

export default ((userOpts?: Partial<Options>) => {
  const Topics: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    const counts = new Map<string, number>()
    for (const file of allFiles) {
      for (const tag of file.frontmatter?.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }

    if (counts.size === 0) {
      return null
    }

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    const shown = sorted.slice(0, opts.limit)
    const hasMore = sorted.length > shown.length

    const activeTag = fileData.slug?.startsWith("tags/")
      ? fileData.slug.slice("tags/".length)
      : undefined

    return (
      <div class={classNames(displayClass, "topics")}>
        <h3>{opts.title}</h3>
        <ul class="topics-list">
          {shown.map(([tag, count]) => (
            <li class={activeTag === tag ? "active" : ""}>
              <a href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>
                <span class="topic-name">{tag}</span>
                {opts.showCount && <span class="topic-count">{count}</span>}
              </a>
            </li>
          ))}
        </ul>
        {hasMore && (
          <a class="topics-all" href={resolveRelative(fileData.slug!, "tags/" as FullSlug)}>
            View all topics →
          </a>
        )}
      </div>
    )
  }

  Topics.css = `
  .topics {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
  }

  .topics > h3 {
    margin: 0 0 0.6rem 0;
  }

  ul.topics-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul.topics-list > li {
    margin: 0;
  }

  ul.topics-list > li > a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.28rem 0.5rem;
    margin: 0 -0.5rem;
    border-radius: 6px;
    background-color: transparent;
    font-family: var(--codeFont);
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--darkgray);
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  ul.topics-list > li > a .topic-name::before {
    content: "#";
    color: var(--gray);
    margin-right: 0.15em;
  }

  ul.topics-list > li > a .topic-count {
    color: var(--gray);
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  ul.topics-list > li > a:hover {
    background-color: var(--highlight);
    color: var(--secondary) !important;
  }

  ul.topics-list > li.active > a.internal {
    background-color: var(--highlight);
    color: var(--secondary);
    font-weight: 500;
  }

  ul.topics-list > li.active > a.internal .topic-name::before {
    color: var(--secondary);
  }

  a.topics-all {
    margin-top: 0.6rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--gray);
    background-color: transparent;
  }
  `

  return Topics
}) satisfies QuartzComponentConstructor<Partial<Options>>
