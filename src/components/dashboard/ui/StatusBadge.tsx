// No imports needed from constants for OrderStatus since it is unused

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let label = status;

  switch (status) {
    case "PENDING":
      bgColor = "bg-warning/10";
      textColor = "text-warning";
      label = "অপেক্ষমাণ";
      break;
    case "CONFIRMED":
      bgColor = "bg-info/10";
      textColor = "text-info";
      label = "নিশ্চিতকৃত";
      break;
    case "PREPARING":
      bgColor = "bg-fire/10";
      textColor = "text-fire";
      label = "প্রস্তুত হচ্ছে";
      break;
    case "READY":
      bgColor = "bg-success/10";
      textColor = "text-success";
      label = "ডেলিভারির জন্য প্রস্তুত";
      break;
    case "DELIVERED":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      label = "ডেলিভারি সম্পন্ন";
      break;
    case "CANCELLED":
      bgColor = "bg-error/10";
      textColor = "text-error";
      label = "বাতিলকৃত";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-bengali whitespace-nowrap ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
}
