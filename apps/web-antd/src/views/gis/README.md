# GIS-Manage 视图层组件开发与学习手册 (`src/views/gis/`)

本目录收拢了 `gis-manage` 针对 `gis-base` 后端开发的所有业务管理与可视化监控页面。所有页面遵循 Vue 3 `<script setup>` 组合式 API + TypeScript 规范。

---

## 📑 视图页面与 Phase 映射一览

| 阶段 | 页面目录 | 对应路由 | 功能描述 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | `monitor/index.vue` | `/gis/monitor` | 系统服务运行大屏、JVM/CPU负载、PostGIS/Redis指标、日志Timeline |
| **Phase 2** | `map/index.vue` | `/gis/map` | GIS 空间地图注册、坐标系配置、2D/3D WebGL 画布在线预览 |
| **Phase 2** | `layer/index.vue` | `/gis/layer` | GIS 矢量与栅格图层 CRUD、GeoServer 代理状态、透明度与显隐控制 |
| **Phase 3** | `netty/index.vue` | `/gis/netty` | Netty 通信引擎多协议监控、TCP/UDP/WebSocket 端口指标、在线推播测试台 |
| **Phase 4** | `ai-agent/index.vue` | `/gis/ai-agent` | AI 大模型参数配置、Space-Match 智能体思考链监控、推理沙箱 |
| **Phase 5** | `spacematch/payload.vue` | `/gis/payload` | 卫星载荷传感器参数库（分辨率、幅宽、功耗、重量） |
| **Phase 5** | `spacematch/plan.vue` | `/gis/plan` | 运载火箭排期、多目标规划规则引擎约束与匹配度方案矩阵 |

---

## 🔍 各阶段组件技术实现细节

### 1. `monitor/index.vue` (Phase 1: 服务运行监控大屏)
- **数据流**：调用 `getSystemHealthApi()` 与 `getSocketEngineMetricsApi()` 并行获取指标。
- **关键设计**：
  ```ts
  // 响应式数据绑定与轮询
  onMounted(() => {
    refreshMetrics();
    timer = setInterval(refreshMetrics, 10000); // 10s 自动轮询
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer); // 必须销毁定时器防泄露
  });
  ```
- **UI 特性**：
  - 顶部指标卡：Ant Design Vue `<Progress>` 进度条展示 CPU 与 JVM 内存占用率。
  - 状态指示：`<Badge status="processing" color="#52c41a" />` 呈现后端健康心跳。
  - 日志时间线：`<Timeline>` 区分呈现 INFO / WARN / ERROR 级别日志。

### 2. `map/index.vue` (Phase 2: 地图与空间数据)
- **核心功能**：
  - 管理地图代码、名称、坐标系（`EPSG:4326`、`EPSG:3857`、`CGCS2000`）、中心点经纬度与缩放层级。
  - 右侧嵌入模拟 WebGL Canvas 空间地图交互控件，实时定位经纬度中心点与四至范围（Bounding Box）。
  - 支持新增与编辑地图元数据模态框（Modal Form）。

### 3. `layer/index.vue` (Phase 2: 图层与 GeoServer 控制)
- **核心功能**：
  - 顶部横幅卡片展示 GeoServer 代理状态（工作区数量、数据存储数、发布图层数）。
  - 图层列表支持通过 Ant Design Vue `<Slider>` 实时调节图层透明度（0.0 ~ 1.0）。
  - 支持一键点击切换图层显隐（`visible` 状态控制）。

### 4. `netty/index.vue` (Phase 3: Netty 多协议控制台)
- **核心功能**：
  - 呈现 Netty 引擎模式（`NETTY` 高性能异步 NIO 模式）。
  - 分块展示 TCP (9001)、UDP (9002) 和 WebSocket (9003 `/ws/netty-chat`) 端口指标。
  - 提供表单发送消息推播测试，支持选择消息类型（`SYSTEM_BROADCAST`、`GIS_LAYER_UPDATE`、`AI_AGENT_NOTIFY`）并统计成功送达的在线客户端数量。

### 5. `ai-agent/index.vue` (Phase 4: AI 与智能体调度)
- **核心功能**：
  - 模型配置概览：呈现绑定的提供商（DashScope / DeepSeek / Gemini / OpenAI）、Base URL 与采样温度。
  - 智能体执行监控卡片：展示每个推演会话的迭代轮次（`currentIter / maxIters`）、Token 消耗与实时思考流摘要（Thinking Stream）。
  - 交互式调试沙箱：输入空间推演 Prompt，调用 `executeAiChatApi` 实时获取推演思考链与生成结论。

### 6. `spacematch/payload.vue` & `spacematch/plan.vue` (Phase 5: 航天资源匹配)
- **核心功能**：
  - `payload.vue`：网格卡片 + 表格呈现光学、SAR、热红外及高光谱载荷属性。
  - `plan.vue`：运载火箭发射窗口概览、多目标规则引擎约束权重配置，以及最终推演计算出的匹配方案矩阵（评分、配对载荷、配对火箭任务与 AI Reasoning 分析）。

---

## 💡 开发与扩展建议
- **新增业务子页面**：只需在当前目录下新增 `.vue` 单文件组件，并在 `apps/web-antd/src/router/routes/modules/gis.ts` 中注册路由即可。
- **图标规范**：统一使用 `@vben/icons` 中的 `<IconifyIcon icon="lucide:..." />`，支持 Lucide、Carbon、Mdi 等任意图标，无需手动引入全量图标包。
