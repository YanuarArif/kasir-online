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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPurchaseChartData } from "@/actions/reports";

interface PurchasesReportChartProps {
  dateRange: string;
}

interface PurchasesData {
  name: string;
  total: number;
}

interface PurchasesBySupplier {
  name: string;
  value: number;
}

// Chart color palette
const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export const PurchasesReportChart: React.FC<PurchasesReportChartProps> = ({
  dateRange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasesData, setPurchasesData] = useState<PurchasesData[]>([]);
  const [supplierData, setSupplierData] = useState<PurchasesBySupplier[]>([]);
  const [chartType, setChartType] = useState<string>("trend");

  // Fetch purchases data based on date range
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPurchaseChartData(dateRange);

        if (result.error) {
          setError(result.error);
        } else if (result.success && result.data) {
          setPurchasesData(result.data.trendData);
          setSupplierData(result.data.supplierData);
        } else {
          setError("Gagal mengambil data grafik pembelian");
        }
      } catch (err) {
        console.error("Error fetching purchase chart data:", err);
        setError("Gagal memuat data grafik pembelian");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
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
          <TabsTrigger value="trend">Tren Pembelian</TabsTrigger>
          <TabsTrigger value="supplier">Pembelian per Supplier</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={purchasesData}
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
                    "Total Pembelian",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="supplier" className="pt-4">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplierData}
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
                  {supplierData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Total Pembelian",
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
