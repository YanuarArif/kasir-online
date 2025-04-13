"use client";

import { Input } from "@/components/ui/input";
import { VscAccount } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import {
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdPerson,
} from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DaftarSchema } from "@/schemas/zod";
import { register } from "@/actions/register";
import { ErrorMessage } from "../ui/errormessage";
import { SuccessMessage } from "../ui/successmessage";
import { signIn } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
// import { useRouter } from "next/navigation";

// interface DaftarCardProps {
//   setLogin: (login: SignInFlow) => void;
// }

const RegisterCard = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isAuthenticating, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof DaftarSchema>>({
    resolver: zodResolver(DaftarSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Watch for changes in form errors
    const subscription = form.watch(() => {
      if (Object.keys(form.formState.errors).length > 0) {
        setShowMessage(true);
        // const timer = setTimeout(() => setShowMessage(false), 5000);
        // return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof DaftarSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setSuccess(data.success);

            // Redirect after 2 sec
            setTimeout(() => {
              if (data.redirectTo) {
                router.push(data.redirectTo);
              }
            }, 2000);
          }
        })
        .catch(() => {
          setError("Terjadi kesalahan saat mendaftar");
        });
    });
  };

  return (
    <>
      <ErrorMessage
        error={error}
        onClose={() => setError(undefined)}
        duration={5000}
      />
      <SuccessMessage
        success={success}
        onClose={() => setSuccess(undefined)}
        duration={5000}
      />
      <Card
        className={`w-full h-full ${
          error
            ? "border-4 border-destructive animate-vibrate"
            : success
              ? "border-4 border-emerald-500"
              : ""
        }`}
      >
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <CardTitle className="text-3xl lg:text-4xl font-bold text-center">
            Selamat Datang
          </CardTitle>
          <CardDescription className="text-lg font-light text-center">
            Silahkan daftar untuk bisa mengakses akun.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Form */}
              <div className="relative">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex relative items-center">
                          <MdPerson className="absolute left-3" />
                          <Input
                            className={`pl-10 text-base md:text-lg h-12
                        ${
                          form.formState.errors.username
                            ? "border-red-300 focus-visible:ring-red-300"
                            : ""
                        }`}
                            placeholder="Username"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {showMessage && (
                        <FormMessage
                          className="absolute pt-1 pl-1 text-center top-10 font-bold text-xs
                      transform transition-all duration-300 ease-in-out
                      animate-in slide-in-from-top-1"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
              {/* Email Form */}
              <div className="relative">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex relative items-center">
                          <VscAccount className="absolute left-3" />
                          <Input
                            className={`pl-10 text-base md:text-lg h-12
                        ${
                          form.formState.errors.email
                            ? "border-red-300 focus-visible:ring-red-300"
                            : ""
                        }`}
                            placeholder="Email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {showMessage && (
                        <FormMessage
                          className="absolute pt-1 pl-1 text-center top-10 font-bold text-xs
                      transform transition-all duration-300 ease-in-out
                      animate-in slide-in-from-top-1"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
              {/* Password Form */}
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex relative items-center">
                          <MdOutlineLock className="absolute left-3" />
                          <Input
                            className={`pl-10 text-base md:text-lg h-12
                        ${
                          form.formState.errors.password
                            ? "border-red-300 focus-visible:ring-red-300"
                            : ""
                        }`}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 focus:outline-none text-sm"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? (
                              <MdOutlineVisibility />
                            ) : (
                              <MdOutlineVisibilityOff />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {showMessage && (
                        <FormMessage
                          className="absolute pt-1 pl-1 text-center top-10 font-bold text-xs
                      transform transition-all duration-300 ease-in-out
                      animate-in slide-in-from-top-1"
                        />
                      )}
                    </FormItem>
                  )}
                />
              </div>
              {/* Tombol Daftar */}
              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                {isAuthenticating ? (
                  <p className="text-base">Memproses...</p>
                ) : (
                  <p className="text-base">Daftar</p>
                )}
              </Button>
            </form>
          </Form>
          <div className="flex items-center">
            <div className="border-t dark:border-gray-700 mr-[10px] flex-1" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="border-t dark:border-gray-700 ml-[10px] flex-1" />
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              signIn("google", { callbackUrl: "/dashboard" });
            }}
            className="w-full flex items-center justify-center gap-2 h-10"
          >
            <FcGoogle className="h-5 w-5" />
            <span>Daftar dengan Google</span>
          </Button>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Sudah punya akun?{" "}
              <span
                onClick={() => router.push("/login")}
                className="cursor-pointer font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RegisterCard;
