export async function POST() {
  const expiredDate = new Date(0).toUTCString();

  const response = new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        `next-auth.session-token=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `__Secure-next-auth.session-token=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `next-auth.csrf-token=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `__Secure-next-auth.csrf-token=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `token=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `next-auth.callback-url=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
        `__Secure-next-auth.callback-url=; Path=/; Expires=${expiredDate}; HttpOnly; Secure`,
      ].join(", "),
    },
  });

  return response;
}
