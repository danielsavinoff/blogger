import { Container } from "@/components/ui/container"
import { New } from "@/components/sidebar/button-new"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Back } from "@/components/header/button-back"
import { Content } from "@/components/content/content"
import { List } from "@/components/ui/list"
import { Preview } from "@/components/sidebar/preview"
import { User } from "@/components/header/button-user"
import { PlusIcon, SquarePenIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditorialLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="w-full relative px-4 top-0 left-0 flex items-center border-b bg-background z-50">
        <div className="flex items-center">
          <Back />
        </div>
        <div className="flex justify-end ml-auto">
          <User />
        </div>
      </header>
      <div className="relative grow flex overflow-hidden">
        <Sheet modal={false} open>
          <SheetContent side={"left"} className="w-full relative flex flex-col p-0 gap-0 border-r-0 sm:border-r shadow-none !animate-none focus:outline-none overflow-auto z-0">
            {/* <div className="w-full flex p-2 group">
              <p className="text-xs font-semibold text-muted-foreground">
                Content
              </p>
              <New />
            </div> */}
            <div className="flex-grow p-2 space-y-2">
              <List<React.ComponentProps<typeof Preview> & { key?: string | number }>
                endpoint="/api/articles"
                adapter={{
                  link: '/editorial/[id]',
                  image: 'data:image/png;base64,[preview]',
                  key: '[id]',
                }}
              >
                <Preview />
              </List>
            </div>
            <div className="absolute w-full bottom-0 flex justify-center p-2 bg-background">
              <Button variant={"link"} size={"sm"}>
                <SquarePenIcon className="h-4 w-4 mr-2" />
                Write 
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Content>
          <Container>
            {children}
          </Container>
        </Content>
      </div>
    </div>
  )
}
