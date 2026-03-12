#!/bin/bash
set -e

echo "🚀 开始部署 personalwebsite..."

# 加载环境变量
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
fi

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 复制首页视频
HERO_VIDEO_PATH="${HERO_VIDEO_PATH:-}"
TARGET="public/hero-bg.mp4"

if [ ! -f "$TARGET" ]; then
  if [ -n "$HERO_VIDEO_PATH" ] && [ -f "$HERO_VIDEO_PATH" ]; then
    echo "🎬 复制首页视频: $HERO_VIDEO_PATH -> $TARGET"
    cp "$HERO_VIDEO_PATH" "$TARGET"
  else
    echo "⚠️  警告: 首页视频不存在！请设置 .env 中的 HERO_VIDEO_PATH 或手动放置 $TARGET"
  fi
else
  echo "✅ 首页视频已存在"
fi

# 3. 数据库迁移
echo "🗄️  数据库迁移..."
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma db push

# 4. 初始化数据（可选）
if [ ! -f "prisma/dev.db" ] || [ "$SEED_DB" = "true" ]; then
  echo "🌱 初始化数据..."
  npm run db:seed 2>/dev/null || true
fi

# 5. 构建
echo "🔨 构建项目..."
npm run build

echo ""
echo "✅ 部署完成！运行以下命令启动："
echo "   npm run start"
echo ""
echo "📁 关键文件检查："
[ -f "$TARGET" ] && echo "   ✅ 首页视频: $TARGET" || echo "   ❌ 首页视频缺失: $TARGET"
[ -f "prisma/dev.db" ] && echo "   ✅ 数据库: prisma/dev.db" || echo "   ⚠️  数据库未初始化"
