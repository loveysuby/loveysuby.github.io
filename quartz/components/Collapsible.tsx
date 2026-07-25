import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"

type CollapsibleConfig = {
  component: QuartzComponent
  title: string
  open?: boolean
}

const collapsibleStyle = `
details.collapsible {
  min-width: 0;
}

details.collapsible > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.2rem 0;
  font-family: var(--codeFont);
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--darkgray);
  transition: color 0.15s ease;
}

details.collapsible > summary::-webkit-details-marker {
  display: none;
}

details.collapsible > summary:hover {
  color: var(--dark);
}

details.collapsible > summary > svg {
  flex-shrink: 0;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

details.collapsible[open] > summary > svg {
  transform: rotate(180deg);
}

details.collapsible > .collapsible-body > * > h3 {
  display: none;
}
`

export default ((config: CollapsibleConfig) => {
  const Collapsible: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <details class="collapsible" open={config.open ?? true}>
        <summary>
          {config.title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </summary>
        <div class="collapsible-body">
          <config.component {...props} />
        </div>
      </details>
    )
  }

  Collapsible.css = config.component.css
    ? concatenateResources(collapsibleStyle, config.component.css)
    : collapsibleStyle
  Collapsible.afterDOMLoaded = config.component.afterDOMLoaded
  Collapsible.beforeDOMLoaded = config.component.beforeDOMLoaded

  return Collapsible
}) satisfies QuartzComponentConstructor<CollapsibleConfig>
