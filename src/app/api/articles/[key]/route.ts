//@ts-ignore
import { setupWSConnection, setPersistence } from "y-websocket/bin/utils"
import { applyUpdateV2, encodeStateAsUpdateV2, type Doc } from "yjs"
import { z } from "zod"
import type { IncomingMessage } from "http"
import type { WebSocketServer, WebSocket } from "ws"

import { db } from "@/database/db"
import { schema } from "@/app/api/articles/schema"
import { getCookie } from "@/lib/getCookie"
import { auth, config } from "@/auth"
import { Auth, createActionURL } from '@auth/core'
import type { NextAuthConfig, Session } from "next-auth"
import Y from 'yjs'
import _ from "lodash"

/** Taken unmodified from Auth.JS because they don't export this. The auth() function results in an error and there seem to be a problem with headers() from "next/headers". It's a work-around until next-ws package makes it to Next in one way or another. */
async function getSession(headers: Headers, config: NextAuthConfig) {
  const url = createActionURL(
    "session",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers.get("x-forwarded-proto"),
    headers,
    process.env,
    config.basePath
  )
  const request = new Request(url, {
    headers: { cookie: headers.get("cookie") ?? "" },
  })

  return Auth(request, {
    ...config,
    callbacks: {
      ...config.callbacks,
      // Since we are server-side, we don't need to filter out the session data
      // See https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
      // TODO: Taint the session data to prevent accidental leakage to the client
      // https://react.dev/reference/react/experimental_taintObjectReference
      async session(...args) {
        const session =
          // If the user defined a custom session callback, use that instead
          (await config.callbacks?.session?.(...args)) ?? {
            ...args[0].session,
            expires:
              args[0].session.expires?.toISOString?.() ??
              args[0].session.expires,
          }
        const user = args[0].user ?? args[0].token
        return { user, ...session } satisfies Session
      },
    },
  }) as Promise<Response>
}

export async function SOCKET(
  client: WebSocket,
  request: IncomingMessage,
  server: WebSocketServer,
) {
  const [user, cookie] = await getSession(
    // @ts-expect-error
    new Headers(request.headers),
    config
  ).then(async (authResponse) => {
    const auth = await authResponse.json()

    return [auth satisfies Session | null, authResponse.headers.getSetCookie()]
  })
  
  server.once('headers', (headers) => {
    headers.push('Set-Cookie: ' + cookie);
  })

  if (!user) return client.close(3000)
  
  console.log(
    `A client connected through a Websocket connection:`,
    `${request.headers.origin}${request.url}`,
  )

  setPersistence({
    bindState: async (id: string, document: Doc) => {
      const article = await db.article.findUnique({
        where: { id: id.split('/').at(-1)! },
      })
      
      if (!article) return client.close(3000)

      const content = article?.content

      if (content) applyUpdateV2(
        document, 
        new Uint8Array(
          content.buffer, 
          content.byteOffset, 
          content.byteLength
        )
      )
    },
    writeState: async (id: string, document: Doc) => {
      /** Runs if last user closed document */
      const content = Buffer.from(encodeStateAsUpdateV2(document))

      await db.article.update({
        where: { id: id.split('/').at(-1)! },
        data: { content }
      })
    },
  })

  const docName = getCookie(request?.headers?.cookie!, "roomName")
  setupWSConnection(client, request, { ...(docName && { docName }) })
}

export async function DELETE(
  request: Request,
  { params: { key } }: { params: { key: string } }
) {
  await db.article.delete({
    where: {
      id: key
    }
  })

  return new Response('OK', {
    status: 200
  })
}

const encoder = new TextEncoder()

const handleUpdate = async (query: {
    where: { id: string }
    data: Omit<z.infer<typeof schema>, 'preview'> & { preview?: Buffer }
  }, 
  connections: Connection[]
) => {
  const article = await db.article.update({
    ...query,
    select: {
      isPublic: true,
      title: true,
      slug: true
    }
  })

  connections.forEach(async (connection) => {
    await connection.writer?.write(encoder.encode(JSON.stringify(article)))
  })
}

interface Connection 
  extends Request 
    { writer?: WritableStreamDefaultWriter } {}

/**
 * @description
 * Key-value pairs where key is an id of the article
 * and value is an array of active users connections
 */
const connections: Record<string, Connection[]> = {}

export async function GET(
  request: Request,
  { params: { key } }: { params: { key: string } }
) {
  const article = await db.article.findFirst({
    where: {
      OR: [
        { id: key },
        { slug: key }
      ]
    }
  })

  if (!article || (!article.isPublic && !(await auth()))) 
    return new Response('Not Found', { status: 404 })

  if (request.headers.get('accept') !== 'text/event-stream') {
    const { content, ...articleNoContent } = article

    return Response.json(articleNoContent)
    // Finish later, send HTML to the frontend
    // if (content) {
    //   const yDoc = new Y.Doc()
    //   Y.applyUpdateV2(yDoc, new Uint8Array(
    //     content.buffer, 
    //     content.byteOffset, 
    //     content.byteLength
    //   ))
    // }
  }

  let responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()

  const connection: Connection = new Request(request)
  connection.writer = writer
  connections[key] = [...(connections[key] ?? []), connection]
  
  writer.write(encoder.encode(JSON.stringify(_.pick(article, ['title', 'slug', 'isPublic']))))

  request.signal.onabort = async () => {
    connections[key] = (connections[key]).filter(connection => {
      return connection.headers.get('x-request-id') !== request.headers.get('x-request-id')
    })

    if (!(connections[key].length > 0))
      delete connections[key]

    await writer.close()    
  }

  return new Response(responseStream.readable, {
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*',
      'Connection': 'keep-alive'
    }
  })
}

export async function PATCH(
  request: Request,
  { params: { key } }: { params: { key: string } }
) {
  if (!(await auth())) return new Response('Not Found', {
    status: 404
  })

  const body = await request.json()

  const { data, error } = schema.safeParse(body?.data)

  let buffer

  if (data?.preview) {
    buffer = Buffer.from(data.preview, 'base64')
  }     

  const dataNoPreview = _.omit(data, ['preview'])

  const dataWithBuffer = {
    ...(dataNoPreview),
    ...(buffer ? { preview: buffer} : {})
  }

  if (error)
    return Response.json(error.formErrors.fieldErrors, { status: 400 })

  await handleUpdate({ where: { id: key }, data: dataWithBuffer }, connections[key])

  return new Response('OK', { status: 200 })
}