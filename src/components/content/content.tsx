'use client'

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"

export function Content({
  className,
  ...params
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMinimumSmall = useMediaQuery('(min-width: 640px)')
  const { id } = useParams<{ id: string }>()

  return(
    <div 
      className={cn([
        "w-full max-h-full absolute inset-y-0 left-0 sm:static bg-background overflow-auto z-50",
        className
      ])}
      hidden={!id && !isMinimumSmall}
      {...params}
    />
  )
}