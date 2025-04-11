"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomerSchema } from "@/schemas/zod";
import { addCustomer } from "@/actions/customers";
import { toast } from "sonner";

type FormData = z.infer<typeof CustomerSchema>;

const NewCustomerPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await addCustomer(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        // Redirect to customers list
        router.push("/dashboard/customers");
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Add dark mode background and ring */}
        <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-3">
                {/* Add dark mode text color */}
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Nama Pelanggan *
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to input */}
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Name */}
              <div className="sm:col-span-3">
                {/* Add dark mode text color */}
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Nama Kontak
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to input */}
                  <input
                    type="text"
                    id="contactName"
                    {...register("contactName")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                {/* Add dark mode text color */}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Email
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to input */}
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                {/* Add dark mode text color */}
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Telepon
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to input */}
                  <input
                    type="text"
                    id="phone"
                    {...register("phone")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="col-span-full">
                {/* Add dark mode text color */}
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Alamat
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to textarea */}
                  <textarea
                    id="address"
                    rows={3}
                    {...register("address")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-full">
                {/* Add dark mode text color */}
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Catatan
                </label>
                <div className="mt-2">
                  {/* Add dark mode styles to textarea */}
                  <textarea
                    id="notes"
                    rows={3}
                    {...register("notes")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.notes.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Add dark mode border and button text color */}
          <div className="flex items-center justify-end gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
              disabled={isSubmitting}
            >
              Batal
            </button>
            {/* Add dark mode hover style */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCustomerPage;
