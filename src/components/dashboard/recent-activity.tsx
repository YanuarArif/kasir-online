"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  time: string;
  amount: string;
  status?: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
  title?: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function RecentActivity({
  transactions,
  title = "Aktivitas Terbaru",
  description = "Transaksi terbaru di sistem",
  viewAllLink = "/dashboard/sales",
  viewAllText = "Lihat Semua Transaksi",
}: RecentActivityProps) {
  return (
    <Card className="border-none shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border dark:border-gray-700">
          <div className="grid grid-cols-3 bg-muted/50 p-3 text-xs font-medium">
            <div>Transaksi ID</div>
            <div>Waktu</div>
            <div className="text-right">Total</div>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-3 p-3 text-sm"
                >
                  <div className="font-medium text-indigo-600 dark:text-indigo-400">
                    #{transaction.id}
                  </div>
                  <div className="text-muted-foreground">{transaction.time}</div>
                  <div className="text-right font-medium">
                    {transaction.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Tidak ada transaksi terbaru
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={viewAllLink}>{viewAllText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
