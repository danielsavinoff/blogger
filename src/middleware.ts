import {
  NextResponse,
} from "next/server"
import { auth, signIn } from "@/auth"

export default async function middleware(request: Request) {
  const pathname = new URL(request.url).pathname

  if (pathname === '/')
    return Response.redirect(new URL('/editorial', request.url))

  const user = await auth()

  if (pathname.startsWith('/editorial')) {
    if (!user) return Response.redirect(new URL('/signin', request.url))
  }

  const headers = new Headers(request.headers)
  headers.set('x-request-id', crypto.randomUUID())
  
  const response = NextResponse.next({
    request: {
      headers: headers,
    },
  })

  return response
}

// exclude icons and other useelses stuff