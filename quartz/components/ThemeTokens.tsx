import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { activePalette, SurfaceTokens } from "../styles/palettes"

const tokenBlock = (selector: string, t: SurfaceTokens) => `
${selector} {
  --codeBg: ${t.codeBg};
  --codeTitleBg: ${t.codeTitleBg};
  --codeLineNum: ${t.codeLineNum};
  --surface: ${t.surface};
  --surfaceHover: ${t.surfaceHover};
  --shadowSm: ${t.shadowSm};
  --shadowMd: ${t.shadowMd};
}
`

export default (() => {
  const ThemeTokens: QuartzComponent = () => null

  ThemeTokens.css =
    tokenBlock(":root:root", activePalette.surfaces.lightMode) +
    tokenBlock(':root:root[saved-theme="dark"]', activePalette.surfaces.darkMode)

  return ThemeTokens
}) satisfies QuartzComponentConstructor
