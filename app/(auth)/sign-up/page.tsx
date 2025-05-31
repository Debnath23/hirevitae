import SignUpForm from "@/components/auth/sign-up-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Near Me",
  description:
    "Create an account to start managing your business",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
