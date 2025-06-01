import type React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col px-32 bg-gray-100 ">
      <header className="w-full py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/logo.png" width={32} height={32} alt="logo" />
            </div>
            <span className="font-bold">HireVitae</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
