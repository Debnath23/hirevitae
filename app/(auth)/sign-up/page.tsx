import SignUpForm from "@/components/auth/sign-up-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - HireVitae",
  description:
    "Create your account on HireVitae to start connecting with top talent and opportunities.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
