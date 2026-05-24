import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, signToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get('username')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  if (!validateCredentials(username, password)) {
    return NextResponse.redirect(new URL('/login?error=1', request.url))
  }

  const token = await signToken(username)

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  })

  return response
}
