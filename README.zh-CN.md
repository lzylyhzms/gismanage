# GIS-Manage 空间信息与航天资源监控管理控制台

<div align="center">
  <p><b>配套 D:\AFinal\gis-base 后端的高性能空间信息、多协议通信与航天资源智能匹配控制台</b></p>
  <p>基于 Vue 3 + TypeScript + Vite + Ant Design Vue + Vben Admin v5 构建</p>
</div>

---

## 📖 项目简介

`gis-manage` 是专为 `gis-base`（Spring Boot 3 + PostGIS + Netty + AI Agent）后端系统打造的企业级可视化监控与业务管理平台。系统涵盖 **服务运行监控**、**GIS 地图与图层**、**Netty 网络通信**、**AI 与智能体** 以及 **航天载荷智能匹配 (Space-Match)** 五大核心子系统。

---

## 🚀 项目分阶段架构设计 (Phases Overview)

本项目依据功能演进与系统分层，划分为 6 个核心阶段（Phases）：

### 📌 Phase 1: 系统服务运行与健康度监控 (System Health & Runtime Monitoring)
- **对应路径**：`apps/web-antd/src/views/gis/monitor/`、`apps/web-antd/src/api/gis/monitor.ts`
- **核心能力**：
  - 实时监控 Spring Boot 3 后端、PostgreSQL/PostGIS 数据库连接池（HikariCP）、Redis 缓存状态。
  - JVM 堆内存分配（已用/最大分配量）、服务器 CPU 实时占用监控。
  - 自动轮询机制（10s 周期自适应轮询与组件销毁定时器防泄露）。
  - 集成 Logback 实时日志与告警 Timeline 控制台。

### 📌 Phase 2: GIS 空间地图与 GeoServer 图层管理 (GIS Spatial Maps & Layers)
- **对应路径**：`apps/web-antd/src/views/gis/map/`、`apps/web-antd/src/views/gis/layer/`、`apps/web-antd/src/api/gis/map-layer.ts`
- **核心能力**：
  - 多坐标参照系管理（EPSG:4326 WGS84、EPSG:3857 Web 墨卡托、CGCS2000）。
  - 内置 2D/3D WebGL 画布在线交互预览与中心点/空间四至范围（Bounding Box）控制。
  - 整合 GeoServer 代理端点（工作区 Workspaces、数据存储 DataStores、图层发布总数）。
  - 矢量图层、栅格图层、WMS/WFS 服务配置、不透明度动态调节与图层显隐。

### 📌 Phase 3: Netty 多协议网络通信引擎控制台 (Netty Multi-Protocol Sockets)
- **对应路径**：`apps/web-antd/src/views/gis/netty/`、`apps/web-antd/src/api/gis/monitor.ts`
- **核心能力**：
  - 监控 Netty 高性能 NIO 通信引擎状态与运行指标。
  - 多协议监听端口监控：TCP (9001)、UDP (9002)、WebSocket (9003 `/ws/netty-chat`)。
  - 实时入站/出站消息吞吐量、活跃客户端 Channel 统计。
  - 交互式 WebSocket 消息点播/广播在线推播测试台。

### 📌 Phase 4: AI 大模型与 Space-Match 智能体调度 (AI & Space-Match Agent)
- **对应路径**：`apps/web-antd/src/views/gis/ai-agent/`、`apps/web-antd/src/api/gis/ai-agent.ts`
- **核心能力**：
  - 兼容 DashScope (通义千问 Qwen)、DeepSeek、Gemini 及 OpenAI 多大模型统一配置。
  - 实时展示 Space-Match 智能体推理思考链（Thinking Stream）与 Iter 迭代步数。
  - Token 消耗与推理耗时统计。
  - 内置空间智能推理与 Prompt 提示词交互沙箱。

### 📌 Phase 5: 航天资源与载荷智能匹配业务 (Space-Match Payloads & Missions)
- **对应路径**：`apps/web-antd/src/views/gis/spacematch/`、`apps/web-antd/src/api/gis/spacematch.ts`
- **核心能力**：
  - 卫星载荷传感器参数库（光学、SAR 合成孔径雷达、红外测温、全光谱高光谱）。
  - 运载火箭（长征二号丁、长征六号改、快舟十一号）发射任务窗口与运载能力排期。
  - 智能匹配规则引擎约束配置（重量上限、电源预算、轨道高度、发射窗口容限）。
  - AI 空间匹配方案 Scoring 矩阵与多目标推理结论呈现。

