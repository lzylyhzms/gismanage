<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  message,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import {
  getSocketEngineMetricsApi,
  sendWebSocketTestPushApi,
} from '#/api/gis';
import type { SocketEngineMetrics } from '#/api/gis';

const loading = ref(false);
const sending = ref(false);

const metrics = ref<SocketEngineMetrics>({
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

const pushForm = ref({
  messageType: 'SYSTEM_BROADCAST',
  channelId: 'ALL',
  content: '【系统通知】GIS 空间高分辨率遥感数据更新推播处理完成。',
});

const pushLogs = ref<Array<{ time: string; type: string; content: string; delivered: number }>>([
  {
    time: '16:22:10',
    type: 'SYSTEM_BROADCAST',
    content: '心跳保活数据包已发送给全量 26 个 WebSocket 在线 Channel 客户端',
    delivered: 26,
  },
  {
    time: '16:15:05',
    type: 'GIS_LAYER_UPDATE',
    content: '矢量图层 VEC_CHINA_PROVINCES 增量要素推送中...',
    delivered: 18,
  },
]);

async function loadMetrics() {
  loading.value = true;
  try {
    metrics.value = await getSocketEngineMetricsApi();
  } finally {
    loading.value = false;
  }
}

async function handlePushMessage() {
  if (!pushForm.value.content) {
    message.warning('请填写推送内容');
    return;
  }
  sending.value = true;
  try {
    const res = await sendWebSocketTestPushApi(pushForm.value);
    message.success(`成功推送至 ${res.deliveredCount} 个在线 WebSocket Session！`);
    pushLogs.value.unshift({
      time: new Date().toLocaleTimeString(),
      type: pushForm.value.messageType,
      content: pushForm.value.content,
      delivered: res.deliveredCount,
    });
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  loadMetrics();
});
</script>

<template>
  <div class="p-5 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
          <IconifyIcon icon="lucide:radio" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            Netty 通信引擎与多协议 Socket 控制台
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            监控 Netty 高性能 NIO 通信、TCP/UDP/WebSocket 多协议监听与消息实时推送
          </p>
        </div>
      </div>
      <Space>
        <Tag color="success" class="px-3 py-1 text-xs rounded-full">
          <Badge status="processing" color="#52c41a" /> NIO 引擎正常运行
        </Tag>
        <Button @click="loadMetrics" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
      </Space>
    </div>

    <!-- Engine Protocol Cards -->
    <Row :gutter="[16, 16]">
      <Col :xs="24" :md="8">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div class="flex justify-between items-start">
            <div>
              <Tag color="blue" class="font-mono">TCP Protocol</Tag>
              <div class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                Port {{ metrics.tcpPort }}
              </div>
              <div class="text-xs text-slate-500 mt-1">
                活跃 TCP Socket 链接: <span class="font-bold text-blue-600 dark:text-blue-400">{{ metrics.tcpActiveConnections }}</span>
              </div>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl">
              <IconifyIcon icon="lucide:wifi" class="w-6 h-6" />
            </div>
          </div>
        </Card>
      </Col>

      <Col :xs="24" :md="8">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div class="flex justify-between items-start">
            <div>
              <Tag color="green" class="font-mono">UDP Protocol</Tag>
              <div class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                Port {{ metrics.udpPort }}
              </div>
              <div class="text-xs text-slate-500 mt-1">
                已处理 UDP 数据包: <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ metrics.udpPacketsProcessed }}</span>
              </div>
            </div>
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
              <IconifyIcon icon="lucide:zap" class="w-6 h-6" />
            </div>
          </div>
        </Card>
      </Col>

      <Col :xs="24" :md="8">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div class="flex justify-between items-start">
            <div>
              <Tag color="purple" class="font-mono">WebSocket Protocol</Tag>
              <div class="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                Port {{ metrics.wsPort }}
              </div>
              <div class="text-xs text-slate-500 mt-1">
                Path: <code class="font-mono text-purple-600 dark:text-purple-400">{{ metrics.wsPath }}</code> ({{ metrics.wsActiveSessions }} Sessions)
              </div>
            </div>
            <div class="p-3 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-xl">
              <IconifyIcon icon="lucide:activity" class="w-6 h-6" />
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- Interactive Push Console & Log Stream -->
    <Row :gutter="[16, 16]">
      <Col :xs="24" :lg="12">
        <Card title="WebSocket 实时消息推播测试台" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
          <Form layout="vertical">
            <Form.Item label="消息类型 (Message Type)">
              <Select v-model:value="pushForm.messageType">
                <Select.Option value="SYSTEM_BROADCAST">SYSTEM_BROADCAST (系统广播)</Select.Option>
                <Select.Option value="GIS_LAYER_UPDATE">GIS_LAYER_UPDATE (图层更新点播)</Select.Option>
                <Select.Option value="AI_AGENT_NOTIFY">AI_AGENT_NOTIFY (智能体事件)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="推送目标 Channel/Session">
              <Select v-model:value="pushForm.channelId">
                <Select.Option value="ALL">ALL (全量在线广播 Session)</Select.Option>
                <Select.Option value="CHANNEL_001">Channel_001 (只针对 GIS 前端大屏)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="推播 payload 内容">
              <Input.TextArea v-model:value="pushForm.content" :rows="4" placeholder="输入推送的 JSON 或文本内容..." />
            </Form.Item>

            <Button type="primary" block :loading="sending" @click="handlePushMessage">
              <template #icon><IconifyIcon icon="lucide:send" class="w-4 h-4 inline mr-1" /></template>
              立即推送消息
            </Button>
          </Form>
        </Card>
      </Col>

      <Col :xs="24" :lg="12">
        <Card title="实时推送历史与 Channel 响应" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <div class="space-y-3">
            <div
              v-for="(log, idx) in pushLogs"
              :key="idx"
              class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1"
            >
              <div class="flex justify-between items-center">
                <Tag color="purple">{{ log.type }}</Tag>
                <span class="text-slate-400 font-mono">{{ log.time }}</span>
              </div>
              <p class="text-slate-700 dark:text-slate-200 font-mono m-0 mt-1">
                {{ log.content }}
              </p>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                ✔ 已到达 {{ log.delivered }} 个客户端 Session
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
