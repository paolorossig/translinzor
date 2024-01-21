'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { ChevronRightIcon, HomeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { segmentLabelMap } from '@/lib/constants'

export default function NavBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname === '/' ? [''] : pathname.split('/')

  return (
    <nav
      className="flex items-center space-x-3 text-muted-foreground"
      aria-label="breadcrumb"
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1
        const pathToSegment = segments.slice(0, index + 1).join('/')
        const label = segmentLabelMap[segment] ?? segment

        return (
          <Fragment key={index}>
            {index === 0 ? (
              <Button asChild size="icon" variant="ghost">
                <Link href="/" aria-label="Go to Dashboard">
                  <HomeIcon className="h-4 w-4 font-semibold" />
                </Link>
              </Button>
            ) : (
              <>
                <ChevronRightIcon className="h-4 w-4 font-semibold" />
                {!isLastSegment ? (
                  <Button
                    asChild
                    variant="link"
                    className="text-muted-foreground hover:text-card-foreground"
                  >
                    <Link href={pathToSegment}>
                      <span className="capitalize">{label}</span>
                    </Link>
                  </Button>
                ) : (
                  <span className="rounded-lg bg-muted px-4 py-1 text-sm font-medium capitalize text-card-foreground">
                    {label}
                  </span>
                )}
              </>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
