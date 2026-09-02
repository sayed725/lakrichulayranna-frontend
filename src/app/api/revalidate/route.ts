import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body.secret || request.nextUrl.searchParams.get("secret");
    const tag = body.tag || request.nextUrl.searchParams.get("tag");
    const path = body.path || request.nextUrl.searchParams.get("path");

    // Optional secret check if secret is configured in environment
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    if (revalidateSecret && secret !== revalidateSecret) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!tag && !path) {
      return NextResponse.json(
        { message: "Missing 'tag' or 'path' parameter" },
        { status: 400 }
      );
    }

    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag, "default");
      revalidated.push(`tag: ${tag}`);
    }

    if (path) {
      revalidatePath(path, "page");
      revalidated.push(`path: ${path}`);
    }

    return NextResponse.json({
      revalidated: true,
      details: revalidated,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to revalidate" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateSecret && secret !== revalidateSecret) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!tag && !path) {
    return NextResponse.json(
      { message: "Missing 'tag' or 'path' query parameter" },
      { status: 400 }
    );
  }

  const revalidated: string[] = [];

  if (tag) {
    revalidateTag(tag, "default");
    revalidated.push(`tag: ${tag}`);
  }

  if (path) {
    revalidatePath(path, "page");
    revalidated.push(`path: ${path}`);
  }

  return NextResponse.json({
    revalidated: true,
    details: revalidated,
    now: Date.now(),
  });
}
