import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

interface Options {
  fallbackLabel: string
}

const defaultOptions: Options = {
  fallbackLabel: "All posts",
}

export default ((userOpts?: Partial<Options>) => {
  const BackToList: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const slug = fileData.slug
    if (!slug) {
      return null
    }

    const segments = slug.split("/")
    segments.pop()
    const parent = (segments.length > 0 ? `${segments.join("/")}/` : "/") as SimpleSlug

    const parentIndex = allFiles.find((page) => page.slug === `${segments.join("/")}/index`)
    const label = parentIndex?.frontmatter?.title ?? opts.fallbackLabel

    return (
      <div class={classNames(displayClass, "back-to-list")}>
        <a href={resolveRelative(slug, parent)}>
          <span class="back-arrow">←</span>
          {label}
        </a>
      </div>
    )
  }

  BackToList.css = `
  .back-to-list {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--lightgray);
  }

  .back-to-list > a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    border: 1px solid var(--lightgray);
    border-radius: 999px;
    background-color: var(--surface);
    font-family: var(--codeFont);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--darkgray);
    text-decoration: none;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;
  }

  .back-to-list > a:hover {
    border-color: color-mix(in srgb, var(--secondary) 45%, var(--lightgray));
    color: var(--secondary) !important;
  }

  .back-to-list .back-arrow {
    transition: transform 0.15s ease;
  }

  .back-to-list > a:hover .back-arrow {
    transform: translateX(-2px);
  }
  `

  return BackToList
}) satisfies QuartzComponentConstructor<Partial<Options>>
