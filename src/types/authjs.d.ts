import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
      isEmployee?: boolean;
      ownerId?: string;
      employeeId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    isEmployee?: boolean;
    ownerId?: string;
    employeeId?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    isEmployee?: boolean;
    ownerId?: string;
    employeeId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: Role;
    isEmployee?: boolean;
    ownerId?: string;
    employeeId?: string;
  }
}
