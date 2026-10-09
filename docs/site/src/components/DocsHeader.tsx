'use client'

import { usePathname } from 'next/navigation'

import { FrameworkSwitch } from '@/components/Framework'
import { type Framework } from '@/lib/framework'
import { navigation } from '@/lib/navigation'

export function DocsHeader({
  title,
  frameworks = [],
}: {
  title?: string
  frameworks?: Array<Framework>
}) {
  let pathname = usePathname()
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === pathname),
  )

  if (!title && !section) {
    return null
  }

  return (
    <header className="mb-9 space-y-1">
      {section && (
        <p className="font-display text-sm font-medium text-sky-500">
          {section.title}
        </p>
      )}
      {title && (
        <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      )}
      {frameworks.length > 1 && (
        <div className="pt-4">
          <FrameworkSwitch frameworks={frameworks} />
        </div>
      )}
    </header>
  )
}
