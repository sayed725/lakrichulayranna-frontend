import { Check, Clock, Package, Truck, Home, XCircle } from "lucide-react";

interface TimelineProps {
  status: string;
}

const STATUS_STEPS = [
  { id: "PENDING", label: "অপেক্ষমাণ", icon: Clock },
  { id: "CONFIRMED", label: "নিশ্চিতকৃত", icon: Check },
  { id: "PREPARING", label: "প্রস্তুত হচ্ছে", icon: Package },
  { id: "READY", label: "ডেলিভারির জন্য প্রস্তুত", icon: Truck },
  { id: "DELIVERED", label: "ডেলিভারি সম্পন্ন", icon: Home },
];

export function OrderStatusTimeline({ status }: TimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-error/5 rounded-2xl border border-error/20">
        <XCircle size={40} className="text-error mb-3" />
        <h3 className="text-lg sm:text-xl font-bold font-bengali text-error">অর্ডারটি বাতিল করা হয়েছে</h3>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.id === status);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="relative py-2 px-1">
      {/* Background connector line */}
      <div className="absolute top-7 left-8 right-8 h-1 bg-border -translate-y-1/2 z-0 hidden sm:block" />
      <div 
        className="absolute top-7 left-8 h-1 bg-fire -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block" 
        style={{ width: `calc(${(activeIndex / (STATUS_STEPS.length - 1)) * 100}% - 4rem)` }}
      />

      <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-5 sm:gap-2">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2.5 relative flex-1 min-w-0">
              {/* Mobile vertical line connector */}
              {index !== STATUS_STEPS.length - 1 && (
                <div className="absolute top-9 left-4 w-0.5 h-7 bg-border sm:hidden z-[-1]" />
              )}
              {index !== STATUS_STEPS.length - 1 && isCompleted && !isCurrent && (
                <div className="absolute top-9 left-4 w-0.5 h-7 bg-fire sm:hidden z-[-1]" />
              )}

              <div 
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-fire border-fire text-white" 
                    : "bg-background border-border text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-fire/20" : ""}`}
              >
                <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              
              <div className="sm:text-center min-w-0 flex-1 sm:w-full">
                <p className={`font-bengali font-bold text-xs sm:text-sm leading-tight break-words ${isCompleted ? "text-charcoal" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
