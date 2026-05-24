"use client";

import { format } from "date-fns";
import { Mail, Phone, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminContacts } from "@/features/contact/hooks/useAdminContacts";

export default function AdminContactsPage() {
  const { data: contacts, isLoading } = useAdminContacts();

  const columns = [
    {
      header: "ব্যক্তি",
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fire to-terracotta flex items-center justify-center text-white font-bold shrink-0">
            {row.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <div>
            <p className="font-bold text-charcoal font-bengali">{row.name}</p>
            <p className="text-xs text-muted font-latin">{format(new Date(row.createdAt), "dd MMM, yyyy")}</p>
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
      header: "বিষয়",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-muted" />
          <span className="text-sm text-charcoal font-bengali">{row.subject}</span>
        </div>
      ),
    },
    {
      header: "বার্তা",
      accessor: (row: any) => (
        <p className="text-sm text-charcoal font-bengali max-w-xs truncate">
          {row.message}
        </p>
      ),
    },
    {
      header: "অবস্থা",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {row.isRead ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold font-latin">
              <CheckCircle size={12} />
              পঠিত
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-fire/10 text-fire text-xs font-bold font-latin">
              <Clock size={12} />
              অপঠিত
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
          যোগাযোগ বার্তা
        </h1>
        <p className="text-muted text-sm font-bengali">গ্রাহকদের থেকে প্রাপ্ত সকল যোগাযোগ বার্তার তালিকা</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={contacts || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
