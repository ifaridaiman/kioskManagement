import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/',
  // '/coming-soon',
  '/order(.*)',
  '/customer-detail',
  '/receipt/(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/dashboard',
  '/menu-editor',
  '/order-list',
  '/inventory(.*)',
  '/setting',
]);

const isStaffRoute = createRouteMatcher([
  '/kiosk-order',
  '/delivery-order'
]);

export default clerkMiddleware(async (auth, request) => {
  const { sessionId, sessionClaims } = await auth();

  

  const isProtected = !isPublicRoute(request);

  // If user is not signed in and route is protected, redirect to sign-in
  if (!sessionId && isProtected) {
    const url = new URL('/sign-in', request.url);
    return NextResponse.redirect(url);
  }

  

  const role = sessionClaims?.metadata?.role;

  // Role-based redirects
  if (isAdminRoute(request)) {
    if (role !== 'admin') {
      console.warn('Wrong role: not admin');
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (isStaffRoute(request)) {
    if (role !== 'staff' && role !== 'admin') {
      console.warn('Wrong role: not staff');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude API and static routes
    '/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for tRPC routes if needed
    '/(trpc)(.*)',
  ],
};
