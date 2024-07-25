import { Container } from "@/components/ui/container"
import { Actions } from "@/components/header/button-actions"
import { New } from "@/components/header/button-new"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Back } from "@/components/header/button-back"
import { Content } from "@/components/content/content"
import { List } from "@/components/ui/list"
import { Preview } from "@/components/sidebar/preview"
import { User } from "@/components/header/button-user"

export default function EditorialLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full w-full flex flex-col">
      <header className="w-full relative top-0 left-0 flex items-center border-b bg-background z-50">
        <div className="flex items-center">
          <Back />
        </div>
        <div className="flex justify-end ml-auto">
          <Actions />
          <User />
          <New />
        </div>
      </header>
      <div className="relative grow flex overflow-hidden">
        <Sheet modal={false} open>
          <SheetContent side={"left"} className="w-full static p-2 gap-0 border-r-0 sm:border-r shadow-none !animate-none focus:outline-none overflow-auto z-0">
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
