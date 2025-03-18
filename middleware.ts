import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/coming-soon','/order(.*)','/customer-detail','/receipt/(.*)'])
const isAdminRoute = createRouteMatcher(['/dashboard','/menu-editor','/order-list','/inventory(.*)', '/setting'])
const isStaffRoute = createRouteMatcher(['/kiosk-order','/delivery-order'])

export default clerkMiddleware(async (auth, request) => {
  if(isAdminRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'admin'){
    const url = new URL('/',request.url)
    return NextResponse.redirect(url)
  }
  if(isStaffRoute(request) && (await auth()).sessionClaims?.metadata?.role !== 'staff'){
    const url = new URL('/',request.url)
    return NextResponse.redirect(url)
  }
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})


export const config = {
  matcher: [
    // Exclude API routes
    '/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for tRPC routes if needed
    '/(trpc)(.*)',
  ],
};