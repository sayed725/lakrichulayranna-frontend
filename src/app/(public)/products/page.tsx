import { env } from "@/config/env";
import ProductsClient from "./ProductsClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MenuPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  const urlCategoryName = (resolvedSearchParams["category.name"] as string) || "all";
  const urlIsSpicy = resolvedSearchParams["isSpicy"] === "true";
  const urlIsFeatured = resolvedSearchParams["isFeatured"] === "true";
  const urlPrice = resolvedSearchParams["price"] as string;
  
  let urlMinPrice = "";
  let urlMaxPrice = "";
  if (urlPrice) {
    try {
      const parsed = JSON.parse(urlPrice);
      urlMinPrice = parsed.gte || "";
      urlMaxPrice = parsed.lte || "";
    } catch {
      // Invalid JSON, ignore
    }
  }

  // Fetch categories and items in parallel on the server side
  let initialCategories = [];
  let initialItemsData = null;

  try {
    const params = new URLSearchParams();
    if (urlCategoryName !== "all") params.append("category.name", urlCategoryName);
    if (urlIsSpicy) params.append("isSpicy", "true");
    if (urlIsFeatured) params.append("isFeatured", "true");
    params.append("limit", "10");
    if (urlMinPrice || urlMaxPrice) {
      const priceObj: any = {};
      if (urlMinPrice) priceObj.gte = urlMinPrice;
      if (urlMaxPrice) priceObj.lte = urlMaxPrice;
      params.append("price", JSON.stringify(priceObj));
    }

    const categoriesUrl = `${env.API_URL}/categories`;
    const itemsUrl = `${env.API_URL}/items?${params.toString()}`;

    // Parallel fetch with caching (ISR)
    const [categoriesRes, itemsRes] = await Promise.all([
      fetch(categoriesUrl, { next: { revalidate: 600, tags: ["categories", "products"] } }),
      fetch(itemsUrl, { next: { revalidate: 600, tags: ["items", "products"] } })
    ]);

    if (categoriesRes.ok) {
      const json = await categoriesRes.json();
      initialCategories = json?.data || [];
    }

    if (itemsRes.ok) {
      const json = await itemsRes.json();
      initialItemsData = json?.data || null;
    }
  } catch (err) {
    console.error("Error prefetching catalog data on server:", err);
  }

  return (
    <ProductsClient
      initialCategories={initialCategories}
      initialItemsData={initialItemsData}
      urlCategoryName={urlCategoryName}
      urlIsSpicy={urlIsSpicy}
      urlIsFeatured={urlIsFeatured}
      urlMinPrice={urlMinPrice}
      urlMaxPrice={urlMaxPrice}
    />
  );
}
