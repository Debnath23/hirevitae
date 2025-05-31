import type React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col px-32">
      <header className="w-full py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-blue-600">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                NI
              </div>
            </div>
            <span className="font-bold">Near Me</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-2">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
              {/* <Image
                src="https://images.pexels.com/photos/7203879/pexels-photo-7203879.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Interior design showcase"
                width={800}
                height={1000}
                className="object-cover w-full h-full "
              /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-2xl font-bold">
                  Grow Your Real Estate Business
                </h2>
                <p className="mt-2">
                  Connect with customers and showcase your services on Near Me
                </p>
              </div>
            </div>
          </div>

          <div>{children}</div>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Near Me. All rights reserved.
      </footer>
    </div>
  );
}
