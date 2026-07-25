import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const isPost = (page: { slug?: string }) => {
  const slug = page.slug ?? ""
  return !slug.endsWith("index") && slug !== "about"
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.DesktopNav({
      links: [
        { text: "Post", link: "/post/" },
        { text: "Tag", link: "/tags/" },
        { text: "About", link: "/about" },
      ],
    }),
    Component.ThemeTokens(),
    Component.TocActive(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/loveysuby",
      LinkedIn: "https://www.linkedin.com/in/hyoseop-song/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.PostCards({
        title: "All Posts",
        filter: isPost,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.TableOfContents(),
    Component.ConditionalRender({
      component: Component.Spacer(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Collapsible({
        title: "Topics",
        open: false,
        component: Component.Topics(),
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Topics(),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph({
        localGraph: { depth: -1, scale: 1.0, showTags: true },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RelatedPosts(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Comments({
        provider: "giscus",
        options: {
          repo: "loveysuby/loveysuby.github.io",
          repoId: "MDEwOlJlcG9zaXRvcnkzNjA0ODA1MTU=",
          category: "General",
          categoryId: "DIC_kwDOFXx_A84C5Nfm",
          mapping: "url",
          strict: false,
          reactionsEnabled: true,
          inputPosition: "bottom",
        },
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.BackToList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Topics(),
  ],
  right: [],
}
