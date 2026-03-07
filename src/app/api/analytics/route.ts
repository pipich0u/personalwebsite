import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
  ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      viewCount: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: totalViews._sum.viewCount || 0,
    recentPosts,
  });
}
