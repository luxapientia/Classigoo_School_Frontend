import { NextResponse } from "next/server";
import { jwtVerify, importSPKI } from 'jose';

// Cache the public key at module level
let cachedPublicKey = null;

// Initialize the public key
async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey;
  
  let publicKeyPEM = process.env.JWT_PUBLIC_KEY;
  publicKeyPEM = publicKeyPEM.replace(/\\n/g, "\n");
  
  cachedPublicKey = await importSPKI(publicKeyPEM, "RS256");
  return cachedPublicKey;
}

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path.startsWith("/auth/") || path === "/auth";

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Get the cached public key
  const publicKey = await getPublicKey();

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    try {
      // Verify JWT token
      const { payload } = await jwtVerify(token, publicKey, {
        algorithms: ['RS256'],
      });
      isValidToken = true;
    } catch (error) {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && isValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Redirect unauthenticated users to login page
  if (!isPublicPath && !isValidToken) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.delete("token"); // Clear invalid token
    return response;
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    "/",
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
