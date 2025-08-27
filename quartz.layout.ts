import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.DesktopNav({
      links: [
        { text: "MLSys", link: "/tags/mlsys" },
        { text: "AI", link: "/tags/ai" },
        { text: "Cloud", link: "/tags/cloud" },
        { text: "Blog", link: "/tags/blog" },
        { text: "About", link: "/about" },
      ],
    }),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/loveysuby",
      LinkedIn: "https://www.linkedin.com/in/hyoseop-song/"
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
      component: Component.RecentNotes({
        title: "All Posts",
        limit: 100,
        showTags: false,
        filter: (page) => page.slug !== "index",
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
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags" && node.slugSegment !== "about",
    }),
    Component.Spacer(),
    Component.TableOfContents(),
  ],
  right: [
    Component.Graph(),
    Component.Backlinks(),
    Component.DesktopOnly(Component.Spacer()),
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recent Posts",
      limit: 5,
      showTags: false,
    })),
  ],
  afterBody: [
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
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags" && node.slugSegment !== "about",
    }),
  ],
  right: [],
}
