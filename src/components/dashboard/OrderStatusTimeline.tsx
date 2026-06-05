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
      <div className="flex flex-col items-center justify-center p-8 bg-error/5 rounded-2xl border border-error/20">
        <XCircle size={48} className="text-error mb-4" />
        <h3 className="text-xl font-bold font-bengali text-error">অর্ডারটি বাতিল করা হয়েছে</h3>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.id === status);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="relative">
      <div className="absolute top-1/3 left-0 w-full h-1 bg-cream-dark -translate-y-1/2 z-0 hidden sm:block" />
      <div 
        className="absolute top-1/2 left-0 h-1 bg-fire -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block" 
        style={{ width: `${(activeIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
      />

      <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-2 relative">
              {/* Mobile line connector */}
              {index !== STATUS_STEPS.length - 1 && (
                <div className="absolute top-10 left-5 w-0.5 h-12 bg-cream-dark sm:hidden z-[-1]" />
              )}
              {index !== STATUS_STEPS.length - 1 && isCompleted && !isCurrent && (
                <div className="absolute top-10 left-5 w-0.5 h-12 bg-fire sm:hidden z-[-1]" />
              )}

              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-fire border-fire text-white" 
                    : "bg-white border-cream-dark text-muted-light"
                } ${isCurrent ? "ring-4 ring-fire/20" : ""}`}
              >
                <step.icon size={20} />
              </div>
              
              <div className="sm:text-center">
                <p className={`font-bengali font-bold text-sm ${isCompleted ? "text-charcoal" : "text-muted"}`}>
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
