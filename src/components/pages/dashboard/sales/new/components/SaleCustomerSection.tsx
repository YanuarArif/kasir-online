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
  {
    id: "cust1",
    name: "Pelanggan Umum",
    phone: "-",
    email: "-",
    NIK: "-",
    NPWP: "-",
  },
  {
    id: "cust2",
    name: "PT Maju Jaya",
    phone: "08123456789",
    email: "info@majujaya.com",
    NIK: "3201234567890001",
    NPWP: "01.234.567.8-901.000",
  },
  {
    id: "cust3",
    name: "Toko Sejahtera",
    phone: "08198765432",
    email: "toko@sejahtera.com",
    NIK: "3209876543210001",
    NPWP: "02.345.678.9-012.000",
  },
];

const SaleCustomerSection: React.FC<SaleCustomerSectionProps> = ({
  control,
  isPending,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    NIK: "",
    NPWP: "",
  });

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      // Update form values
      control._formValues.customerId = customerId;

      // Set NIK and NPWP fields if available
      if (customer.NIK && customer.NIK !== "-") {
        control._formValues.customerNIK = customer.NIK;
        control.setValue("customerNIK", customer.NIK);
      } else {
        control._formValues.customerNIK = "";
        control.setValue("customerNIK", "");
      }

      if (customer.NPWP && customer.NPWP !== "-") {
        control._formValues.customerNPWP = customer.NPWP;
        control.setValue("customerNPWP", customer.NPWP);
      } else {
        control._formValues.customerNPWP = "";
        control.setValue("customerNPWP", "");
      }
    }
  };

  // Handle new customer input changes
  const handleNewCustomerChange = (field: string, value: string) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle new customer save
  const handleSaveNewCustomer = () => {
    // Validate required fields
    if (!newCustomer.name) {
      alert("Nama pelanggan harus diisi");
      return;
    }

    // Create a new customer ID (in a real app, this would be handled by the backend)
    const newId = `cust${mockCustomers.length + 1}`;

    // Create the new customer object
    const customerToAdd = {
      id: newId,
      name: newCustomer.name,
      phone: newCustomer.phone || "-",
      email: newCustomer.email || "-",
      address: newCustomer.address || "-",
      NIK: newCustomer.NIK || "-",
      NPWP: newCustomer.NPWP || "-",
    };

    // Add to mock customers (in a real app, this would be an API call)
    mockCustomers.push(customerToAdd);

    // Select the new customer
    setSelectedCustomer(customerToAdd);
    control._formValues.customerId = newId;

    // Reset the form and close the dialog
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      NIK: "",
      NPWP: "",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
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
                <Input
                  className="col-span-3"
                  placeholder="Nama pelanggan"
                  value={newCustomer.name}
                  onChange={(e) =>
                    handleNewCustomerChange("name", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Telepon</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Nomor telepon"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    handleNewCustomerChange("phone", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Email</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    handleNewCustomerChange("email", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Alamat</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Alamat"
                  value={newCustomer.address}
                  onChange={(e) =>
                    handleNewCustomerChange("address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">NIK</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Nomor Induk Kependudukan"
                  value={newCustomer.NIK}
                  onChange={(e) =>
                    handleNewCustomerChange("NIK", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">NPWP</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Nomor Pokok Wajib Pajak"
                  value={newCustomer.NPWP}
                  onChange={(e) =>
                    handleNewCustomerChange("NPWP", e.target.value)
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveNewCustomer}>Simpan</Button>
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

        <FormField
          control={control}
          name="customerNIK"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Induk Kependudukan"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="customerNPWP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NPWP (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Pokok Wajib Pajak"
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
                <div>
                  <span className="font-medium">NIK:</span>{" "}
                  {selectedCustomer.NIK}
                </div>
                <div>
                  <span className="font-medium">NPWP:</span>{" "}
                  {selectedCustomer.NPWP}
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
