import dynamic from "next/dynamic";
import HeroSlider from "@/components/home/hero/Hero";
import { HomeCategories } from "@/components/home/categories/HomeCategories";
import { FeaturedItems } from "@/components/home/featured-items/FeaturedItems";

export const revalidate = 60; // Revalidate data every 60 seconds (ISR)

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  
  try {
    const [bannersRes, categoriesRes, featuredRes] = await Promise.all([
      fetch(`${apiUrl}/banners?isActive=true`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${apiUrl}/categories`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${apiUrl}/items?isFeatured=true`, { next: { revalidate: 60 } }).then((res) => res.json()),
    ]);

    return {
      banners: bannersRes?.data || [],
      categories: categoriesRes?.data || [],
      featuredItems: featuredRes?.data || [],
    };
  } catch (error) {
    console.error("Error fetching homepage data on server:", error);
    return {
      banners: [],
      categories: [],
      featuredItems: [],
    };
  }
}

// Lazy load below-the-fold components to reduce initial bundle size and speed up page load
const FeaturedCategoriesWithItems = dynamic(
  () => import("@/components/home/featured-categories/FeaturedCategoriesWithItems").then((mod) => mod.FeaturedCategoriesWithItems),
  {
    loading: () => <div className="h-96 bg-cream/50 animate-pulse rounded-2xl mx-auto max-w-7xl my-10" />,
  }
);

const HomeOffers = dynamic(
  () => import("@/components/home/offers/HomeOffers").then((mod) => mod.HomeOffers),
  {
    loading: () => <div className="h-96 bg-cream/50 animate-pulse rounded-2xl mx-auto max-w-7xl my-10" />,
  }
);

const HowItWorks = dynamic(
  () => import("@/components/home/how-it-works/HowItWorks"),
  {
    loading: () => <div className="h-96 bg-cream/50 animate-pulse rounded-2xl mx-auto max-w-7xl my-10" />,
  }
);

const HomeReviews = dynamic(
  () => import("@/components/home/reviews/HomeReviews").then((mod) => mod.HomeReviews),
  {
    loading: () => <div className="h-96 bg-cream/50 animate-pulse rounded-2xl mx-auto max-w-7xl my-10" />,
  }
);

export default async function HomePage() {
  const { banners, categories, featuredItems } = await getHomeData();

  return (
    <main>
      <HeroSlider initialSlides={banners} />
      <HomeCategories initialCategories={categories} />
      <FeaturedItems items={featuredItems} />
      <FeaturedCategoriesWithItems />
      <HomeOffers />
      <HowItWorks />
      <HomeReviews />
    </main>
  );
}
