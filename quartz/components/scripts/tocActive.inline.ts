const READING_LINE_OFFSET = 120

interface TocItem {
  li: HTMLElement
  link: HTMLAnchorElement
  slug: string
  depth: number
  groupStart: number
}

interface TocGroup {
  container: HTMLElement
  items: TocItem[]
}

let headings: HTMLElement[] = []
let groups: TocGroup[] = []
let ticking = false

function depthOf(li: HTMLElement): number {
  for (const cls of li.classList) {
    if (cls.startsWith("depth-")) {
      const n = Number.parseInt(cls.slice("depth-".length), 10)
      if (!Number.isNaN(n)) return n
    }
  }
  return 0
}

function scrollActiveIntoView(container: HTMLElement, link: HTMLAnchorElement) {
  if (container.scrollHeight <= container.clientHeight) return

  const linkTop = link.offsetTop - container.offsetTop
  const linkBottom = linkTop + link.offsetHeight
  const viewTop = container.scrollTop
  const viewBottom = viewTop + container.clientHeight

  if (linkTop < viewTop) {
    container.scrollTop = linkTop - 8
  } else if (linkBottom > viewBottom) {
    container.scrollTop = linkBottom - container.clientHeight + 8
  }
}

function currentSlug(): string | null {
  if (headings.length === 0) return null

  const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
  if (atBottom) return headings[headings.length - 1].id

  let slug = headings[0].id
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= READING_LINE_OFFSET) {
      slug = heading.id
    } else {
      break
    }
  }
  return slug
}

function updateActive() {
  ticking = false
  const slug = currentSlug()
  if (slug === null) return

  for (const group of groups) {
    const activeIndex = group.items.findIndex((item) => item.slug === slug)
    const activeGroup = activeIndex === -1 ? -1 : group.items[activeIndex].groupStart
    let activeLink: HTMLAnchorElement | null = null

    for (const item of group.items) {
      const isActive = item.slug === slug
      item.link.classList.toggle("active", isActive)
      if (isActive) activeLink = item.link

      // Top-level entries stay visible; sub-entries expand only while their section is active
      const revealed = item.depth === 0 || item.groupStart === activeGroup
      item.li.classList.toggle("toc-collapsed", !revealed)
    }

    if (activeLink) scrollActiveIntoView(group.container, activeLink)
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateActive)
}

document.addEventListener("nav", () => {
  headings = [
    ...document.querySelectorAll<HTMLElement>(
      "article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]",
    ),
  ]

  groups = []
  for (const container of document.querySelectorAll<HTMLElement>(".toc-content")) {
    const items: TocItem[] = []
    let groupStart = 0

    container.querySelectorAll<HTMLElement>("li").forEach((li, index) => {
      const link = li.querySelector<HTMLAnchorElement>("a[data-for]")
      if (!link) return
      const depth = depthOf(li)
      if (depth === 0) groupStart = index
      items.push({
        li,
        link,
        slug: link.getAttribute("data-for")!,
        depth,
        groupStart,
      })
    })

    if (items.length > 0) {
      container.classList.add("toc-progressive")
      groups.push({ container, items })
    }
  }

  if (groups.length === 0) return

  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll, { passive: true })
  window.addCleanup(() => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onScroll)
  })

  updateActive()
})
