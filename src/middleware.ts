import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth()

    if (!session?.user) {
      const callbackUrl = request.url
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url)
      )
    }
  }

  if (request.nextUrl.pathname === '/') {
    const response = NextResponse.next()
    // 首页数据在构建时打包，属于静态内容：允许浏览器缓存 10 分钟，
    // 过期后先展示旧页面并在后台刷新（stale-while-revalidate）
    response.headers.set(
      'Cache-Control',
      'public, max-age=600, stale-while-revalidate=86400'
    )
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/']
}