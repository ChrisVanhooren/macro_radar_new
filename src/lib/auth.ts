import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'dev-secret-change-in-production-32chars!!'
)

const COOKIE_NAME = 'macro_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export { COOKIE_NAME, MAX_AGE }

export async function signToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export function validateCredentials(username: string, password: string): boolean {
  const pairs = [
    [process.env.AUTH_USER_1, process.env.AUTH_PASS_1],
    [process.env.AUTH_USER_2, process.env.AUTH_PASS_2],
  ]
  return pairs.some(([u, p]) => u && p && u === username && p === password)
}
