/**
 * ============================================================================
 * GIS-Base 系统核心数据模型与 TypeScript 接口定义
 * ============================================================================
 * 说明：
 * 本文件定义了前端与 gis-base (Spring Boot 3 + PostGIS + Netty + AI Agent) 交互的所有数据结构。
 * 包含：系统健康度、Netty 网络通信引擎指标、GIS 地图与图层、AI 大模型与智能体、航天载荷与匹配规则。
 */

/**
 * 核心后端系统运行健康状态接口
 */
export interface SystemHealthStatus {
  /** 服务器运行状态: running (正常运行), degraded (降级/预警), offline (离线) */
  serverStatus: 'running' | 'degraded' | 'offline';
  /** 后端 Spring Boot 应用版本号 (如 1.0-SNAPSHOT) */
  backendVersion: string;
  /** 后端系统已连续运行总秒数 */
  uptimeSeconds: number;
  /** 服务器 CPU 实时使用率百分比 (0-100) */
  cpuUsage: number;
  /** 物理内存使用率百分比 */
  memoryUsagePercentage: number;
  /** JVM 堆内存已使用量 (MB) */
  jvmUsedMemoryMb: number;
  /** JVM 堆内存最大分配量 (MB) */
  jvmMaxMemoryMb: number;
  /** PostGIS 数据库连接状态 */
  dbStatus: 'healthy' | 'error';
  /** PostGIS 数据库当前活跃 HikariCP 连接池数量 */
  dbActiveConnections: number;
  /** Redis 缓存服务连接状态 */
  redisStatus: 'healthy' | 'error';
  /** Redis 数据库中当前已缓存 Key 总数 */
  redisKeyCount: number;
  /** Netty 多协议 Socket 通信引擎运行状态 */
  nettyStatus: 'active' | 'inactive';
  /** Netty 引擎当前保持长链接的活跃 Channel 总数 */
  nettyActiveChannels: number;
  /** GeoServer 地图代理服务器可达状态 */
  geoServerStatus: 'online' | 'offline';
  /** 当前正在执行中的 Space-Match AI 智能体任务数量 */
  activeAiTasks: number;
}

/**
 * Netty 多协议 (TCP / UDP / WebSocket)Socket 通信引擎指标接口
 */
export interface SocketEngineMetrics {
  /** 通信引擎模式: NETTY (高性能异步 NIO) 或 BIO (传统阻塞式) */
  engineMode: 'NETTY' | 'BIO';
  /** 是否开启 TCP 协议长连接监听 */
  tcpEnabled: boolean;
  /** TCP 协议监听端口号 (默认 9001) */
  tcpPort: number;
  /** 当前保持连接的 TCP Socket 客户端数量 */
  tcpActiveConnections: number;
  /** 是否开启 UDP 协议数据报监听 */
  udpEnabled: boolean;
  /** UDP 协议监听端口号 (默认 9002) */
  udpPort: number;
  /** 已累积接收并处理的 UDP 数据包总数 */
  udpPacketsProcessed: number;
  /** 是否开启 WebSocket 协议监听 */
  wsEnabled: boolean;
  /** WebSocket 监听端口号 (默认 9003) */
  wsPort: number;
  /** WebSocket 握手端点 Path (默认 /ws/netty-chat) */
  wsPath: string;
  /** WebSocket 当前保持通信的活跃 Session 握手会话数 */
  wsActiveSessions: number;
  /** 网络引擎入站消息总吞吐量 (Packets/Messages In) */
  totalMessagesIn: number;
  /** 网络引擎出站推播总吞吐量 (Packets/Messages Out) */
  totalMessagesOut: number;
  /** 消息网络推播平均平均延时 (毫秒 ms) */
  avgLatencyMs: number;
}

/**
 * GIS 空间地图配置项定义
 */
