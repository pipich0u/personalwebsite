import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    // Clean empty strings to null for optional fields
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.titleEn !== undefined) data.titleEn = body.titleEn || null;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.content !== undefined) data.content = body.content;
    if (body.contentEn !== undefined) data.contentEn = body.contentEn || null;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt || null;
    if (body.excerptEn !== undefined) data.excerptEn = body.excerptEn || null;
    if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
    if (body.tags !== undefined) data.tags = body.tags || null;
    if (body.status !== undefined) data.status = body.status;

    // Set publishedAt when first publishing
    if (body.status === "published" && existing.status !== "published") {
      data.publishedAt = new Date();
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
