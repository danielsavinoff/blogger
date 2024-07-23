import { db } from "@/database/db"
import { schema } from "@/app/api/articles/schema"
import { auth } from "@/auth"
import _ from "lodash"

export async function POST(request: Request) {
  if (!(await auth())) return new Response('Not Found', {
    status: 404
  })

  const body = request.bodyUsed ? await request.json() : {}

  const { data, error } = schema.safeParse(body)

  if (error) return Response.json(error.formErrors.fieldErrors, { status: 400 })

  let buffer

  if (data?.preview) {
    buffer = Buffer.from(data.preview, 'base64')
  }
  
  const dataNoPreview = _.omit(data, ['preview'])

  const dataWithBuffer = {
    ...(dataNoPreview),
    ...(buffer ? { preview: buffer} : {})
  }

  const article = await db.article.create({
    data: dataWithBuffer,
  })

  return Response.json({ id: article.id })
}

export async function GET() {
  const articles = await db.article.findMany()

  const articlesWithBase64Preview = []

  for(const value of articles) {
    articlesWithBase64Preview.push({
      ...(_.omit(value, ['preview'])),
      ...(value.preview ? { preview: value.preview.toString('base64') } : {})
    })
  }

  return Response.json(articlesWithBase64Preview)
}
