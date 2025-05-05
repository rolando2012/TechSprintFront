import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import {jwtVerify} from 'jose'


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const jwt = request.cookies.get('access_token')
    //console.log("first")

    try{
        if(request.nextUrl.pathname.includes('/administrador')){
            if(jwt === undefined){
                return NextResponse.redirect(new URL('/',request.url))
            }
            const {payload} =  await jwtVerify(jwt.value,  new TextEncoder().encode(process.env.JWT_SECRET));
            if(payload.rol==='Administrador'){
                return NextResponse.next()
            }else return NextResponse.redirect(new URL('/',request.url))
            
        }else if(request.nextUrl.pathname.includes('/tutor')){
            if(jwt === undefined){
                return NextResponse.redirect(new URL('/',request.url))
            }
            const {payload} =  await jwtVerify(jwt.value,  new TextEncoder().encode(process.env.JWT_SECRET));
            
            if(payload.rol==='Tutor'){
                return NextResponse.next()
            }else return NextResponse.redirect(new URL('/',request.url))
        }
        
        
    }catch(error){
        console.error(error);
        return NextResponse.redirect(new URL("/",request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|serviceWorker).*)',
        '/registro/:path','/',
    ]
,
}
