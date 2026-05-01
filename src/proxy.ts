import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define the routes that should be private
// This pattern matches /users, /segments, and any sub-pages (like /users/123)
const isProtectedRoute = createRouteMatcher([
  '/users(.*)', 
  '/segments(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Check if the current request is for a protected route
  if (isProtectedRoute(req)) {
    // 3. Force redirect to the Sign-In page if the user is not logged in
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};