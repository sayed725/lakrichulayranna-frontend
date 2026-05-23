import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params?.categoryId as string;
  const search = params?.search as string;

  let title = "মেনু | লাকড়ি চুলায় রান্না";
  let description = "আমাদের সকল কাঠের চুলার খাবার এক নজরে।";

  if (search) {
    title = `"${search}" এর জন্য ফলাফল | লাকড়ি চুলায় রান্না`;
  } else if (categoryId && categoryId !== "all") {
    title = `ক্যাটাগরি মেনু | লাকড়ি চুলায় রান্না`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
