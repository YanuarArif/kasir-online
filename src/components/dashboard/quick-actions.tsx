"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  colorClass?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          asChild
          className={action.colorClass || "bg-indigo-600 hover:bg-indigo-700"}
        >
          <Link href={action.href}>
            {action.icon}
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
