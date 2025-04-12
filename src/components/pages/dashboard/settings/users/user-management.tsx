"use client";

import { getUsers, changeUserRole } from "@/actions/user-roles";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PermissionCheck } from "@/components/auth/permission-check";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: Role;
  emailVerified: Date | null;
  image: string | null;
}

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getUsers();
        if (result.error) {
          setError(result.error);
        } else if (result.users) {
          setUsers(result.users);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data pengguna");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const result = await changeUserRole(userId, newRole);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        // Update the user in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengubah peran pengguna");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Memuat data pengguna...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Pengguna</CardTitle>
        <CardDescription>Kelola peran pengguna dalam sistem</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>{user.username || "-"}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {/* Only OWNER can change to OWNER or ADMIN */}
                  <PermissionCheck requiredRoles={[Role.OWNER]}>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value: string) =>
                        handleRoleChange(user.id, value as Role)
                      }
                      disabled={user.id === session?.user?.id} // Can't change own role
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Role.OWNER}>Owner</SelectItem>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Role.CASHIER}>Cashier</SelectItem>
                      </SelectContent>
                    </Select>
                  </PermissionCheck>

                  {/* ADMIN can only change to CASHIER */}
                  <PermissionCheck requiredRoles={[Role.ADMIN]} fallback={null}>
                    {session?.user?.role === Role.ADMIN &&
                      user.role !== Role.OWNER &&
                      user.role !== Role.ADMIN && (
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value: string) =>
                            handleRoleChange(user.id, value as Role)
                          }
                          disabled={user.id === session?.user?.id} // Can't change own role
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Pilih peran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.CASHIER}>
                              Cashier
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                  </PermissionCheck>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
