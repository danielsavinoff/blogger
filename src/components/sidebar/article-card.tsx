'use client'

import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Actions } from "./button-actions"

export function ArticleCard({
  title,
  link,
  id,
  disabled,
  image
}: {
  title?: string
  link?: string
  id?: string
  disabled?: boolean
  image?: string
}) {
  return (
    <div className="pb-2 mb-2 border-b">
      <Link
        href={link ?? "#"}
        className="w-full inline-block p-2 space-y-1 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
        aria-disabled={disabled}
      >
        <div className="w-full flex">
          <p className="text-sm text-muted-foreground">
            Artificial Intelligence
          </p>
          <Actions id={id} />
        </div>
        <div className="w-full flex gap-4">
          <div className="w-4/6 flex items-center">
            <h2 className="text-base font-semibold leading-snug">{title ?? 'Untitled'}</h2>
          </div>
          <div className="flex-1 bg-muted rounded-sm overflow-hidden">
            <AspectRatio ratio={3 / 2}>
              <img src={image} />
            </AspectRatio>
          </div> 
        </div>
      </Link>
    </div>
  )
}
