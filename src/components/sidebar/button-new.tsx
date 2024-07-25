"use client"

import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

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
      onClick={handleClick}
      className="h-full ml-auto lg:opacity-0 lg:invisible group-hover:visible group-hover:opacity-100 transition-all !text-muted-foreground rounded-sm" 
      variant={"ghost"} 
      size={"icon"}
    >
      <PlusIcon className="h-[0.875rem] w-[0.875rem]"/>
    </Button>
  )
}
