"use client";

import { createEmployee, deleteEmployee, getEmployees } from "@/actions/employee";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { CreateEmployeeSchema } from "@/schemas/zod";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: Role;
  createdAt?: Date;
}

export default function EmployeeManagement() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CASHIER">("CASHIER");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await getEmployees();
      if (result.error) {
        setError(result.error);
      } else if (result.employees) {
        setEmployees(result.employees);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data karyawan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateEmployee = async () => {
    try {
      // Validate form
      const formData = { name, employeeId, password, role };
      const validationResult = CreateEmployeeSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
      
      // Clear previous errors
      setFormErrors({});
      
      // Submit form
      const result = await createEmployee(formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setIsDialogOpen(false);
        resetForm();
        fetchEmployees();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menambahkan karyawan");
      console.error(err);
    }
  };
  
  const handleDeleteEmployee = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      try {
        const result = await deleteEmployee(id);
        
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          fetchEmployees();
        }
      } catch (err) {
        toast.error("Terjadi kesalahan saat menghapus karyawan");
        console.error(err);
      }
    }
  };
  
  const resetForm = () => {
    setName("");
    setEmployeeId("");
    setPassword("");
    setRole("CASHIER");
    setFormErrors({});
  };
  
  if (loading && employees.length === 0) {
    return <div>Memuat data karyawan...</div>;
  }
  
  if (error && employees.length === 0) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen Karyawan</CardTitle>
          <CardDescription>
            Kelola karyawan dan akses mereka ke sistem
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>Tambah Karyawan</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Karyawan Baru</DialogTitle>
              <DialogDescription>
                Tambahkan karyawan baru untuk mengakses sistem kasir Anda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Karyawan</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama karyawan"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employeeId">ID Karyawan</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Masukkan ID karyawan untuk login"
                />
                {formErrors.employeeId && (
                  <p className="text-sm text-red-500">{formErrors.employeeId}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Peran</Label>
                <Select
                  value={role}
                  onValueChange={(value: "ADMIN" | "CASHIER") => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CASHIER">Kasir</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.role && (
                  <p className="text-sm text-red-500">{formErrors.role}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleCreateEmployee}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Belum ada karyawan yang ditambahkan</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>ID Karyawan</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>
                    {employee.role === Role.ADMIN ? "Admin" : "Kasir"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
