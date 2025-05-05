// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.redirect(new URL('/', process.env.APP_URL))

  // En dev usamos sameSite lax para que http://localhost lo acepte
  const isProd = process.env.NODE_ENV === 'production'

  res.cookies.set({
    name: 'access_token',
    value: '',             // vacía
    httpOnly: true,
    secure: isProd,        // solo secure en producción
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 0,             // expira inmediatamente
    path: '/',             // debe coincidir con donde la pusiste originalmente
  })

  return res
}
