"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Building2,
  CreditCard,
  Tag,
  Globe,
  FileText,
} from "lucide-react";
import { SupplierFormValues } from "../types";
import { Control } from "react-hook-form";
import BasicInfoSection from "./BasicInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import FinancialInfoSection from "./FinancialInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";

interface SupplierFormTabsProps {
  control: Control<SupplierFormValues>;
  isPending: boolean;
}

const SupplierFormTabs: React.FC<SupplierFormTabsProps> = ({
  control,
  isPending,
}) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Informasi Dasar</span>
            <span className="sm:hidden">Dasar</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Kontak</span>
            <span className="sm:hidden">Kontak</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Keuangan</span>
            <span className="sm:hidden">Keuangan</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Tambahan</span>
            <span className="sm:hidden">Lainnya</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="basic" className="mt-4">
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50">
            <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informasi Dasar Supplier
            </CardTitle>
            <CardDescription>
              Masukkan informasi dasar supplier Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <BasicInfoSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="mt-4">
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-950/30 border-b border-green-100 dark:border-green-900/50">
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Kontak
            </CardTitle>
            <CardDescription>
              Masukkan informasi kontak dan alamat supplier
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ContactInfoSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="financial" className="mt-4">
        <Card>
          <CardHeader className="bg-purple-50 dark:bg-purple-950/30 border-b border-purple-100 dark:border-purple-900/50">
            <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informasi Keuangan
            </CardTitle>
            <CardDescription>
              Masukkan informasi pembayaran dan bank
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FinancialInfoSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="additional" className="mt-4">
        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/50">
            <CardTitle className="text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informasi Tambahan
            </CardTitle>
            <CardDescription>
              Masukkan catatan dan informasi tambahan lainnya
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AdditionalInfoSection control={control} isPending={isPending} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SupplierFormTabs;
