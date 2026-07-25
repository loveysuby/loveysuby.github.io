import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/tocActive.inline"

export default (() => {
  const TocActive: QuartzComponent = () => null

  TocActive.afterDOMLoaded = script

  return TocActive
}) satisfies QuartzComponentConstructor
