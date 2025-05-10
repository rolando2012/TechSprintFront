import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function GET() {
  const token =  (await cookies()).get('access_token')?.value
  if (!token) return NextResponse.json({ logged: false })
  
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      )
      const role = (payload as any).rol as string | undefined
      return NextResponse.json({
        logged: true,
        role: role ?? null
      })
  } catch {
    return NextResponse.json({ logged: false })
  }
}
