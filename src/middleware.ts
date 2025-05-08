import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  return NextResponse.next();
  
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.ico$).*)',
  ],
};