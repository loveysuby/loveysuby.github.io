import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/readingProgress.inline"

export default (() => {
  const ReadingProgress: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
    <div class={`reading-progress hidden ${displayClass ?? ""}`} aria-hidden="true">
      <div class="reading-progress-bar" />
    </div>
  )

  ReadingProgress.css = `
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 1000;
    pointer-events: none;
    background: transparent;
  }

  .reading-progress.hidden {
    display: none;
  }

  .reading-progress > .reading-progress-bar {
    height: 100%;
    width: 0;
    background: var(--secondary);
    transition: width 0.08s linear;
  }
  `

  ReadingProgress.afterDOMLoaded = script

  return ReadingProgress
}) satisfies QuartzComponentConstructor
