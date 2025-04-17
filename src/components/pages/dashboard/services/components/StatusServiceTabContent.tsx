import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServiceStatus } from "../types";
import { ClipboardList } from "lucide-react";

export const StatusServiceTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-4 cursor-pointer">
          <TabsTrigger value="pending" className="cursor-pointer">
            Servis Masuk
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="cursor-pointer">
            Diproses
          </TabsTrigger>
          <TabsTrigger value="waiting-for-parts" className="cursor-pointer">
            Menunggu Sparepart
          </TabsTrigger>
          <TabsTrigger value="completed" className="cursor-pointer">
            Selesai
          </TabsTrigger>
        </TabsList>

        {/* Servis Masuk Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-center text-lg">
                Servis Masuk
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">
                  Belum ada data servis masuk
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Servis masuk akan ditampilkan di sini. Tambahkan servis baru
                  untuk memulai.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diproses Tab */}
        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-center text-lg">
                Servis Diproses
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">
                  Belum ada data servis diproses
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Servis yang sedang diproses akan ditampilkan di sini.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menunggu Sparepart Tab */}
        <TabsContent value="waiting-for-parts" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-center text-lg">
                Menunggu Sparepart
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">
                  Belum ada data servis menunggu sparepart
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Servis yang sedang menunggu sparepart akan ditampilkan di
                  sini.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Selesai Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
              <CardTitle className="text-center text-lg">
                Servis Selesai
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">
                  Belum ada data servis selesai
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Servis yang telah selesai akan ditampilkan di sini.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
