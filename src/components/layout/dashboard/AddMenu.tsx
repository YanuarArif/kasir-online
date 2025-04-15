"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CubeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Plus } from "lucide-react";

const AddMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 md:h-11 md:w-11 rounded-md cursor-pointer"
          aria-label="Tambah Baru"
        >
          <Plus className="!h-4 !w-4 md:!h-6 md:!w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href="/dashboard/products/new" passHref>
          <DropdownMenuItem className="cursor-pointer">
            <CubeIcon className="mr-2 h-4 w-4" />
            <span>Tambah Produk</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/purchases/new" passHref>
          <DropdownMenuItem className="cursor-pointer">
            <ShoppingBagIcon className="mr-2 h-4 w-4" />
            <span>Tambah Pembelian</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/dashboard/sales/new" passHref>
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
