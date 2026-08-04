import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Jerin Email na gaskiya masu ikon shiga MD Office
const ALLOWED_MD_EMAILS = [
  'sorondinkiseeme@gmail.com',
  'mariyashehuibrahim@gmail.com'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Karanta Session Cookies ko Auth Token
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const userEmail = request.cookies.get('userEmail')?.value || '';
  const userRole = request.cookies.get('userRole')?.value || '';

  // 1. KARIYAR SHAFIN MD OFFICE (/app/md-office ko /md-office)
  if (pathname.startsWith('/md-office')) {
    // Idan bai yi login ba -> Tura shi Login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/apt-login', request.url));
    }

    // Idan Email dinsa baya cikin ALLOWED_MD_EMAILS -> Tura shi Landing Page
    const isAuthorizedMD = ALLOWED_MD_EMAILS.some(
      (email) => email.toLowerCase() === userEmail.toLowerCase()
    );

    if (!isAuthorizedMD) {
      // Direct Kick-out zuwa Landing Page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. KARIYAR SAURAN ROLE-BASED ROUTES
  // Misali: Kariya ga Agent Portal
  if (pathname.startsWith('/agent') && userRole !== 'AGENT' && !ALLOWED_MD_EMAILS.includes(userEmail)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Misali: Kariya ga Finance Module
  if (pathname.startsWith('/finance') && userRole !== 'FINANCE' && !ALLOWED_MD_EMAILS.includes(userEmail)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Saita waɗanne shafuka ne kawai Middleware ɗin zai tsare (Matcher)
export const config = {
  matcher: [
    '/md-office/:path*',
    '/agent/:path*',
    '/finance/:path*',
    '/pharmacy/:path*',
  ],
};
