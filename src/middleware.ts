import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)

// Define available roles
enum Role {
  Administrador = 'Administrador',
  Tutor = 'Tutor',
}

const roleRedirects: Record<Role, string> = {
  [Role.Administrador]: '/administrador',
  [Role.Tutor]: '/tutor',
}

// Helper: verify JWT and return payload or null
async function getPayload(token?: string): Promise<{ rol: Role } | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    // Ensure the payload.rol matches our Role enum
    if (payload && typeof payload === 'object' && 'rol' in payload) {
      const rol = (payload as any).rol as Role
      if (Object.values(Role).includes(rol)) {
        return { rol }
      }
    }
    return null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const payload = await getPayload(token)
  const role = payload?.rol

  // Home page: redirect based on role
  if (pathname === '/') {
    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], request.url))
    }
    return NextResponse.next()
  }

  // Administrator routes
  if (pathname.startsWith('/administrador')) {
    if (role === Role.Administrador) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Tutor routes
  if (pathname.startsWith('/tutor')) {
    if (role === Role.Tutor) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Public or other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|serviceWorker|images).*)',
    '/registro/:path*',
  
  ],
};
