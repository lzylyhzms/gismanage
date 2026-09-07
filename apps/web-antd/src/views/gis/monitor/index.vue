<script lang="ts" setup>
/**
 * ============================================================================
 * GIS-Base 服务运行与实时监控大屏 (Dashboard View)
 * ============================================================================
 * 学习说明：
 * 1. 本页面使用 Vue 3 `<script setup>` 组合式 API + TypeScript 编写。
 * 2. 核心功能：
 *    - 展示 gis-base 后端运行状态、CPU/内存/JVM 堆指标、PostGIS 数据库 Hikari 连接池。
 *    - 实时监测 Netty 引擎 (TCP 9001, UDP 9002, WebSocket 9003) 吞吐。
 *    - 使用定时器 (setInterval) 每 10s 自动轮询更新监控数据，并在组件销毁 (onUnmounted) 时显式清理定时器防泄露。
 * 3. 布局体系：
 *    - 采用 Tailwind CSS flex/grid 响应式类名 + Ant Design Vue 的 `<Row>` 与 `<Col>` 响应式网格布局。
 *    - 使用 `@vben/icons` 导出的 `<IconifyIcon icon="lucide:..." />` 呈现矢量图标。
 */

import { onMounted, onUnmounted, ref } from 'vue';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import { getSocketEngineMetricsApi, getSystemHealthApi } from '#/api/gis';
import type { SocketEngineMetrics, SystemHealthStatus } from '#/api/gis';

// 页面加载控制状态
const loading = ref(false);

// 后端核心服务健康度响应式响应数据 ref
const healthData = ref<SystemHealthStatus>({
  serverStatus: 'running',
  backendVersion: '1.0-SNAPSHOT',
  uptimeSeconds: 154200,
  cpuUsage: 28.5,
  memoryUsagePercentage: 42.1,
  jvmUsedMemoryMb: 612,
  jvmMaxMemoryMb: 2048,
  dbStatus: 'healthy',
  dbActiveConnections: 14,
  redisStatus: 'healthy',
  redisKeyCount: 1280,
  nettyStatus: 'active',
  nettyActiveChannels: 38,
  geoServerStatus: 'online',
  activeAiTasks: 3,
});

// Netty Socket 引擎实时吞吐量响应式数据 ref
const socketMetrics = ref<SocketEngineMetrics>({
  engineMode: 'NETTY',
  tcpEnabled: true,
  tcpPort: 9001,
  tcpActiveConnections: 12,
  udpEnabled: true,
  udpPort: 9002,
  udpPacketsProcessed: 142050,
  wsEnabled: true,
  wsPort: 9003,
  wsPath: '/ws/netty-chat',
  wsActiveSessions: 26,
  totalMessagesIn: 893420,
  totalMessagesOut: 1042300,
  avgLatencyMs: 3.2,
});

// 系统实时控制台日志响应式数组
const systemLogs = ref<
  Array<{ time: string; level: 'info' | 'warn' | 'error'; message: string }>
>([
  {
    time: '16:20:15',
    level: 'info',
    message: '[GIS-Server] Netty Engine WS listener active on port 9003 (/ws/netty-chat)',
  },
  {
    time: '16:18:42',
    level: 'info',
    message: '[PostGIS] Spatial Index SP-GiST rebuild completed for table layer_vector_china',
  },
  {
    time: '16:15:00',
    level: 'info',
    message: '[Space-Match Agent] Started payload match session session-sm-901',
  },
  {
    time: '16:10:22',
    level: 'warn',
    message: '[GeoServer Proxy] Connection latency spiked to 45ms during WMS tile request',
  },
]);

// 存储定时器引用指针
let timer: any = null;

/**
 * 刷新后端与 Netty 通信引擎的监控指标
 */
async function refreshMetrics() {
  loading.value = true;
  try {
    // 使用 Promise.all 并行请求健康度与 Netty 引擎状态
    const [hRes, sRes] = await Promise.all([
      getSystemHealthApi(),
      getSocketEngineMetricsApi(),
    ]);
    healthData.value = hRes;
    socketMetrics.value = sRes;
  } finally {
    loading.value = false;
  }
}

/**
 * 将已运行秒数格式化转换为人类可读的“天/小时/分”字符串
 * @param seconds 已运行总秒数
 */
