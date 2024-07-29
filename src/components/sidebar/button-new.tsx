"use client"

import { useRouter } from "next/navigation"
import { PlusIcon, SquarePenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function New() {
  const router = useRouter()

  const handleClick = () => {
    fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json()
        else throw new Error(res.statusText)
      })
      .then((data) => router.push(`/editorial/${data.id!}`))
      .catch((e) => console.log(e))
  }

  return (
    <Button 
      variant={"link"} 
      size={"sm"} 
      onClick={handleClick}
    >
      <SquarePenIcon className="h-4 w-4 mr-2" />
      Write 
    </Button>
  )
}
