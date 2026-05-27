
import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const imgbb_api_key = env.IMGBB_API_KEY;

    if (!imgbb_api_key) {
      console.error("IMGBB_API_KEY is not defined");
      return NextResponse.json(
        { error: "Image upload configuration error" },
        { status: 500 },
      );
    }

    const imgbbFormData = new FormData();
    imgbbFormData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
      {
        method: "POST",
        body: imgbbFormData,
      },
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: data.data.url,
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}