import { Metadata } from "next";

// Define a type for what the API might return just for metadata
interface ItemMeta {
  name: string;
  description: string;
  imageUrl: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    // We fetch the metadata securely via backend API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/items/slug/${slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    
    if (data?.data?.item) {
      const item = data.data.item;
      return {
        title: `${item.name} | লাকড়ি চুলায় রান্না`,
        description: item.description || "খাঁটি কাঠের চুলায় রান্না করা সুস্বাদু খাবার।",
        openGraph: {
          title: item.name,
          description: item.description,
          images: [item.imageUrl],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching item metadata:", error);
  }

  return {
    title: "খাবার | লাকড়ি চুলায় রান্না",
  };
}

export default function ItemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
