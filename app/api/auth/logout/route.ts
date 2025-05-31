import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  const expiredDate = new Date(0);

  // Clear authentication cookies
  response.cookies.set("next-auth.session-token", "", {
    expires: expiredDate,
    path: "/",
  });

  response.cookies.set("__Secure-next-auth.session-token", "", {
    expires: expiredDate,
    path: "/",
    secure: true,
    httpOnly: true,
  });

  response.cookies.set("next-auth.csrf-token", "", {
    expires: expiredDate,
    path: "/",
  });

  response.cookies.set("__Secure-next-auth.csrf-token", "", {
    expires: expiredDate,
    path: "/",
    secure: true,
    httpOnly: true,
  });

  response.cookies.set("token", "", {
    expires: expiredDate,
    path: "/",
  });

  response.cookies.set("next-auth.callback-url", "", {
    expires: expiredDate,
    path: "/",
  });

  response.cookies.set("__Secure-next-auth.callback-url", "", {
    expires: expiredDate,
    path: "/",
    secure: true,
    httpOnly: true,
  });

  return response;
}
