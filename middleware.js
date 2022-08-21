import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const secret = process.env.JWT_SECRET;

export async function middleware(req) {
  // The jwt token will exist, if user is logged in
  const token = await getToken({ req, secret });

  // The path of the request
  const { pathname } = req.nextUrl;

  // Allow the request if its a request for next-auth session & provider fetching
  // and also ifthe token exists
  if (pathname.includes('/api/auth') || pathname.includes('/_next') || token) {
    return NextResponse.next();
  }

  // redirect to login page, when disallowed request
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
