# 全栈 Monorepo TodoList 项目

基于 pnpm + Turborepo 的全栈 TodoList 应用，包含 Next.js 和 Vite React 两个实现。

## 技术栈

- **Monorepo**: pnpm workspace + Turborepo
- **前端框架**: Next.js (SSR) + Vite React (CSR)
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **后端服务**: Supabase (PostgreSQL)
- **CI/CD**: GitHub Actions

## 项目结构

```
.
├── apps/
│   ├── web/          # Next.js 应用 (Server Actions + SSR)
│   └── client/       # Vite React 应用 (Client-side)
├── supabase-schema.sql  # 数据库表结构
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建项目
2. 在 SQL Editor 中执行 `supabase-schema.sql` 创建 todos 表
3. 获取项目 URL 和 anon key

### 3. 配置环境变量

**Next.js 应用** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Vite 应用** (`apps/client/.env.local`):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启动开发服务器

```bash
# 启动所有应用
pnpm dev

# 或单独启动
pnpm --filter web dev      # Next.js: http://localhost:3000
pnpm --filter client dev   # Vite: http://localhost:5173
```

## 功能特性

### Next.js 应用 (apps/web)
- ✅ Server Components + Server Actions
- ✅ 服务端渲染 (SSR)
- ✅ 完整 CRUD 操作
- ✅ 乐观更新 (useTransition)

### Vite React 应用 (apps/client)
- ✅ 纯客户端渲染
- ✅ Supabase JS SDK
- ✅ 完整 CRUD 操作
- ✅ 实时状态管理

## 部署

项目配置了 GitHub Actions 自动部署：

- **Next.js** → Vercel
- **Vite React** → GitHub Pages

推送到 `main` 分支时自动触发部署。

### GitHub Secrets 配置

在仓库 Settings → Secrets 中添加：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID_WEB
```
