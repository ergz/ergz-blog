import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/ergz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta(), Component.TagList()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        limit: 4,
        filter: (f) =>
          f.slug!.startsWith("posts/") && f.slug! !== "posts/index.md" && !f.frontmatter?.noindex,
        sort: (f1, f2) =>
          (f2.dates?.published.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (f1.dates?.published.getTime() ?? Number.MAX_SAFE_INTEGER),
        linkToMore: "posts/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Notes",
        limit: 4,
        filter: (f) =>
          f.slug!.startsWith("notes/") && f.slug! !== "notes/index.md" && !f.frontmatter?.noindex,
        sort: (f1, f2) =>
          (f2.dates?.published.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (f1.dates?.published.getTime() ?? Number.MAX_SAFE_INTEGER),
        linkToMore: "notes/" as SimpleSlug,
      }),
    )
  ],
  right: [
    Component.Graph(),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [],
}
