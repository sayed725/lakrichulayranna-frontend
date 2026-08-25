import { Metadata } from "next";
import { env } from "@/config/env";
import OrderDetailClient from "./OrderDetailClient";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

// Generate dynamic metadata for the order page on the server
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `অর্ডার #${resolvedParams.orderNumber} | লাকড়ির চুলায় রান্না`,
    description: "আপনার অর্ডারের বিবরণ এবং ট্র্যাকিং স্ট্যাটাস দেখুন।",
  };
}

export default async function PublicOrderDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;

  let initialOrder = null;

  try {
    const res = await fetch(`${env.API_URL}/orders/number/${orderNumber}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      initialOrder = json?.data || null;
    }
  } catch (err) {
    console.error("Error prefetching order details on server:", err);
  }

  return (
    <OrderDetailClient
      orderNumber={orderNumber}
      initialOrder={initialOrder}
    />
  );
}
