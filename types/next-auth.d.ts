import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    access_token: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      access_token: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    access_token: string;
  }
}
