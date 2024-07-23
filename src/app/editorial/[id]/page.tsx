import { Editor } from "@/components/ui/editor"
import { db } from "@/database/db"
import { notFound } from "next/navigation"

export default async function EditArticlePage({
  params: { id },
}: {
  params: { id: string }
}) {
  if (!await db.article.findUnique({ where: { id } }))
    notFound()

  return <Editor link="/api/articles" room={id} />
}