function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}小时 ${mins}分`;
}

// Vue 3 挂载组件钩子：初始化获取数据，并设置 10 秒定时自动轮询
onMounted(() => {
  refreshMetrics();
  timer = setInterval(refreshMetrics, 10000);
});

// Vue 3 卸载组件钩子：必须及时清理 setInterval 定时器，防止内存泄漏！
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="p-5 space-y-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
    <!-- 页头顶部操作与说明卡片 -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg dark:text-blue-400">
          <IconifyIcon icon="lucide:server" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            GIS-Base 服务运行与实时监控大屏
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            核心后端版本 v{{ healthData.backendVersion }} | 实时状态监测与拓展插件槽位
          </p>
        </div>
      </div>
      <Space>
        <Tag color="success" class="px-3 py-1 text-xs rounded-full flex items-center gap-1">
          <Badge status="processing" color="#52c41a" /> 后端服务就绪 (Spring Boot)
        </Tag>
        <Button type="primary" :loading="loading" @click="refreshMetrics">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新状态
        </Button>
      </Space>
    </div>

    <!-- 顶部四个核心指标卡片 Grid 网格 -->
    <Row :gutter="[16, 16]">
      <!-- CPU 使用率卡片 -->
      <Col :xs="24" :sm="12" :md="6">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-500">System CPU Usage</div>
              <div class="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {{ healthData.cpuUsage }}%
              </div>
            </div>
            <div class="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-500 rounded-xl">
              <IconifyIcon icon="lucide:cpu" class="w-6 h-6" />
            </div>
          </div>
          <Progress :percent="healthData.cpuUsage" :show-info="false" stroke-color="#6366f1" class="mt-3 m-0" />
        </Card>
      </Col>

      <!-- JVM 堆内存卡片 -->
      <Col :xs="24" :sm="12" :md="6">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-500">JVM Heap Memory</div>
              <div class="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {{ healthData.jvmUsedMemoryMb }} / {{ healthData.jvmMaxMemoryMb }} MB
              </div>
            </div>
            <div class="p-3 bg-cyan-50 dark:bg-cyan-950 text-cyan-500 rounded-xl">
              <IconifyIcon icon="lucide:hard-drive" class="w-6 h-6" />
            </div>
          </div>
          <Progress
            :percent="Math.round((healthData.jvmUsedMemoryMb / healthData.jvmMaxMemoryMb) * 100)"
            :show-info="false"
            stroke-color="#06b6d4"
            class="mt-3 m-0"
          />
        </Card>
      </Col>

      <!-- PostGIS 数据库连接池卡片 -->
      <Col :xs="24" :sm="12" :md="6">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-500">PostGIS Database</div>
              <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <IconifyIcon icon="lucide:check-circle-2" class="w-5 h-5" /> 正常
              </div>
            </div>
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
              <IconifyIcon icon="lucide:database" class="w-6 h-6" />
            </div>
          </div>
          <div class="mt-3 text-xs text-slate-500">
            活跃连接数: <span class="font-semibold text-slate-700 dark:text-slate-300">{{ healthData.dbActiveConnections }}</span>
          </div>
        </Card>
      </Col>

      <!-- Netty 长连接 Channels 卡片 -->
      <Col :xs="24" :sm="12" :md="6">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-500">Netty Socket Channels</div>
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {{ healthData.nettyActiveChannels }} Active
              </div>
            </div>
            <div class="p-3 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-xl">
              <IconifyIcon icon="lucide:radio" class="w-6 h-6" />
            </div>
          </div>
          <div class="mt-3 text-xs text-slate-500">
            Engine Mode: <Tag color="purple" class="font-mono text-[10px]">{{ socketMetrics.engineMode }}</Tag>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- 下部：子系统运行指标与控制台日志 Stream -->
    <Row :gutter="[16, 16]">
      <Col :xs="24" :lg="16">
        <Card title="核心子系统运行指标" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
          <template #extra>
            <span class="text-xs text-slate-400">持续运行时间: {{ formatUptime(healthData.uptimeSeconds) }}</span>
          </template>

          <Row :gutter="[16, 16]">
            <Col :span="8">
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                <IconifyIcon icon="lucide:globe-2" class="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <div class="text-xs text-slate-500">GeoServer Proxy</div>
                <div class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  <Tag color="success">ONLINE</Tag>
                </div>
              </div>
            </Col>
            <Col :span="8">
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                <IconifyIcon icon="lucide:zap" class="w-6 h-6 mx-auto text-amber-500 mb-1" />
                <div class="text-xs text-slate-500">Redis Cache</div>
                <div class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {{ healthData.redisKeyCount }} Keys
                </div>
              </div>
            </Col>
            <Col :span="8">
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                <IconifyIcon icon="lucide:activity" class="w-6 h-6 mx-auto text-pink-500 mb-1" />
                <div class="text-xs text-slate-500">AI Agent Active Tasks</div>
                <div class="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {{ healthData.activeAiTasks }} Active
                </div>
              </div>
            </Col>
          </Row>

          <div class="mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
            <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Netty 引擎多协议通信状态</h4>
            <Descriptions :column="3" size="small" bordered>
              <Descriptions.Item label="TCP (端口 9001)">
                <Tag color="blue">{{ socketMetrics.tcpActiveConnections }} 链接</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="UDP (端口 9002)">
                <Tag color="green">{{ socketMetrics.udpPacketsProcessed }} 包 processed</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="WebSocket (端口 9003)">
                <Tag color="purple">{{ socketMetrics.wsActiveSessions }} 会话</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="总入站消息数">
                <Statistic :value="socketMetrics.totalMessagesIn" class="text-xs" />
              </Descriptions.Item>
              <Descriptions.Item label="总出站消息数">
                <Statistic :value="socketMetrics.totalMessagesOut" class="text-xs" />
              </Descriptions.Item>
              <Descriptions.Item label="平均推播延时">
                <span class="font-bold text-emerald-600">{{ socketMetrics.avgLatencyMs }} ms</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </Col>

      <!-- 时间轴形式展示实时控制台日志 -->
      <Col :xs="24" :lg="8">
        <Card title="系统实时控制台日志" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <Timeline class="mt-2 font-mono text-xs">
            <Timeline.Item v-for="(log, idx) in systemLogs" :key="idx" :color="log.level === 'error' ? 'red' : log.level === 'warn' ? 'orange' : 'blue'">
              <div class="text-slate-400 text-[11px]">{{ log.time }}</div>
              <div class="text-slate-700 dark:text-slate-300 mt-0.5">{{ log.message }}</div>
            </Timeline.Item>
          </Timeline>
        </Card>
      </Col>
    </Row>
  </div>
</template>
