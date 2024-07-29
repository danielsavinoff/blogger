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

  if (data?.cover) {
    buffer = Buffer.from(data.cover, 'base64')
  }
  
  const dataNocover = _.omit(data, ['cover'])

  const dataWithBuffer = {
    ...(dataNocover),
    ...(buffer ? { cover: buffer} : {})
  }

  const article = await db.article.create({
    data: dataWithBuffer,
  })

  return Response.json({ id: article.id })
}

export async function GET() {
  const articles = await db.article.findMany()

  const articlesWithBase64Cover = []

  for(const value of articles) {
    articlesWithBase64Cover.push({
      ...(_.omit(value, ['cover'])),
      ...(value.cover ? { cover: value.cover.toString('base64') } : {})
    })
  }

  return Response.json(articlesWithBase64Cover)
}
