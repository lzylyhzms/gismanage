# @vben/web-antd - GIS-Manage 前端主工程

本应用是基于 **Ant Design Vue 4.x + Vben Admin v5** 构建的 `gis-manage` 前端主应用工程，专注于与 `D:\AFinal\gis-base` 后端服务的对接、可视化监控与交互管理。

---

## 📂 模块分阶段架构 (Phases Directory Breakdown)

```text
src/
├── api/
│   ├── core/                  # 框架基础认证与菜单接口
│   ├── gis/                   # 【GIS 核心 API 层】
│   │   ├── types.ts           # 全局强类型定义 (System, Socket, Map, AI, SpaceMatch)
│   │   ├── monitor.ts         # Phase 1 & 3: 系统健康与 Netty 通信 API
│   │   ├── map-layer.ts       # Phase 2: 地图与 GeoServer 图层 API
│   │   ├── ai-agent.ts        # Phase 4: 大模型与智能体推演 API
│   │   ├── spacematch.ts      # Phase 5: 航天载荷与匹配规则 API
│   │   └── index.ts           # 统一 Barrel 导出入口
│   └── request.ts             # Vben RequestClient 请求客户端配置
├── router/
│   └── routes/
│       └── modules/
│           ├── dashboard.ts   # 系统通用仪表盘路由
│           ├── gis.ts         # 【Phase 6: GIS 子系统动态路由注册】
│           └── vben.ts        # 框架预置组件与演示路由
├── views/
│   └── gis/                   # 【GIS 业务视图层】
│       ├── monitor/
│       │   └── index.vue      # Phase 1: 核心服务运行与实时监控大屏
│       ├── map/
│       │   └── index.vue      # Phase 2: 空间地图管理与在线 WebGL 画布预览
│       ├── layer/
│       │   └── index.vue      # Phase 2: GIS 图层与 GeoServer 服务控制
│       ├── netty/
│       │   └── index.vue      # Phase 3: Netty 多协议 Socket 通信控制台
│       ├── ai-agent/
│       │   └── index.vue      # Phase 4: AI 大模型与 Space-Match 智能体调度
│       └── spacematch/
│           ├── payload.vue    # Phase 5: 卫星载荷传感器参数库
│           └── plan.vue       # Phase 5: 航天资源智能匹配方案矩阵
└── vite.config.ts             # 【Phase 6: Vite 打包优化与代理配置】
```

---

## 🧩 核心阶段功能与交互详解

### Phase 1: 系统服务运行大屏 (`views/gis/monitor/`)
- **实现文件**：[monitor/index.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/monitor/index.vue)
- **技术要点**：
  - 采用 `ref` 响应式数据绑定 CPU、内存、JVM、数据库、Redis、Netty 等状态。
  - 使用 `setInterval` 实现 10 秒定时自动轮询，并在 `onUnmounted` 生命周期中执行 `clearInterval`，严格防止内存泄露。
  - 支持一键手动触发 `refreshMetrics` 刷新。

### Phase 2: 地图与 GeoServer 控制台 (`views/gis/map/` & `views/gis/layer/`)
- **实现文件**：[map/index.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/map/index.vue)、[layer/index.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/layer/index.vue)
- **技术要点**：
  - 地图视角中心点（经纬度）、缩放层级（Zoom Level）、空间四至（Bounds）元数据配置。
  - 矢量图层、栅格图层及 WMS/WFS 服务整合，支持动态 Slider 调整图层不透明度（Opacity）与显隐切换。
  - 监控后端连接的 GeoServer 工作区（Workspaces）与数据存储（DataStores）状态。

### Phase 3: Netty 多协议 Socket 控制台 (`views/gis/netty/`)
- **实现文件**：[netty/index.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/netty/index.vue)
- **技术要点**：
  - 实时展示 TCP (9001)、UDP (9002)、WebSocket (9003 `/ws/netty-chat`) 端口活跃会话与数据吞吐指标。
  - 内置 WebSocket 实时消息推播测试台，可向在线 Channel 发送广播或点播 JSON 报文。

### Phase 4: AI 与 Space-Match 智能体调度 (`views/gis/ai-agent/`)
- **实现文件**：[ai-agent/index.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/ai-agent/index.vue)
- **技术要点**：
  - 统一呈现当前绑定的 LLM 大模型（DashScope Qwen、DeepSeek 等）参数。
  - 监控 Space-Match 智能体迭代步骤（`currentIter / maxIters`）与思考链摘要（Thinking Stream）。
  - 提供交互式空间推理沙箱，输入 Prompt 实时获取 AI 推理生成结果。

### Phase 5: 航天资源智能匹配控制台 (`views/gis/spacematch/`)
- **实现文件**：[payload.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/spacematch/payload.vue)、[plan.vue](file:///d:/AFinal/gis-manage/apps/web-antd/src/views/gis/spacematch/plan.vue)
- **技术要点**：
  - 载荷参数卡片与明细表（光学相机、SAR 雷达、红外仪等的分辨率、幅宽、功耗与重量）。
  - 运载火箭整流罩容量分配与发射窗口排期。
  - 多目标规划约束规则与综合匹配度得分（MatchScore 0~100%）方案矩阵。

---

## ⚙️ 常用指令

```bash
# 启动开发服务器
pnpm dev

# 生产环境打包构建
pnpm build

# TypeScript 类型检查
pnpm typecheck
```
