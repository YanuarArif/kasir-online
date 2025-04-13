"use client";

import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { useEffect, useState, useTransition } from "react";
import { VscAccount } from "react-icons/vsc";
import {
  MdOutlineLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

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
import { useRouter } from "next/navigation";
import { login } from "@/actions/login";
import { employeeLogin } from "@/actions/employee";
import { LoginSchema, EmployeeLoginSchema } from "@/schemas/zod";
import { ErrorMessage } from "../ui/errormessage";
import { SuccessMessage } from "../ui/successmessage";
import { signIn } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

const LoginCard = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const router = useRouter();

  // Regular user login form
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Employee login form
  const employeeForm = useForm<z.infer<typeof EmployeeLoginSchema>>({
    resolver: zodResolver(EmployeeLoginSchema),
    defaultValues: {
      companyUsername: "",
      employeeId: "",
      password: "",
    },
  });

  useEffect(() => {
    // Watch for changes in form errors
    const subscription = form.watch(() => {
      if (Object.keys(form.formState.errors).length > 0) {
        setShowMessage(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    // Watch for changes in employee form errors
    const subscription = employeeForm.watch(() => {
      if (Object.keys(employeeForm.formState.errors).length > 0) {
        setShowMessage(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [employeeForm]);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            return;
          }

          if (data?.success) {
            setSuccess(data.success);
            form.reset();

            // Redirect to dashboard after successful login
            if (data.redirectTo) {
              setTimeout(() => {
                router.push(data.redirectTo);
              }, 500); // Small delay to show success message
            }
          }
        })
        .catch((err) => {
          console.error("Error during login:", err);
          setError("Something went wrong");
        });
    });
  };

  const onEmployeeSubmit = (values: z.infer<typeof EmployeeLoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      employeeLogin(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            return;
          }

          if (data?.success) {
            setSuccess(data.success);
            employeeForm.reset();

            // Redirect to dashboard after successful login
            if (data.redirectTo) {
              setTimeout(() => {
                router.push(data.redirectTo);
              }, 500); // Small delay to show success message
            }
          }
        })
        .catch((err) => {
          console.error("Error during employee login:", err);
          setError("Something went wrong");
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
      <Card className="w-full h-full py-5 shadow-md">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="space-y-3 pb-5">
            <CardTitle className="text-3xl lg:text-4xl font-bold text-center">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-lg font-light text-center">
              {isEmployeeLogin
                ? "Silahkan login sebagai karyawan"
                : "Silahkan login untuk membuat pesanan"}
            </CardDescription>

            <div className="flex justify-center mt-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
                <button
                  type="button"
                  onClick={() => setIsEmployeeLogin(false)}
                  className={`px-4 py-2 text-sm rounded-md transition-all ${
                    !isEmployeeLogin
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Pemilik Bisnis
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmployeeLogin(true)}
                  className={`px-4 py-2 text-sm rounded-md transition-all ${
                    isEmployeeLogin
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Karyawan
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 md:px-10">
          {!isEmployeeLogin ? (
            <>
              {/* Regular user login form */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // For client-side signIn, we use the original syntax
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Google</span>
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="flex items-center justify-center gap-2"
                >
                  <FaFacebookSquare className="h-5 w-5 text-blue-600" />
                  <span>Facebook</span>
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground rounded">
                    Atau masuk dengan email
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                                type="email"
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

                  {/* Tombol Masuk */}
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  >
                    {isPending ? (
                      <p className="text-base">Memproses...</p>
                    ) : (
                      <p className="text-base">Masuk</p>
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              {/* Employee login form */}
              <Form {...employeeForm}>
                <form
                  onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)}
                  className="space-y-6"
                >
                  {/* Company Username Form */}
                  <div className="relative">
                    <FormField
                      control={employeeForm.control}
                      name="companyUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex relative items-center">
                              <BuildingStorefrontIcon className="absolute left-3 h-5 w-5" />
                              <Input
                                className={`pl-10 text-base md:text-lg h-12
                                ${
                                  employeeForm.formState.errors.companyUsername
                                    ? "border-red-300 focus-visible:ring-red-300"
                                    : ""
                                }`}
                                placeholder="Username Perusahaan"
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

                  {/* Employee ID Form */}
                  <div className="relative">
                    <FormField
                      control={employeeForm.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex relative items-center">
                              <VscAccount className="absolute left-3" />
                              <Input
                                className={`pl-10 text-base md:text-lg h-12
                                ${
                                  employeeForm.formState.errors.employeeId
                                    ? "border-red-300 focus-visible:ring-red-300"
                                    : ""
                                }`}
                                placeholder="ID Karyawan"
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
                      control={employeeForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex relative items-center">
                              <MdOutlineLock className="absolute left-3" />
                              <Input
                                className={`pl-10 text-base md:text-lg h-12
                                  ${
                                    employeeForm.formState.errors.password
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

                  {/* Tombol Masuk */}
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  >
                    {isPending ? (
                      <p className="text-base">Memproses...</p>
                    ) : (
                      <p className="text-base">Masuk Sebagai Karyawan</p>
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Daftar sekarang
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginCard;
