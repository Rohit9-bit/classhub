import { NextResponse, NextRequest } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  if(token && (url.pathname === "/" || url.pathname === "/sign-in" || url.pathname === "/sign-up")){
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up"],
};
