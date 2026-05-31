import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  if (hostname === 'training.rinseitoff.com' && !request.nextUrl.pathname.startsWith('/training')) {
    const url = request.nextUrl.clone();
    url.pathname = '/training';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
