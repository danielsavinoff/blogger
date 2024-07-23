"use client"

import { useRouter } from "next/navigation"
import { Pencil2Icon, PlusIcon } from "@radix-ui/react-icons"

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
      .then((data) => router.push(`/${data.id!}`))
      .catch((e) => console.log(e))
  }

  return (
    <Button 
      className="select-none h-12" 
      variant={"clear"} 
      size={"icon"} 
      onClick={handleClick}
    >
      <PlusIcon className="h-4 w-4" />
    </Button>
  )
}
