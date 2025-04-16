"use client";

import React from "react";
import { SupplierFormValues, supplierCategories } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
  Tag,
  Globe,
  CreditCard,
  RotateCcw,
  Save,
  AlertCircle,
} from "lucide-react";

interface SupplierSummaryProps {
  formValues: SupplierFormValues;
  isPending: boolean;
}

const SupplierSummary: React.FC<SupplierSummaryProps> = ({
  formValues,
  isPending,
}) => {
  const { name, contactName, email, phone, address, supplierType, isActive, rating } = formValues;

  // Get supplier type label
  const supplierTypeLabel = supplierCategories.find(
    (cat) => cat.value === supplierType
  )?.label || "Produk";

  // Generate star rating display
  const renderRating = () => {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= ratingValue 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"}`} 
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="sticky top-4 bg-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Ringkasan Supplier</h3>
        <div className="space-y-4">
          {/* Supplier Status */}
          <div className="flex justify-between items-center">
            <Badge 
              variant={isActive ? "default" : "outline"}
              className={isActive 
                ? "bg-green-500 hover:bg-green-600" 
                : "text-gray-500"
              }
            >
              {isActive ? "Aktif" : "Tidak Aktif"}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {supplierTypeLabel}
            </Badge>
          </div>

          {/* Supplier Rating */}
          {rating !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rating:</span>
              {renderRating()}
            </div>
          )}

          <Separator />

          {/* Basic Info */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium">{name || "Nama Supplier"}</p>
                {contactName && <p className="text-sm text-gray-500">{contactName}</p>}
              </div>
            </div>

            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm truncate">{email}</span>
              </div>
            )}

            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm">{phone}</span>
              </div>
            )}

            {address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <Button
              type="submit"
              form="supplier-form"
              className="w-full justify-start"
              disabled={isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Supplier
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={isPending}
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </div>

          {/* Status */}
          <div className="pt-2">
            <Badge
              variant={isPending ? "secondary" : "outline"}
              className="w-full justify-center py-1"
            >
              {isPending ? "Menyimpan..." : "Siap Disimpan"}
            </Badge>
          </div>

          {/* Help Text */}
          <div className="pt-2 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Informasi dasar supplier akan disimpan ke database. Informasi tambahan hanya untuk tampilan UI.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierSummary;
