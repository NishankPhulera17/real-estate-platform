import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Define protected routes and roles allowed
const protectedRoutes = [
  { path: "/dashboard/admin", roles: ["ADMIN"] },
  { path: "/dashboard/builder", roles: ["BUILDER", "ADMIN"] },
  { path: "/dashboard/broker", roles: ["BROKER", "ADMIN"] },
  { path: "/dashboard", roles: ["BUYER", "GUEST", "ADMIN", "BUILDER", "BROKER"] }
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  if (isApiAuthRoute) return NextResponse.next();

  const matchingRoute = protectedRoutes.find(route => 
    nextUrl.pathname.startsWith(route.path)
  );

  if (matchingRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
    }
    
    if (!matchingRoute.roles.includes(userRole as string)) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
