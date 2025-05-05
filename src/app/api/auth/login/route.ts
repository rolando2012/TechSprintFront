
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, code } = await req.json();

    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify({ email, password, code }),
      }
    );

    const data = await apiRes.json();

    if (!apiRes.ok) {
      // 400, 401, 500, etc.
      return NextResponse.json(
        { error: data.message || 'Error en autenticación' },
        { status: apiRes.status }
      );
    }
    console.log('[middleware] ruta=', req.nextUrl.pathname)

    // Todo OK: seteamos cookie de acceso
    const res = NextResponse.json({ success: true });
    res.cookies.set('access_token', data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 día
      sameSite: 'strict',
      //path: '/',
    });

    return res;
  } catch (err) {
    console.error('[login error]', err);
    return NextResponse.json(
      { error: 'Error de servidor. Intenta más tarde.' },
      { status: 500 }
    );
  }
}
