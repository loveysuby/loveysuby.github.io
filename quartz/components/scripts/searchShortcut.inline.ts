// U+2009 thin space keeps the gap narrower than a regular space
const APPLE_LABEL = '"\u2318\u2009K"'
const OTHER_LABEL = '"Ctrl\u2009K"'

function applyShortcutLabel() {
  const platform =
    (navigator as any).userAgentData?.platform ?? navigator.platform ?? navigator.userAgent
  const isApple = /mac|iphone|ipad|ipod/i.test(platform)
  document.documentElement.style.setProperty(
    "--searchShortcut",
    isApple ? APPLE_LABEL : OTHER_LABEL,
  )
}

document.addEventListener("nav", applyShortcutLabel)
