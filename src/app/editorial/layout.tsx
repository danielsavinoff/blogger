import { Container } from "@/components/ui/container"
import { Actions } from "@/components/header/button-actions"
import { New } from "@/components/sidebar/button-new"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Back } from "@/components/header/button-back"
import { Content } from "@/components/content/content"
import { List } from "@/components/ui/list"
import { Preview } from "@/components/sidebar/preview"
import { User } from "@/components/header/button-user"
import { PlusIcon } from "lucide-react"
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
          <Actions />
          <User />
        </div>
      </header>
      <div className="relative grow flex overflow-hidden">
        <Sheet modal={false} open>
          <SheetContent side={"left"} className="w-full static flex flex-col p-2 gap-0 border-r-0 sm:border-r shadow-none !animate-none focus:outline-none overflow-auto z-0">
            <div className="w-full flex p-2 group">
              <p className="text-xs font-semibold text-muted-foreground">
                Content
              </p>
              <New />
            </div>
            <div className="flex-grow">
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
