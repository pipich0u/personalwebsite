import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const contents = await prisma.pageContent.findMany();
  const map: Record<string, string> = {};
  for (const c of contents) {
    map[c.pageKey] = c.content;
  }
  return NextResponse.json(map);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  for (const [pageKey, content] of Object.entries(body)) {
    await prisma.pageContent.upsert({
      where: { pageKey },
      update: { content: content as string },
      create: { pageKey, content: content as string },
    });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
