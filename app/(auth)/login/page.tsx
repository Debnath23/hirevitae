import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Near Me",
  description: "Sign in to your Near Me account",
};

export default function LoginPage() {
  return <LoginForm />;
}
