import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/searchShortcut.inline"

export default (() => {
  const SearchShortcut: QuartzComponent = () => null

  SearchShortcut.afterDOMLoaded = script

  return SearchShortcut
}) satisfies QuartzComponentConstructor
