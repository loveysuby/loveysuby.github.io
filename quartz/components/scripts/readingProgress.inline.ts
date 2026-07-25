// Inline scripts share one global scope, so keep everything function-scoped
;(() => {
  let bar: HTMLElement | null = null
  let article: HTMLElement | null = null
  let pending = false

  function update() {
    pending = false
    if (!bar || !article) return

    const total = article.offsetHeight - window.innerHeight
    if (total <= 0) {
      bar.style.width = "0%"
      return
    }

    const scrolled = window.scrollY - article.offsetTop
    const ratio = Math.min(1, Math.max(0, scrolled / total))
    bar.style.width = `${ratio * 100}%`
  }

  function schedule() {
    if (pending) return
    pending = true
    requestAnimationFrame(update)
  }

  document.addEventListener("nav", () => {
    bar = document.querySelector(".reading-progress > .reading-progress-bar")
    article = document.querySelector(".center > article")
    if (!bar || !article) return

    const container = bar.parentElement

    // Only meaningful on pages long enough to scroll through
    if (article.offsetHeight <= window.innerHeight * 1.2) {
      bar.style.width = "0%"
      container?.classList.add("hidden")
      return
    }

    container?.classList.remove("hidden")
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    window.addCleanup(() => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    })

    update()
  })
})()
