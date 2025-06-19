// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// // Form validation schema
// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(1, "Password is required"),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // Fixed: Use correct provider ID
//       const response = await signIn("credentials", {
//         redirect: false,
//         email: data.email,
//         password: data.password,
//       });

//       if (response?.ok) {
//         setSuccess(true);
//         router.push("/messages");
//         console.log("Login successful, redirecting to messages page.");
//       } else {
//         setError(response?.error || "Invalid email or password.");
//       }
//     } catch (err: any) {
//       console.error("Failed to login:", err);
//       setError(
//         err.message || "An unexpected error occurred. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
//       <div className="space-y-2 text-center">
//         <h1 className="text-3xl font-bold">Welcome Back</h1>
//         <p className="text-gray-500">Sign in to your account</p>
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert variant="default">
//           <AlertDescription>Login successful! Redirecting...</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="john@example.com"
//             {...register("email")}
//             className={errors.email ? "border-red-500" : ""}
//           />
//           {errors.email && (
//             <p className="text-sm text-red-500">{errors.email.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="••••••••"
//             {...register("password")}
//             className={errors.password ? "border-red-500" : ""}
//           />
//           {errors.password && (
//             <p className="text-sm text-red-500">{errors.password.message}</p>
//           )}
//           <Button
//             type="button"
//             variant="ghost"
//             className="h-auto p-0 text-xs text-gray-500 hover:text-red-600"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "HIDE" : "SHOW"}
//           </Button>
//         </div>

//         <Button
//           type="submit"
//           className="w-full bg-red-600 hover:bg-red-700"
//           disabled={isLoading}
//         >
//           {isLoading ? "Signing In..." : "Sign In"}
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (response?.ok) {
        setSuccess(true);
        router.push("/messages");
      } else {
        setError(response?.error || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Failed to login:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                Login successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <Button
                type="button"
                variant="ghost"
                className="h-auto cursor-pointer p-0 text-xs text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
