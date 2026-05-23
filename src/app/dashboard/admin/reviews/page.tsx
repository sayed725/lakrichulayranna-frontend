"use client";

import { format } from "date-fns";
import { Star, CheckCircle, Trash2 } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { useAdminReviews, useApproveReview, useDeleteReview } from "@/features/review/hooks/useAdminReviews";

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useAdminReviews();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();

  const handleApprove = (id: string) => {
    approveReview.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই রিভিউটি মুছে ফেলতে চান?")) {
      deleteReview.mutate(id);
    }
  };

  const columns = [
    {
      header: "আইটেম ও গ্রাহক",
      accessor: (row: any) => (
        <div>
          <p className="font-bold text-charcoal font-bengali">{row.item?.name}</p>
          <p className="text-xs text-muted font-bengali">{row.user?.name} • {format(new Date(row.createdAt), "dd MMM, yy")}</p>
        </div>
      ),
    },
    {
      header: "রেটিং",
      accessor: (row: any) => (
        <div className="flex items-center gap-1 text-warning">
          <Star size={16} fill="currentColor" />
          <span className="font-bold text-charcoal ml-1">{row.rating}</span>
        </div>
      ),
    },
    {
      header: "মতামত",
      accessor: (row: any) => (
        <p className="text-sm text-charcoal font-bengali max-w-xs truncate" title={row.comment}>
          {row.comment || "-"}
        </p>
      ),
    },
    {
      header: "স্ট্যাটাস",
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold font-bengali ${
          row.isApproved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}>
          {row.isApproved ? "অনুমোদিত" : "অপেক্ষমাণ"}
        </span>
      ),
    },
    {
      header: "অ্যাকশন",
      accessor: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isApproved && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors cursor-pointer"
              title="অনুমোদন করুন"
              disabled={approveReview.isPending}
            >
              <CheckCircle size={18} />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
            disabled={deleteReview.isPending}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-bengali text-charcoal mb-1">
          রিভিউসমূহ
        </h1>
        <p className="text-muted text-sm font-bengali">গ্রাহকদের মতামত ও রেটিং পরিচালনা করুন</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
        <DataTable 
          columns={columns} 
          data={reviews || []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
