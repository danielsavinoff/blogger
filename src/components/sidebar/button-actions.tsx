"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { blobToBase64 } from "@/lib/blobToBase64"
import { EllipsisIcon } from "lucide-react"

export function Actions({
  id
}: {
  id?: string
}) {
  const router = useRouter()

  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState<boolean>(false)
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState<boolean>(false)
  useEffect(() => {
    if (isActionDropdownOpen) 
      setIsRenamePopoverOpen(false)
  }, [isActionDropdownOpen])

  const [article, setArticle] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch(`/api/articles/${id}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => setArticle(data))
      // .then(async (res) => {
      //   const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
        
      //   while (true) {
      //     const {value, done} = await reader.read()
          
      //     if (done) break

      //     setArticle(JSON.parse(value))
      //   }
      // })
  }, [id])

  const title = useRef<string>(article?.title as string ?? '')
  const [isPublic, setIsPublic] = useState<boolean>(false)
  
  const fileInput = useRef<HTMLInputElement | null>(null)
 
  useEffect(() => {
    if (typeof article?.isPublic === 'boolean') 
      setIsPublic(article?.isPublic)
  }, [article])

  return (
    <>
      <AlertDialog>
        <Popover modal open={isRenamePopoverOpen} onOpenChange={setIsRenamePopoverOpen}>
          <DropdownMenu open={isActionDropdownOpen} onOpenChange={setIsActionDropdownOpen}>
            <PopoverAnchor asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-full ml-auto text-foreground/80 rounded-sm" 
                  variant={"ghost"} 
                  size={"icon"}
                  onClick={e => e.preventDefault()}
                >
                  <EllipsisIcon className="h-[0.875rem] w-[0.875rem]"/>
                </Button>
              </DropdownMenuTrigger>
            </PopoverAnchor>
            <DropdownMenuContent 
              className="min-w-48" 
              align="center"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuGroup>
                <PopoverTrigger asChild>
                  <DropdownMenuItem>
                    Rename
                  </DropdownMenuItem>
                </PopoverTrigger>
                <DropdownMenuItem
                  onClick={() => {
                    fileInput.current?.click()
                  }}
                >
                  Set preview
                </DropdownMenuItem>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem 
                  checked={isPublic} 
                  onCheckedChange={value => {
                    fetch(`/api/articles/${id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        data: { isPublic: value }
                      })
                    })

                    setIsPublic(value)
                  }}
                >
                  Publish
                </DropdownMenuCheckboxItem>
                <DropdownMenuItem disabled>Copy link</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuGroup>
            </DropdownMenuContent>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to permanently delete this article? 
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    fetch(`/api/articles/${id}`, {
                      method: 'DELETE'
                    })
                      .then(res => {
                        if (res.status === 200)
                          router.push('/')
                      })
                  }}
                >
                  Yes, delete the article
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            <PopoverContent 
              onFocusOutside={(e) => e.preventDefault()}
              onInteractOutside={() => {
                fetch(`/api/articles/${id}`, {
                  method: 'PATCH',
                  body: JSON.stringify({
                    data: { title: title.current }
                  })
                })
              }}
            >
              <Input
                placeholder="Set title"
                onChange={e => title.current = e.target.value}
                defaultValue={article?.title as string}
              />
            </PopoverContent>  
          </DropdownMenu>
        </Popover>  
      </AlertDialog>
      <input 
        type="file" 
        ref={fileInput}
        onChange={async (e) => {
          const list = e.target.files
          const file = list?.item(0)

          if (!file) return
          
          const buffer = Buffer.from(await file.arrayBuffer())
          const base64 = buffer.toString('base64')

          fetch(`/api/articles/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              data: { preview: base64 }
            })
          })
        }}
        accept="image/jpeg,image/pjpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/x-icon"
        hidden 
      />
    </>
  )
}
