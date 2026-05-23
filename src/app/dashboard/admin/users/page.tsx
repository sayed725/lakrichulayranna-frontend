"use client";

import { format } from "date-fns";
import { Mail, Phone, Shield } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminUsers } from "@/features/user/hooks/useAdminUsers";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();

  const columns = [
    {
      header: "ব্যবহারকারী",
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-charcoal font-bold shrink-0">
            {row.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-bold text-charcoal font-bengali">{row.name}</p>
            <p className="text-xs text-muted font-latin">যোগদান: {format(new Date(row.createdAt), "dd MMM, yyyy")}</p>
          </div>
        </div>
      ),
    },
    {
      header: "যোগাযোগ",
      accessor: (row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-charcoal">
            <Mail size={14} className="text-muted" />
            <span className="font-latin">{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-sm text-charcoal">
              <Phone size={14} className="text-muted" />
              <span className="font-latin">{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "রোল (Role)",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {row.role === "ADMIN" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fire/10 text-fire text-xs font-bold font-latin">
              <Shield size={12} />
              ADMIN
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cream-dark text-charcoal text-xs font-bold font-latin">
              CUSTOMER
            </span>
          )}
        </div>
      ),
    },
    {
      header: "অর্ডার",
      accessor: (row: any) => (
        <span className="font-bold text-charcoal bg-cream px-3 py-1 rounded-full">
          {row._count?.orders || 0} টি
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
          ব্যবহারকারী
        </h1>
        <p className="text-muted text-sm font-bengali">সিস্টেমের সকল ব্যবহারকারীর তালিকা</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={users || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
