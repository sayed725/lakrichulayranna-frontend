import { Metadata } from "next";
import { env } from "@/config/env";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO metadata generation on the server
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const res = await fetch(`${env.API_URL}/items/slug/${slug}`, { next: { revalidate: 3600 } }); // Cache metadata for 1hr
    if (res.ok) {
      const json = await res.json();
      const item = json?.data?.item || json?.data;
      if (item) {
        return {
          title: `${item.name} | লাকড়ির চুলায় রান্না`,
          description: item.description || `${item.name} এর বিস্তারিত তথ্য ও মূল্য।`,
          openGraph: {
            title: item.name,
            description: item.description || `${item.name} এর বিস্তারিত তথ্য ও মূল্য।`,
            images: item.imageUrl ? [{ url: item.imageUrl }] : [],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error generating metadata:", err);
  }

  return {
    title: "খাবারের বিস্তারিত | লাকড়ির চুলায় রান্না",
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${env.API_URL}/items?limit=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const json = await res.json();
    const items = Array.isArray(json?.data) 
      ? json.data 
      : json?.data?.items || [];

    return items.map((item: any) => ({
      slug: item.slug,
    }));
  } catch (err) {
    console.error("Error generating static params:", err);
    return [];
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let initialItemData = null;
  let initialRelatedItems: any[] = [];
  let initialReviews: any[] = [];

  try {
    const itemRes = await fetch(`${env.API_URL}/items/slug/${slug}`, { next: { revalidate: 180 } });
    if (itemRes.ok) {
      const json = await itemRes.json();
      initialItemData = json?.data || null;
    }
  } catch (err) {
    console.error("Error prefetching item details on server:", err);
  }

  const item = initialItemData?.item || initialItemData;

  // 2. Fetch related items and reviews in parallel if item was found
  if (item) {
    try {
      const [relatedRes, reviewsRes] = await Promise.all([
        fetch(`${env.API_URL}/items?category.id=${item.categoryId}`, { next: { revalidate: 180 } }),
        fetch(`${env.API_URL}/reviews/item/${item.id}`, { next: { revalidate: 180 } })
      ]);

      if (relatedRes.ok) {
        const relatedJson = await relatedRes.json();
        const itemsList = Array.isArray(relatedJson?.data) 
          ? relatedJson.data 
          : relatedJson?.data?.items || [];
        initialRelatedItems = itemsList.filter((i: any) => i.id !== item.id).slice(0, 4);
      }

      if (reviewsRes.ok) {
        const reviewsJson = await reviewsRes.json();
        initialReviews = reviewsJson?.data || [];
      }
    } catch (err) {
      console.error("Error prefetching related data on server:", err);
    }
  }

  return (
    <ProductDetailClient
      slug={slug}
      initialItemData={initialItemData}
      initialRelatedItems={initialRelatedItems}
      initialReviews={initialReviews}
    />
  );
}
