import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const isTrainingSubdomain = hostname.startsWith('training.');

  if (isTrainingSubdomain && !request.nextUrl.pathname.startsWith('/training')) {
    const url = request.nextUrl.clone();
    url.pathname = '/training' + (url.pathname === '/' ? '' : url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
