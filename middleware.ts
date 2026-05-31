import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname
  ).split(':')[0].toLowerCase();

  if (host === 'training.rinseitoff.com' && !request.nextUrl.pathname.startsWith('/training')) {
    const url = request.nextUrl.clone();
    url.pathname = '/training';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
