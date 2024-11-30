import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // @ts-expect-error
  const blob = await put(filename ? filename : "file", request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
