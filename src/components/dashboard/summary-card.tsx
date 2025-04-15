"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  linkText?: string;
  linkHref?: string;
  colorScheme?: "indigo" | "emerald" | "blue" | "amber" | "rose";
}

const colorSchemes = {
  indigo: {
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconText: "text-indigo-600 dark:text-indigo-300",
    linkText:
      "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
    iconText: "text-emerald-600 dark:text-emerald-300",
    linkText:
      "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconText: "text-blue-600 dark:text-blue-300",
    linkText:
      "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900",
    iconText: "text-amber-600 dark:text-amber-300",
    linkText:
      "text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-900",
    iconText: "text-rose-600 dark:text-rose-300",
    linkText:
      "text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300",
  },
};

export function SummaryCard({
  title,
  value,
  icon,
  change,
  linkText,
  linkHref,
  colorScheme = "indigo",
}: SummaryCardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <Card className="border shadow-sm dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-full ${colors.iconBg} p-1 ${colors.iconText}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={`text-xs ${
              change.type === "increase"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } flex items-center mt-1`}
          >
            {change.type === "increase" ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {change.value}
          </p>
        )}
      </CardContent>
      {linkText && linkHref && (
        <CardFooter className="p-2">
          <Link href={linkHref} className={`text-xs ${colors.linkText}`}>
            {linkText}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
