'use client'

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export function Back() {
  const isMinimumSmall = useMediaQuery('(min-width: 640px)')
  const { id } = useParams<{ id?: string }>()
  
  if (!id || isMinimumSmall) return(
    <h1 className="px-4 text-xl font-semibold leading-[3rem] select-none">Editorial</h1>
  )

  return(
    <Button
      variant={"clear"}
      className="h-12 font-medium"
      asChild
    >
      <Link href={'/editorial'}>
        <ChevronLeftIcon className="h-4 w-4 mr-2" />
        Editorial
      </Link>
    </Button>
  )
}