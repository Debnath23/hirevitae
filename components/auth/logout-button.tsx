"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps extends ComponentProps<typeof Button> {
  showIcon?: boolean;
  callbackUrl?: string;
}

export default function LogoutButton({
  variant = "ghost",
  showIcon = true,
  children,
  callbackUrl = "/login",
  ...props
}: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl });
  };

  return (
    <Button variant={variant} onClick={handleLogout} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Logout"}
    </Button>
  );
}
