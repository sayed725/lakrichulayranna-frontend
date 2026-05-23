import { Container } from "@/components/shared/container/Container";

export default function CustomerDashboardLoading() {
  return (
    <Container className="py-8">
      <div className="space-y-8 animate-pulse">
        <div className="h-48 bg-charcoal/10 rounded-3xl w-full mb-8" />
        
        <div className="h-40 bg-fire/5 rounded-2xl border border-fire/10 w-full" />

        <div className="h-96 bg-white rounded-3xl border border-border w-full" />
      </div>
    </Container>
  );
}
