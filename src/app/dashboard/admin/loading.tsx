import { Container } from "@/components/shared/container/Container";

export default function AdminDashboardLoading() {
  return (
    <Container className="py-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-cream-dark rounded-xl w-64 mb-8"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-border p-6" />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-border" />
          <div className="h-96 bg-white rounded-2xl border border-border" />
        </div>
      </div>
    </Container>
  );
}
