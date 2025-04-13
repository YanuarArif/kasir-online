"use client";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployeeName,
  updateEmployeePassword,
} from "@/actions/employee";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { z } from "zod";
import {
  CreateEmployeeSchema,
  UpdateEmployeeNameSchema,
  UpdateEmployeePasswordSchema,
} from "@/schemas/zod";

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
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false);
  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Form state
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CASHIER">("CASHIER");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Edit name form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "CASHIER">("CASHIER");
  const [editNameFormErrors, setEditNameFormErrors] = useState<
    Record<string, string>
  >({});

  // Edit password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editPasswordFormErrors, setEditPasswordFormErrors] = useState<
    Record<string, string>
  >({});

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

  const resetEditNameForm = () => {
    setEditName("");
    setEditRole("CASHIER");
    setEditNameFormErrors({});
    setSelectedEmployee(null);
  };

  const resetEditPasswordForm = () => {
    setNewPassword("");
    setConfirmPassword("");
    setEditPasswordFormErrors({});
    setSelectedEmployee(null);
  };

  const handleEditNameClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditName(employee.name);
    setEditRole(employee.role === Role.ADMIN ? "ADMIN" : "CASHIER");
    setIsEditNameDialogOpen(true);
  };

  const handleEditPasswordClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewPassword("");
    setConfirmPassword("");
    setIsEditPasswordDialogOpen(true);
  };

  const handleUpdateEmployeeName = async () => {
    if (!selectedEmployee) return;

    try {
      // Validate form
      const formData = { name: editName, role: editRole };
      const validationResult = UpdateEmployeeNameSchema.safeParse(formData);

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setEditNameFormErrors(errors);
        return;
      }

      // Clear previous errors
      setEditNameFormErrors({});

      // Submit form
      const result = await updateEmployeeName(selectedEmployee.id, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setIsEditNameDialogOpen(false);
        resetEditNameForm();
        fetchEmployees();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat memperbarui data karyawan");
      console.error(err);
    }
  };

  const handleUpdateEmployeePassword = async () => {
    if (!selectedEmployee) return;

    try {
      // Validate form
      const formData = { password: newPassword, confirmPassword };
      const validationResult = UpdateEmployeePasswordSchema.safeParse(formData);

      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setEditPasswordFormErrors(errors);
        return;
      }

      // Clear previous errors
      setEditPasswordFormErrors({});

      // Submit form
      const result = await updateEmployeePassword(
        selectedEmployee.id,
        formData
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setIsEditPasswordDialogOpen(false);
        resetEditPasswordForm();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat memperbarui password karyawan");
      console.error(err);
    }
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
                  <p className="text-sm text-red-500">
                    {formErrors.employeeId}
                  </p>
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
                  <TableCell className="text-right flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNameClick(employee)}
                      title="Edit Karyawan"
                    >
                      <PencilIcon className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPasswordClick(employee)}
                      title="Ubah Password"
                    >
                      <KeyIcon className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      title="Hapus Karyawan"
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

      {/* Edit Name Dialog */}
      <Dialog
        open={isEditNameDialogOpen}
        onOpenChange={setIsEditNameDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>Perbarui informasi karyawan</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Nama Karyawan</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Masukkan nama karyawan"
              />
              {editNameFormErrors.name && (
                <p className="text-sm text-red-500">
                  {editNameFormErrors.name}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRole">Peran</Label>
              <Select
                value={editRole}
                onValueChange={(value: "ADMIN" | "CASHIER") =>
                  setEditRole(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CASHIER">Kasir</SelectItem>
                </SelectContent>
              </Select>
              {editNameFormErrors.role && (
                <p className="text-sm text-red-500">
                  {editNameFormErrors.role}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditNameDialogOpen(false);
                resetEditNameForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateEmployeeName}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Password Dialog */}
      <Dialog
        open={isEditPasswordDialogOpen}
        onOpenChange={setIsEditPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Password Karyawan</DialogTitle>
            <DialogDescription>Perbarui password karyawan</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
              />
              {editPasswordFormErrors.password && (
                <p className="text-sm text-red-500">
                  {editPasswordFormErrors.password}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
              />
              {editPasswordFormErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {editPasswordFormErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditPasswordDialogOpen(false);
                resetEditPasswordForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateEmployeePassword}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