### 📌 Phase 6: 工程化、性能优化与可拓展性 (Engineering & Extensibility)
- **对应路径**：`apps/web-antd/src/router/routes/modules/gis.ts`、`apps/web-antd/vite.config.ts`
- **核心能力**：
  - **模块化动态路由**：按子系统解耦挂载路由，支持路由按需懒加载。
  - **统一 API 客户端与 Mock 降级**：内置 Nitro Mock 与真实后端无缝平滑切换。
  - **打包体积优化**：开启 Gzip/Brotli 压缩、第三方大库 Manual Chunks 拆包、ESBuild 生产净化。

---

## 🛠️ 技术栈

| 层次 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | Vue 3.5+ (Composition API, `<script setup>`) | 前端核心驱动 |
| **构建工具** | Vite 8+ / Turborepo / PNPM Workspace | Monorepo 高性能构建与缓存 |
| **语言规范** | TypeScript 5.x | 全流程强类型约束 |
| **UI 组件库** | Ant Design Vue 4.x + Tailwind CSS | 企业级 UI 组件与原子化样式 |
| **图标方案** | `@vben/icons` (Iconify / Lucide 图标集) | 矢量化按需加载图标 |
| **状态管理** | Pinia | 响应式状态管理 |
| **路由管理** | Vue Router 4.x | 动态权限与按需加载路由 |

---

## 📦 目录结构

```text
gis-manage/
├── apps/
│   ├── backend-mock/          # Nitro Mock 服务端
│   └── web-antd/              # 主前端工程 (Ant Design Vue)
│       ├── src/
│       │   ├── api/
│       │   │   └── gis/       # GIS 与监控核心 API 接口层
│       │   │       ├── types.ts       # TypeScript 全局数据模型
│       │   │       ├── monitor.ts     # 系统健康与 Netty API
│       │   │       ├── map-layer.ts   # 地图与 GeoServer 图层 API
│       │   │       ├── ai-agent.ts    # 大模型与智能体 API
│       │   │       └── spacematch.ts  # 航天载荷与匹配方案 API
│       │   ├── router/
│       │   │   └── routes/
│       │   │       └── modules/
│       │   │           └── gis.ts     # GIS 子系统动态路由配置
│       │   └── views/
│       │       └── gis/       # GIS 子系统核心视图层
│       │           ├── monitor/       # Phase 1: 服务运行监控大屏
│       │           ├── map/           # Phase 2: 地图与空间数据
│       │           ├── layer/         # Phase 2: 图层与 GeoServer 控制
│       │           ├── netty/         # Phase 3: Netty 多协议控制台
│       │           ├── ai-agent/      # Phase 4: AI 与智能体调度
│       │           └── spacematch/    # Phase 5: 航天载荷与方案推演
│       └── vite.config.ts     # Vite 打包构建与反向代理配置
├── packages/                  # 框架公共共享包 (@vben/...)
└── turbo.json                 # Turborepo 任务编排配置
```

---

## ⚡ 快速开始与使用指南

### 1. 环境准备
- **Node.js**：`^22.18.0` 或 `^24.12.0`（建议 Node.js 18+ 或 20+）
- **PNPM**：`>= 11.0.0`

### 2. 安装依赖
```bash
pnpm install
```

### 3. 本地开发启动
```bash
# 启动 web-antd 前端应用 (推荐)
pnpm dev:antd

# 或使用子包过滤命令
pnpm -F @vben/web-antd run dev
```

启动成功后，浏览器访问：**`http://localhost:5666/`**。

### 4. 默认登录账号

| 角色 | 用户名 | 默认密码 | 权限说明 |
| :--- | :--- | :--- | :--- |
| **超级管理员** | `vben` | `123456` | 具备全量菜单与 GIS 监控管理权限 |
| **系统管理员** | `admin` | `123456` | 具备 GIS 系统配置与推演权限 |
| **普通用户** | `jack` | `123456` | 基础查看权限 |

### 5. 生产环境打包
```bash
pnpm build:antd
```

---

## 🔗 后端联调与 Mock 模式切换

- **内置 Mock 模式（开箱即用）**：
  系统默认开启 `Nitro Mock Server`（运行于 `http://localhost:5320/api`），即使未启动 Java 后端也可完整体验所有 GIS 控制台功能。
- **直连 `gis-base` Java 后端（8080 端口）**：
  启动本地 `gis-base` Spring Boot 后，设置环境变量：
  ```bash
  VITE_PROXY_TARGET=http://localhost:8080 pnpm dev:antd
  ```
