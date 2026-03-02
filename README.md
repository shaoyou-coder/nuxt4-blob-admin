## 项目介绍
博客管理系统（Admin），基于 **Vue3 + Vite + TypeScript + Element Plus**，内置 **axios 请求封装**、**路由登录拦截**、**Pinia 状态持久化**、以及常用的业务组件（表格/分页/上传/富文本/图片预览等）。

## 项目效果图
<img width="1920" height="919" alt="51b8ccdb560a29254d48d81ddd52402" src="https://github.com/user-attachments/assets/2cb408f2-2312-4bfd-98af-f54b238f28b9" />
<img width="1920" height="916" alt="0c21a037ca749f850d0d3a99763b1b8" src="https://github.com/user-attachments/assets/615efc2e-186b-42da-bea9-3d0adc9e8a00" />
<img width="1920" height="916" alt="e7e957ae85cb218e3e8a72658cdc692" src="https://github.com/user-attachments/assets/e4db402b-61a0-4de8-b226-483362bc5f22" />
<img width="1920" height="917" alt="09a435057142f90d08bcfa7891ce774" src="https://github.com/user-attachments/assets/dd94805d-5715-412b-a32e-f2f0e62b47f8" />

## 对应博客网站仓库地址
[四季博客网站仓库地址](https://github.com/shaoyou-coder/nuxt4-blob-web)

## 技术栈
- **框架**: Vue 3
- **构建工具**: Vite 4
- **语言**: TypeScript
- **UI**: Element Plus（含暗黑主题变量）
- **状态管理**: Pinia + `pinia-plugin-persistedstate`
- **网络请求**: axios（统一拦截/错误处理/自动携带 token）
- **其他能力**: `vite-plugin-mock`、WangEditor（富文本）、`v-viewer`（图片预览）、ECharts

## 环境要求
- **Node**: v16.17.0
- **npm**: v8.15.0

## 快速开始
### 安装依赖

```sh
npm install
```

### 配置环境变量（必做）
项目读取 `env/` 目录下的环境文件，并且只会注入以 `WD_` 开头的变量（见 `vite/base.config.ts`）。

请在 `env/` 下创建对应文件（仓库内当前为空目录）：

- **开发环境**: `env/.env.development`
- **生产环境**: `env/.env.production`

推荐最小配置如下：

```env
# API 基础地址（axios baseURL）
WD_BASE_URL=/mid

# 仅开发环境使用：Vite devServer 代理目标
WD_PROXY_SERVER_URL=http://127.0.0.1:3000
```

说明：
- **WD_BASE_URL**: `src/request/request.ts` 中 axios 的 `baseURL`
- **WD_PROXY_SERVER_URL**: `vite/dev.config.ts` 中 devServer 的代理目标（用于本地联调/跨域）

### 启动开发

```sh
npm run dev
```

### 类型检查

```sh
npm run type-check
```

### 打包构建

```sh
npm run build
```

### 本地预览构建产物

```sh
npm run preview
```

## 项目结构

```txt
admin
├─ env/                         # 环境变量目录（.env.* 放这里；仅注入 WD_ 前缀）
├─ mock/                        # 本地 mock 数据（vite-plugin-mock）
├─ src/
│  ├─ apis/                      # 接口聚合层（对外导出 class 实例）
│  ├─ request/                   # axios 二次封装、请求/响应拦截
│  ├─ router/                    # 路由与拦截器（meta.intercept）
│  ├─ stores/                    # Pinia stores（user/theme，含持久化）
│  ├─ layout/                    # 基础布局（TopBar/SideBar/Breadcrumb/错误页）
│  ├─ components/common/         # 通用组件（表格/分页/上传/预览/富文本等）
│  ├─ composables/               # 组合式能力（如表格高度计算）
│  ├─ utils/                     # 工具方法（对象合并/时间格式化等）
│  ├─ views/                     # 业务页面（track/site/column/type/article/bookmark/...）
│  └─ main.ts                    # 应用入口（Pinia/Router/ElementPlus/主题初始化）
├─ types/                        # 全局类型声明
└─ vite/                         # Vite 分环境配置（base/dev/prod）
```

## 内置封装与约定
### 1) 请求封装（axios）
位置：`src/request/request.ts`

- **自动携带 token**: 除登录接口外，统一在请求头加 `token`（来自 `useUserStore().token`）
- **统一响应结构处理**: 成功返回 `body`；异常时统一 `ElMessage` 提示
- **token 失效处理**: 当 `errCode === 'e0002'` 时会登出并跳转到 `/login`
- **提供统一调用方式**: `http.get/post/put/delete`

接口聚合示例位置：
- `src/apis/user.ts`：登录 mock 接口示例
- `src/apis/mid.ts`：业务接口（站点配置、专栏、文章、埋点、书签等）

### 2) 路由与登录拦截
位置：`src/router/index.ts`、`src/router/interceptor.ts`

- **路由拦截入口**: `interceptor(router)`
- **按需拦截**: 在路由 `meta.intercept` 中配置拦截器列表，例如 `intercept: ['login']`
- **登录判断**: `login` 拦截器依据 `useUserStore().token` 判断，无 token 跳转登录页

### 3) 状态管理与持久化（Pinia）
位置：`src/stores/*`

- `src/stores/user.ts`
  - **持久化**: `sessionStorage`（key: `USER`）
  - **内容**: `token`、侧边栏状态与宽度、菜单激活项等
- `src/stores/theme.ts`
  - **持久化**: `localStorage`（key: `THEME`）
  - **能力**: `toggleTheme()` 切换主题；`initTheme()` 启动时应用主题（通过 `html.dark`）

### 4) Vite 配置与 Mock
位置：`vite/*`、`mock/*`

- **envDir/envPrefix**: `vite/base.config.ts` 配置 `envDir=env/`、`envPrefix=WD_`
- **开发代理**: `vite/dev.config.ts` 配置 `/mid`、`/mid/mockApi` 代理到 `WD_PROXY_SERVER_URL`
- **开发 mock**: `vite-plugin-mock` 在 `command === 'serve'` 时启用（读取 `mock/` 下规则）

## 常用命令
- **dev**: 启动开发服务器 `npm run dev`
- **type-check**: 类型检查 `npm run type-check`
- **build**: 构建（包含类型检查）`npm run build`
- **preview**: 本地预览构建产物 `npm run preview`

## 常见问题
### 1) 启动时报 env 文件读取失败
本项目会从 `env/.env.{mode}` 读取环境变量（见 `vite/dev.config.ts`），请确认你已创建：
- `env/.env.development`（开发）
- `env/.env.production`（生产）

### 2) 接口请求不通 / 跨域
- 优先检查 `WD_BASE_URL` 与 `WD_PROXY_SERVER_URL` 配置是否正确
- 开发环境走 Vite `server.proxy`：请求以 `/mid` 开头会被代理到后端

## 开发小贴士
### 别名与自动导入
- **路径别名**（见 `vite/base.config.ts`）：
  - `@` -> `src/`
  - `#types` -> `types/`
  - `@config` -> `src/config/index.ts`
- **自动导入**：已启用 `unplugin-auto-import`，默认自动导入 `vue` / `vue-router` / `pinia`，类型声明在 `auto-imports.d.ts`

### 通用组件
位置：`src/components/common/`
- `TableComp.vue`：表格封装
- `PaginationComp.vue`：分页封装
- `UploadImgComp.vue`：图片上传封装
- `PreviewImg.vue`：图片预览
- `WangEditor.vue`：富文本编辑器封装

