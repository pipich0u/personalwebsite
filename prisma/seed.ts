import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fanyao.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashSync(adminPassword, 12),
      name: "范遥",
    },
  });

  const categories = [
    { name: "学习", nameEn: "Study", slug: "study", sortOrder: 0 },
    { name: "生活", nameEn: "Life", slug: "life", sortOrder: 1 },
    { name: "旅游", nameEn: "Travel", slug: "travel", sortOrder: 2 },
    { name: "技术", nameEn: "Tech", slug: "tech", sortOrder: 3 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const settings = [
    { key: "site_title", value: "范遥的个人空间" },
    { key: "site_title_en", value: "Fan Yao's Space" },
    { key: "site_description", value: "欢迎来到范遥的个人空间" },
    { key: "site_description_en", value: "Welcome to Fan Yao's personal space" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  const pages = [
    { pageKey: "home_slogan", content: "欢迎来到范遥的个人空间" },
    { pageKey: "home_slogan_en", content: "Welcome to Fan Yao's Space" },
    { pageKey: "home_subtitle", content: "探索 · 记录 · 分享" },
    { pageKey: "home_subtitle_en", content: "Explore · Record · Share" },
    { pageKey: "about_bio", content: "你好，我是范遥。这是我的个人网站，在这里我记录生活、分享想法。" },
    { pageKey: "about_bio_en", content: "Hi, I'm Fan Yao. This is my personal website where I document life and share ideas." },
    { pageKey: "about_avatar", content: "/uploads/avatar.jpg" },
  ];

  for (const page of pages) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      update: {},
      create: page,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
