"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsReportChartProps {
  dateRange: string;
}

interface TopProductsData {
  name: string;
  sold: number;
  revenue: number;
}

interface CategoryDistribution {
  name: string;
  value: number;
}

// Chart color palette
const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export const ProductsReportChart: React.FC<ProductsReportChartProps> = ({
  dateRange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topProductsData, setTopProductsData] = useState<TopProductsData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [chartType, setChartType] = useState<string>("top");

  // Fetch products data based on date range
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockTopProductsData: TopProductsData[] = [
          {
            name: "Kopi Susu Gula Aren",
            sold: 150,
            revenue: 3000000,
          },
          {
            name: "Es Teh Manis",
            sold: 120,
            revenue: 1200000,
          },
          {
            name: "Croissant Coklat",
            sold: 95,
            revenue: 1900000,
          },
          {
            name: "Roti Bakar",
            sold: 85,
            revenue: 1275000,
          },
          {
            name: "Nasi Goreng Spesial",
            sold: 70,
            revenue: 1750000,
          },
        ];

        const mockCategoryData: CategoryDistribution[] = [
          { name: "Minuman", value: 4200000 },
          { name: "Makanan", value: 4925000 },
          { name: "Snack", value: 1500000 },
          { name: "Dessert", value: 1200000 },
          { name: "Lainnya", value: 800000 },
        ];

        setTopProductsData(mockTopProductsData);
        setCategoryData(mockCategoryData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products chart data");
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
          <TabsTrigger value="top">Produk Terlaris</TabsTrigger>
          <TabsTrigger value="category">Distribusi Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProductsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 100,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") {
                      return [formatCurrency(value), "Pendapatan"];
                    }
                    return [value, name === "sold" ? "Terjual" : name];
                  }}
                />
                <Legend
                  payload={[
                    {
                      value: "Terjual",
                      type: "square",
                      color: "#8884d8",
                    },
                    {
                      value: "Pendapatan",
                      type: "square",
                      color: "#82ca9d",
                    },
                  ]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="sold"
                  fill="#8884d8"
                  name="sold"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#82ca9d"
                  name="revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="category" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Pendapatan",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
