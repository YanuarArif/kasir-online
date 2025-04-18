"use client";

import React, { useState, useEffect } from "react";
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
import { SaleFormValues, Customer } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User, Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addCustomer } from "@/actions/customers";
import { getCustomersAction } from "@/actions/get-customers-action";

interface SaleCustomerSectionProps {
  control: Control<SaleFormValues>;
  isPending: boolean;
}

// Default customer for general sales
const defaultCustomer = {
  id: "default",
  name: "Pelanggan Umum",
  phone: "-",
  email: "-",
  NIK: "-",
  NPWP: "-",
};

const SaleCustomerSection: React.FC<SaleCustomerSectionProps> = ({
  control,
  isPending,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([defaultCustomer]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>(defaultCustomer);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    NIK: "",
    NPWP: "",
  });

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const result = await getCustomersAction();

      if (result.success && result.customers) {
        // Map the customers to include NIK and NPWP fields
        const mappedCustomers = result.customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          phone: customer.phone || "-",
          email: customer.email || "-",
          address: customer.address || "-",
          NIK: customer.NIK || "-",
          NPWP: customer.NPWP || "-",
        }));

        // Add the default customer at the beginning
        setCustomers([defaultCustomer, ...mappedCustomers]);
      } else {
        toast.error("Gagal memuat data pelanggan");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Gagal memuat data pelanggan");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add event listener for tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Refresh customers when tab becomes visible again
        fetchCustomers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);

      // Update NIK and NPWP fields if available
      // We'll handle this in the form field components instead of directly manipulating the form values
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
  const handleSaveNewCustomer = async () => {
    // Validate required fields
    if (!newCustomer.name) {
      toast.error("Nama pelanggan harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare customer data for submission
      const customerData = {
        name: newCustomer.name,
        contactName: newCustomer.contactName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        notes: newCustomer.notes,
        // NIK and NPWP are handled by the server action
      };

      // Call the server action to add the customer
      const result = await addCustomer(customerData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.customer) {
        toast.success("Pelanggan berhasil ditambahkan");

        // Create a customer object for the UI
        const newCustomerObj = {
          id: result.customer.id,
          name: result.customer.name,
          phone: result.customer.phone || "-",
          email: result.customer.email || "-",
          address: result.customer.address || "-",
          NIK: result.customer.NIK || "-",
          NPWP: result.customer.NPWP || "-",
        };

        // Add to customers list
        setCustomers((prev) => [
          defaultCustomer,
          newCustomerObj,
          ...prev.slice(1),
        ]);

        // Select the new customer
        setSelectedCustomer(newCustomerObj);

        // Update the customerId field in the form
        const customerIdField = document.querySelector(
          'select[name="customerId"]'
        ) as HTMLSelectElement;
        if (customerIdField) {
          // Create a new option for the new customer if it doesn't exist
          const option = document.createElement("option");
          option.value = newCustomerObj.id;
          option.text = newCustomerObj.name;
          customerIdField.add(option);
          customerIdField.value = newCustomerObj.id;

          // Also update the form control value
          control._formValues.customerId = newCustomerObj.id;
        }

        // Update NIK and NPWP fields
        const nikField = document.querySelector(
          'input[name="customerNIK"]'
        ) as HTMLInputElement;
        const npwpField = document.querySelector(
          'input[name="customerNPWP"]'
        ) as HTMLInputElement;

        // Update NIK field
        if (nikField) {
          if (newCustomer.NIK) {
            nikField.value = newCustomer.NIK;
            // Also update the form control value
            control._formValues.customerNIK = newCustomer.NIK;
          } else {
            nikField.value = "";
            // Also update the form control value
            control._formValues.customerNIK = "";
          }
        }

        // Update NPWP field
        if (npwpField) {
          if (newCustomer.NPWP) {
            npwpField.value = newCustomer.NPWP;
            // Also update the form control value
            control._formValues.customerNPWP = newCustomer.NPWP;
          } else {
            npwpField.value = "";
            // Also update the form control value
            control._formValues.customerNPWP = "";
          }
        }

        // Reset the form and close the dialog
        setNewCustomer({
          name: "",
          contactName: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          NIK: "",
          NPWP: "",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Terjadi kesalahan saat menambahkan pelanggan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={fetchCustomers}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>

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
                <FormLabel className="text-right">Nama Kontak</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Nama kontak pelanggan"
                  value={newCustomer.contactName}
                  onChange={(e) =>
                    handleNewCustomerChange("contactName", e.target.value)
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
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Catatan</FormLabel>
                <Input
                  className="col-span-3"
                  placeholder="Catatan tambahan"
                  value={newCustomer.notes}
                  onChange={(e) =>
                    handleNewCustomerChange("notes", e.target.value)
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveNewCustomer} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
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

                  // Find the selected customer
                  const customer = customers.find((c) => c.id === value);
                  if (customer) {
                    // Update NIK and NPWP fields
                    // Find the form fields
                    const nikField = document.querySelector(
                      'input[name="customerNIK"]'
                    ) as HTMLInputElement;
                    const npwpField = document.querySelector(
                      'input[name="customerNPWP"]'
                    ) as HTMLInputElement;

                    // Update NIK field
                    if (nikField) {
                      if (customer.NIK && customer.NIK !== "-") {
                        nikField.value = customer.NIK;
                        // Also update the form control value
                        control._formValues.customerNIK = customer.NIK;
                      } else {
                        nikField.value = "";
                        // Also update the form control value
                        control._formValues.customerNIK = "";
                      }
                    }

                    // Update NPWP field
                    if (npwpField) {
                      if (customer.NPWP && customer.NPWP !== "-") {
                        npwpField.value = customer.NPWP;
                        // Also update the form control value
                        control._formValues.customerNPWP = customer.NPWP;
                      } else {
                        npwpField.value = "";
                        // Also update the form control value
                        control._formValues.customerNPWP = "";
                      }
                    }
                  }
                }}
                defaultValue={field.value || defaultCustomer.id}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memuat pelanggan...
                      </div>
                    ) : (
                      <SelectValue placeholder="Pilih pelanggan" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
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
