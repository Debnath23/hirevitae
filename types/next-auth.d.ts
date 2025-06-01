import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    access_token: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Session {
    user: User;
    access_token: string;
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    exp?: number;
    iat?: number;
    user: User;
  }
}
