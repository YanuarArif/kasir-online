"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CubeIcon, ShoppingBagIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const AddMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Tambah Baru"
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href="/dashboard/products/add" passHref>
          <DropdownMenuItem className="cursor-pointer">
            <CubeIcon className="mr-2 h-4 w-4" />
            <span>Tambah Produk</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/purchases/add" passHref>
          <DropdownMenuItem className="cursor-pointer">
            <ShoppingBagIcon className="mr-2 h-4 w-4" />
            <span>Tambah Pembelian</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/sales/add" passHref>
          <DropdownMenuItem className="cursor-pointer">
            <CurrencyDollarIcon className="mr-2 h-4 w-4" />
            <span>Tambah Penjualan</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddMenu;
