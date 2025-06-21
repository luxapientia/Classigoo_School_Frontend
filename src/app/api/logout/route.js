import { NextResponse } from "next/server";

export async function GET(request) {
  // Get the absolute origin from the request headers
  const origin = request.nextUrl.origin;

  // Construct the absolute URL for redirect
  const loginUrl = `${origin}/auth/login`;

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("token");
  return response;
}
