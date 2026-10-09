import { type Node } from '@markdoc/markdoc'

import { DocsHeader } from '@/components/DocsHeader'
import { FrameworkHashTarget } from '@/components/Framework'
import { PrevNextLinks } from '@/components/PrevNextLinks'
import { Prose } from '@/components/Prose'
import { TableOfContents } from '@/components/TableOfContents'
import { type Framework } from '@/lib/framework'
import { collectSections } from '@/lib/sections'

export function DocsLayout({
  children,
  frontmatter: { title, frameworks },
  nodes,
}: {
  children: React.ReactNode
  /** `frameworks` lists the variants a page documents; two get a switch. */
  frontmatter: { title?: string; frameworks?: Array<Framework> }
  nodes: Array<Node>
}) {
  let tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
        <article>
          <DocsHeader title={title} frameworks={frameworks} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
      {frameworks && <FrameworkHashTarget />}
    </>
  )
}
