// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  const token =  (await cookies()).get('access_token')?.value
  if (!token) return NextResponse.json({ logged: false })

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return NextResponse.json({ logged: true })
  } catch {
    return NextResponse.json({ logged: false })
  }
}