export interface GisMapItem {
  /** 地图唯一主键 ID */
  id: string;
  /** 地图业务代码 (如 CHINA_BASE_MAP) */
  mapCode: string;
  /** 地图展示名称 */
  mapName: string;
  /** 空间坐标参照系 (CRS), 如 EPSG:4326 (WGS84), EPSG:3857 (Web Mercator), CGCS2000 */
  crs: string;
  /** 地图初始视角的中心点经度 (Longitude) */
  centerLongitude: number;
  /** 地图初始视角的中心点纬度 (Latitude) */
  centerLatitude: number;
  /** 地图初始缩放级别 (Zoom Level 1-20) */
  zoomLevel: number;
  /** 地图空间四至范围 bounds: [最小经度, 最小纬度, 最大经度, 最大纬度] */
  bounds: [number, number, number, number];
  /** 是否设为前端系统初始化展示的主默认地图 */
  isDefault: boolean;
  /** 状态: active (启用), disabled (禁用) */
  status: 'active' | 'disabled';
  /** 该地图所绑定的关联图层 ID 列表 */
  layerIds: string[];
  /** 创建时间 */
  createTime: string;
  /** 最近更新时间 */
  updateTime: string;
}

/**
 * GIS 空间图层配置定义 (矢量 / 栅格 / GeoServer 服务)
 */
export interface GisLayerItem {
  /** 图层唯一 ID */
  id: string;
  /** 图层业务代码 */
  layerCode: string;
  /** 图层展示名称 */
  layerName: string;
  /** 图层数据类型: vector (矢量), raster (栅格), wms (WMS服务), wmts, wfs (WFS要素) */
  layerType: 'vector' | 'raster' | 'wms' | 'wmts' | 'wfs';
  /** 数据源 URL 或 GeoServer 代理端点 */
  sourceUrl: string;
  /** GeoServer 工作区名称 (Workspace, 如 gis_workspace) */
  workspaceName?: string;
  /** GeoServer 数据存储名称 (DataStore, 如 postgis_ds) */
  storeName?: string;
  /** 图层渲染样式名称 (SLD / JSON Style) */
  styleName?: string;
  /** 图层渲染不透明度 (0.0 完全透明 - 1.0 不透明) */
  opacity: number;
  /** 图层当前显隐状态: true (显示), false (隐藏) */
  visible: boolean;
  /** 渲染层级顺序 (zIndex 决定覆盖层级) */
  zIndex: number;
  /** 空间几何图形类型: Point, LineString, Polygon, MultiPolygon, Raster */
  geometryType?: 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon' | 'Raster';
  /** 要素数量 (Vector Features Count) */
  featureCount?: number;
  /** 图层激活状态 */
  status: 'active' | 'disabled';
  /** 创建时间 */
  createTime: string;
}

/**
 * GeoServer 地图服务器代理连接状态定义
 */
export interface GeoServerInfo {
  /** GeoServer REST / WMS 服务根 URL */
  url: string;
  /** 地图服务器连通状态 */
  connected: boolean;
  /** 已创建的工作区总数 */
  workspacesCount: number;
  /** 已配置的数据存储 (DataStore) 总数 */
  dataStoresCount: number;
  /** 已发布出的 GIS 图层总数 */
  layersCount: number;
  /** 连接超时设定 (ms) */
  connectionTimeoutMs: number;
  /** 读取数据超时设定 (ms) */
  readTimeoutMs: number;
}

/**
 * AI 大模型服务配置定义
 */
export interface AiModelConfig {
  /** 是否启用 AI 智能体大模型服务 */
  enabled: boolean;
  /** 模型提供商: OpenAI, DashScope (通义千问), DeepSeek, Gemini */
  provider: 'OpenAI' | 'DashScope' | 'DeepSeek' | 'Gemini';
  /** 大模型 API Endpoint 根地址 */
  baseUrl: string;
  /** 当前绑定的主模型名称 (如 qwen-plus, deepseek-chat, gpt-3.5-turbo) */
  modelName: string;
  /** 采样温度 (Temperature 0.0 - 1.0, 值越高随机性越强) */
  temperature: number;
  /** 单次推理最大 Token 上限 */
  maxTokens: number;
}

/**
 * Space-Match AI 智能体推理会话与日志定义
 */
export interface AgentSessionItem {
  /** 会话唯一编号 (Session ID) */
  sessionId: string;
  /** 会话业务名称 (如 光学载荷-低轨卫星轨道推演配对) */
  sessionName: string;
  /** 执行推理所调用的模型 */
  model: string;
  /** 智能体运行状态: idle (空闲), running (推理中), completed (完成), failed (失败) */
  status: 'idle' | 'running' | 'completed' | 'failed';
  /** 当前 Agent 推理迭代轮次 (Current Step Iteration) */
  currentIter: number;
  /** 最大允许迭代轮次 (Max Iterations Limit) */
  maxIters: number;
  /** 已消耗的上下文 Token 总量 */
  tokenConsumption: number;
  /** 推理过程已耗费时间 (秒) */
  elapsedSeconds: number;
  /** 智能体最近一轮思考链摘要 (Thinking Stream Summary) */
  lastThinkingSummary: string;
  /** 会话启动时间 */
  startTime: string;
}

