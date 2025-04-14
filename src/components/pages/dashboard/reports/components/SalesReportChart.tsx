"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalesReportChartProps {
  dateRange: string;
}

interface SalesData {
  name: string;
  total: number;
}

interface SalesByCategory {
  name: string;
  value: number;
}

export const SalesReportChart: React.FC<SalesReportChartProps> = ({
  dateRange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<SalesByCategory[]>([]);
  const [chartType, setChartType] = useState<string>("trend");

  // Fetch sales data based on date range
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockSalesData: SalesData[] = [
          { name: "Jan", total: 1200000 },
          { name: "Feb", total: 1900000 },
          { name: "Mar", total: 1500000 },
          { name: "Apr", total: 2200000 },
          { name: "May", total: 1800000 },
          { name: "Jun", total: 2500000 },
        ];

        const mockCategoryData: SalesByCategory[] = [
          { name: "Makanan", value: 4500000 },
          { name: "Minuman", value: 3200000 },
          { name: "Snack", value: 2100000 },
          { name: "Dessert", value: 1800000 },
          { name: "Lainnya", value: 900000 },
        ];

        setSalesData(mockSalesData);
        setCategoryData(mockCategoryData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load sales chart data");
        setLoading(false);
      }
    }, 1000);
  }, [dateRange]);

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="h-[400px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={setChartType} className="w-full">
        <TabsList>
          <TabsTrigger value="trend">Tren Penjualan</TabsTrigger>
          <TabsTrigger value="category">Penjualan per Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Total Penjualan",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="category" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Total Penjualan",
                  ]}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Total Penjualan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
