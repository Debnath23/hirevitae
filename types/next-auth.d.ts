import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    access_token: string;
    createdAt?: string;
    updatedAt?: string;
    collection?: string;
    loginAttempts?: number;
    name?: string;
    avatar?: string | null;
    username?: string;
    phone?: string | null;
    email_verified_at?: string | null;
    remember_me_token?: string | null;
    password?: string;
    oauth?: string | null;
    role?: string;
    professional_title?: string | null;
    bio?: string | null;
    job_search?: number;
    experience_level?: string | null;
    job_type?: string | null;
    skills?: string | null;
    languages?: string | null;
    cv?: string | null;
    score?: number;
    active?: boolean;
    country_id?: number;
    city?: string | null;
    job_credits?: number;
    courses_enrolled?: number;
    courses_completed?: number;
    published_courses?: number;
    reviews_count?: number;
    github_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
    website?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    approved?: boolean;
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
