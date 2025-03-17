"use client"
import React from "react";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function StudentBreadcrumb() {
  const pathname = usePathname()
  if (!pathname) return null

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)
    return { href, label }
  })

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/aluno/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Início
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <span className="mx-2 text-muted-foreground">/</span>
            <Link
              href={breadcrumb.href}
              className={`text-sm font-medium ${
                index === breadcrumbs.length - 1
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
