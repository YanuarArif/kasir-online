"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SupplierFormValues } from "../types";
import { User, Mail, Phone, MapPin, Globe, AtSign } from "lucide-react";

interface ContactInfoSectionProps {
  control: Control<SupplierFormValues>;
  isPending: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  control,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      {/* Contact Name */}
      <FormField
        control={control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-green-600" />
              Nama Kontak
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan nama kontak person"
                {...field}
                disabled={isPending}
                className="border-green-200 focus-visible:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Nama orang yang dapat dihubungi di perusahaan supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-green-600" />
              Email
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="email@supplier.com"
                {...field}
                disabled={isPending}
                className="border-green-200 focus-visible:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Alamat email untuk komunikasi dengan supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone */}
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-green-600" />
              Nomor Telepon
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Masukkan nomor telepon"
                {...field}
                disabled={isPending}
                className="border-green-200 focus-visible:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Nomor telepon untuk menghubungi supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-600" />
              Alamat
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Masukkan alamat lengkap supplier"
                {...field}
                disabled={isPending}
                className="min-h-24 border-green-200 focus-visible:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Alamat lengkap lokasi supplier
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Website */}
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-green-600" />
              Website
            </FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.supplier.com"
                {...field}
                disabled={isPending}
                className="border-green-200 focus-visible:ring-green-500"
              />
            </FormControl>
            <FormDescription>
              Alamat website resmi supplier (opsional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Social Media */}
      <div className="space-y-4 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <AtSign className="h-4 w-4 text-green-600" />
          Media Sosial (Opsional)
        </h3>
        
        <FormField
          control={control}
          name="socialMedia.facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Facebook</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username Facebook"
                  {...field}
                  disabled={isPending}
                  className="border-green-100 focus-visible:ring-green-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="socialMedia.instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Instagram</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username Instagram"
                  {...field}
                  disabled={isPending}
                  className="border-green-100 focus-visible:ring-green-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
