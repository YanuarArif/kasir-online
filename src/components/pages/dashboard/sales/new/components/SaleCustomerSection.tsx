"use client";

import React, { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaleFormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SaleCustomerSectionProps {
  control: Control<SaleFormValues>;
  isPending: boolean;
}

// Mock customer data
const mockCustomers = [
  { id: "cust1", name: "Pelanggan Umum", phone: "-", email: "-" },
  {
    id: "cust2",
    name: "PT Maju Jaya",
    phone: "08123456789",
    email: "info@majujaya.com",
  },
  {
    id: "cust3",
    name: "Toko Sejahtera",
    phone: "08198765432",
    email: "toko@sejahtera.com",
  },
];

const SaleCustomerSection: React.FC<SaleCustomerSectionProps> = ({
  control,
  isPending,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      // Update form value if needed
      control._formValues.customerId = customerId;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informasi Pelanggan</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Pelanggan Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi pelanggan baru untuk ditambahkan ke database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Nama</FormLabel>
                <Input className="col-span-3" placeholder="Nama pelanggan" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Telepon</FormLabel>
                <Input className="col-span-3" placeholder="Nomor telepon" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Email</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Alamat</FormLabel>
                <Input className="col-span-3" placeholder="Alamat" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pelanggan</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCustomerSelect(value);
                }}
                defaultValue={field.value || mockCustomers[0].id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoiceRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Faktur (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: INV-001"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Customer Info Card */}
      {selectedCustomer && (
        <div className="bg-muted/50 rounded-lg p-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{selectedCustomer.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Telepon:</span>{" "}
                  {selectedCustomer.phone}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedCustomer.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleCustomerSection;
