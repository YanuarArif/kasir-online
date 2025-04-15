"use client";

import React, { useState, useEffect } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getRecentActivities, ActivityItem } from "@/actions/activity";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const ActivityMenu = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const result = await getRecentActivities(5);
        if (result.success && result.data) {
          setActivities(result.data);
          setError(null);
        } else {
          setError(result.error || "Gagal mengambil aktivitas");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil aktivitas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Function to get icon color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "sale":
        return "text-green-500";
      case "purchase":
        return "text-blue-500";
      case "product":
        return "text-purple-500";
      case "login":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label="Aktivitas Terbaru"
        >
          <ClockIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Aktivitas Terbaru</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-2 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            Tidak ada aktivitas terbaru
          </div>
        ) : (
          activities.map((activity) => (
            <DropdownMenuItem
              key={activity.id}
              className="flex flex-col items-start p-3 cursor-default"
            >
              <div className="flex items-start w-full">
                <div className={`mr-2 ${getActivityColor(activity.type)}`}>
                  <span className="text-xs font-medium uppercase">
                    {activity.type}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.description}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      oleh{" "}
                      <span className="font-medium">
                        {activity.performedBy}
                      </span>
                      {activity.isEmployee && (
                        <span className="ml-1 text-xs text-blue-500">
                          (Karyawan)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <Link href="/dashboard/activity" passHref>
          <DropdownMenuItem className="cursor-pointer justify-center">
            <span className="text-sm font-medium">Lihat Semua Aktivitas</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActivityMenu;
