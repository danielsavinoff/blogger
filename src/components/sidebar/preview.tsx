'use client'

import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { blobToBase64 } from "@/lib/blobToBase64"
import { useEffect, useState } from "react"

export function Preview({
  title,
  link,
  disabled,
  image
}: {
  title?: string
  link?: string
  disabled?: boolean
  image?: string
}) {
  return (
    <Link
      href={link ?? "#"}
      className="w-full flex p-2 gap-4 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
      aria-disabled={disabled}
    >
      <div className="min-w-min w-4/6 flex items-center">
        <h2 className="text-base font-semibold leading-snug">{title ?? 'Untitled'}</h2>
      </div>
      <div className="flex-1 bg-muted rounded-sm overflow-hidden">
        <AspectRatio ratio={3 / 2}>
          <img src={image} />
        </AspectRatio>
      </div> 
    </Link>
  )
}
