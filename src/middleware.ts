import { NextRequest, NextResponse } from 'next/server'

// Auth disabled — repo is private, no password protection for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