/**
 * 航天卫星载荷与传感器属性定义 (Space-Match)
 */
export interface SatellitePayloadItem {
  /** 载荷唯一 ID */
  id: string;
  /** 载荷编号 (如 OPT-HR-001) */
  payloadCode: string;
  /** 载荷名称 (如 0.5m高分辨率亚米级光学相机) */
  payloadName: string;
  /** 传感器类型: Optical (光学相机), SAR (合成孔径雷达), Infrared (红外测温), Hyperspectral (高光谱) */
  payloadType: 'Optical' | 'SAR' | 'Infrared' | 'Hyperspectral';
  /** 空间分辨率 (单位: 米 m) */
  resolutionMeters: number;
  /** 成像是幅宽 (Swath Width, 单位: 公里 km) */
  swathWidthKm: number;
  /** 运行功耗预算 (单位: 瓦特 W) */
  powerConsumptionW: number;
  /** 载荷物理重量 (单位: 千克 kg) */
  weightKg: number;
  /** 响应波段范围 (如 0.45-0.90 µm) */
  bandRange: string;
  /** 载荷状态: available (可用), assigned (已配对分配), maintenance (维护中) */
  status: 'available' | 'assigned' | 'maintenance';
}

/**
 * 运载火箭发射任务与轨道计划定义
 */
export interface LaunchMissionItem {
  /** 任务 ID */
  id: string;
  /** 发射任务编号 (如 CZ-2D-2026-M03) */
  missionCode: string;
  /** 运载火箭型号 (如 长征二号丁 CZ-2D) */
  rocketType: string;
  /** 整流罩最大运载能力上限 (kg) */
  payloadCapacityKg: number;
  /** 目标轨道类型 (如 SSO 500km 太阳同步轨道, LEO 400km) */
  targetOrbit: string;
  /** 轨道倾角 (单位: 度 °) */
  orbitInclinationDeg: number;
  /** 发射时间窗口起始时间 */
  launchWindowStart: string;
  /** 发射时间窗口截止时间 */
  launchWindowEnd: string;
  /** 当前已分配搭载的载荷数量 */
  assignedPayloadsCount: number;
  /** 任务状态: planning (规划中), scheduled (已排期), launched (已发射), cancelled (取消) */
  status: 'planning' | 'scheduled' | 'launched' | 'cancelled';
}

/**
 * 智能匹配规则引擎约束定义
 */
export interface MatchingRuleItem {
  /** 规则 ID */
  id: string;
  /** 规则代码 */
  ruleCode: string;
  /** 规则名称 (如 整流罩运载重量硬性上限约束) */
  ruleName: string;
  /** 规则分类: Weight (重量), Power (电源能耗), Orbit (轨道), Schedule (时间窗口) */
  ruleCategory: 'Resolution' | 'Orbit' | 'Weight' | 'Power' | 'Schedule';
  /** 权重系数 (0.0 - 1.0) */
  weight: number;
  /** 约束阈值表达式 (如 <= Rocket.PayloadCapacityKg) */
  thresholdValue: string;
  /** 是否启用该约束规则 */
  isEnabled: boolean;
}

/**
 * 智能匹配推演生成的配对方案矩阵定义
 */
export interface MatchingPlanItem {
  /** 方案 ID */
  id: string;
  /** 方案代码 */
  planCode: string;
  /** 方案名称 */
  planName: string;
  /** 关联的卫星载荷 ID */
  satellitePayloadId: string;
  /** 载荷名称 */
  payloadName: string;
  /** 关联的火箭发射任务 ID */
  launchMissionId: string;
  /** 发射任务代码 */
  missionCode: string;
  /** 匹配综合评分 (0 - 100 分) */
  matchScore: number;
  /** 方案状态: optimal (最优匹配), feasible (可行匹配), conflict (约束冲突) */
  matchStatus: 'feasible' | 'optimal' | 'conflict';
  /** AI Agent 智能体生成的约束推理分析总结 */
  reasoningSummary: string;
  /** 方案计算生成时间 */
  createTime: string;
}
