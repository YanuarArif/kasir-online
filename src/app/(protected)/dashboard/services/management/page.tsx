"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WrenchIcon } from "@heroicons/react/24/outline";

const ServiceManagementPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Servis</h1>
      </div>

      <Card>
        <CardHeader className="bg-gray-100 dark:bg-gray-800">
          <CardTitle className="text-center text-lg">Manajemen Servis</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <WrenchIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Halaman Manajemen Servis</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md">
              Halaman ini akan berisi fitur untuk mengelola layanan servis yang ditawarkan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagementPage;
