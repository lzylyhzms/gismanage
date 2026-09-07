# GIS-Manage API 接口层与数据模型手册 (`src/api/gis/`)

本目录封装了前端与 `gis-base` 后端系统的所有 API 通信函数与 TypeScript 数据模型接口。

---

## 📁 文件架构与 Phase 划分

| 文件名 | 对应阶段 | 功能定位 |
| :--- | :--- | :--- |
| `types.ts` | **Global** | 声明全系统数据模型（健康度、Netty、地图、AI、航天载荷与规则） |
| `monitor.ts` | **Phase 1 & 3** | 提供系统健康指标、Netty 引擎多协议指标与 WebSocket 推播测试接口 |
| `map-layer.ts` | **Phase 2** | 提供地图配置列表、图层 CRUD 以及 GeoServer 代理状态查询接口 |
| `ai-agent.ts` | **Phase 4** | 提供 AI 大模型参数查询、Agent 运行会话监控与提示词推演接口 |
| `spacematch.ts` | **Phase 5** | 提供航天卫星载荷、运载火箭任务、匹配规则与推演方案矩阵接口 |
| `index.ts` | **Core** | Barrel 统一导出入口，支持外部一站式引用 |

---

## 🛡️ 核心机制：优雅降级与 Mock Fallback

为了确保前端在开发调试、纯演示、或者后端 `gis-base` 未启动时能够平稳运行，所有 API 请求函数均实现了 **优雅降级 (Graceful Degradation / Mock Fallback)**：

```ts
export async function getSystemHealthApi(): Promise<SystemHealthStatus> {
  try {
    // 优先直连后端真实接口
    return await requestClient.get<SystemHealthStatus>('/gis/system/health');
  } catch {
    // 后端离线或未启动时，自动捕获异常并返回预置的逼真 Mock 演示数据
    return {
      serverStatus: 'running',
      backendVersion: '1.0-SNAPSHOT',
      uptimeSeconds: 154200,
      cpuUsage: 28.5,
      // ...
    };
  }
}
```

---

## 📊 核心 TypeScript 接口索引 (`types.ts`)

- `SystemHealthStatus`：定义服务器状态、CPU/内存/JVM、PostGIS 连接池、Redis 缓存与 Netty 活跃 Channel。
- `SocketEngineMetrics`：定义 Netty NIO 模式、TCP/UDP/WS 端口与入站/出站消息吞吐量。
- `GisMapItem`：定义地图业务代码、坐标系（CRS）、中心经纬度、缩放级别与空间四至范围（Bounds）。
- `GisLayerItem`：定义图层类型（Vector/Raster/WMS/WFS）、GeoServer 工作区、透明度与显隐。
- `GeoServerInfo`：定义 GeoServer 服务代理 URL、工作区数、数据存储数与发布图层数。
- `AiModelConfig`：定义大模型提供商（DashScope/DeepSeek/Gemini/OpenAI）、Base URL、模型名与 Temperature。
- `AgentSessionItem`：定义 Space-Match 智能体推演会话状态、迭代步数（Iter）、Token 消耗与思考链摘要（Thinking Stream）。
- `SatellitePayloadItem`：定义光学、SAR、红外、高光谱载荷的分辨率（m）、幅宽（km）、功耗（W）与重量（kg）。
- `LaunchMissionItem`：定义长征/快舟运载火箭型号、目标轨道（SSO/LEO）、倾角（°）与发射窗口。
- `MatchingRuleItem`：定义多目标规划约束规则与权重系数（Weight）。
- `MatchingPlanItem`：定义匹配度得分（MatchScore 0~100%）、方案状态与 AI 推理结论。

---

## 🚀 调用示例

```ts
import { 
  getSystemHealthApi, 
  getGisMapListApi, 
  getSatellitePayloadsApi 
} from '#/api/gis';

// 页面内异步调用
const health = await getSystemHealthApi();
const maps = await getGisMapListApi();
const payloads = await getSatellitePayloadsApi();
```
