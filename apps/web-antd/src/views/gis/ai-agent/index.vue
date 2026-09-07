<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Progress,
  Row,
  Space,
  Tag,
  message,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import {
  executeAiChatApi,
  getAgentSessionsApi,
  getAiModelConfigApi,
} from '#/api/gis';
import type { AgentSessionItem, AiModelConfig } from '#/api/gis';

const loading = ref(false);
const chatLoading = ref(false);

const modelConfig = ref<AiModelConfig>({
  enabled: true,
  provider: 'DashScope',
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  modelName: 'qwen-plus',
  temperature: 0.7,
  maxTokens: 2000,
});

const sessions = ref<AgentSessionItem[]>([]);

const userPrompt = ref('请推演全光谱高光谱成像仪在 500km SSO 轨道的覆盖窗口与约束容限');
const chatThinking = ref('');
const chatReply = ref('');

async function loadData() {
  loading.value = true;
  try {
    const [cfg, sess] = await Promise.all([
      getAiModelConfigApi(),
      getAgentSessionsApi(),
    ]);
    modelConfig.value = cfg;
    sessions.value = sess;
  } finally {
    loading.value = false;
  }
}

async function handleTestChat() {
  if (!userPrompt.value) {
    message.warning('请输入测试提示词');
    return;
  }
  chatLoading.value = true;
  try {
    const res = await executeAiChatApi(userPrompt.value);
    chatThinking.value = res.thinking;
    chatReply.value = res.reply;
    message.success('AI Agent 智能体执行成功！');
  } finally {
    chatLoading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="p-5 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
          <IconifyIcon icon="lucide:bot" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            AI 大模型与 Space-Match 智能体调度
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            集成 Qwen / DeepSeek / Gemini 大模型，监控 Space-Match 智能体推理思考链与 Iter 状态
          </p>
        </div>
      </div>
      <Space>
        <Tag color="processing" class="px-3 py-1 text-xs rounded-full">
          <Badge status="processing" color="#1890ff" /> Agent Engine Active
        </Tag>
        <Button @click="loadData" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
      </Space>
    </div>

    <!-- LLM Config Overview -->
    <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center space-x-3">
          <div class="p-3 bg-blue-600 text-white rounded-xl shadow-md">
            <IconifyIcon icon="lucide:sparkles" class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-base">当前绑定 LLM 服务</span>
              <Tag color="blue">{{ modelConfig.provider }}</Tag>
              <Tag color="purple" class="font-mono">{{ modelConfig.modelName }}</Tag>
            </div>
            <div class="text-xs text-slate-500 font-mono mt-1">
              Base URL: {{ modelConfig.baseUrl }}
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-center">
            <div class="text-xs text-slate-500">Temperature</div>
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {{ modelConfig.temperature }}
            </div>
          </div>
          <div class="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-center">
            <div class="text-xs text-slate-500">Max Tokens</div>
            <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {{ modelConfig.maxTokens }}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Active Agent Sessions -->
    <Card title="Space-Match 智能体推理会话监控" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
      <Row :gutter="[16, 16]">
        <Col v-for="item in sessions" :key="item.sessionId" :xs="24" :md="8">
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-bold text-slate-800 dark:text-slate-100 text-sm block">{{ item.sessionName }}</span>
                <span class="text-[11px] font-mono text-slate-400">{{ item.sessionId }}</span>
              </div>
              <Tag :color="item.status === 'running' ? 'processing' : item.status === 'completed' ? 'success' : 'default'">
                {{ item.status.toUpperCase() }}
              </Tag>
            </div>

            <div>
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span>推理 Iter 步骤进度</span>
                <span class="font-bold text-blue-600">{{ item.currentIter }} / {{ item.maxIters }}</span>
              </div>
              <Progress :percent="Math.round((item.currentIter / item.maxIters) * 100)" :show-info="false" stroke-color="#3b82f6" />
            </div>

            <div class="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300">
              <div class="text-[10px] text-slate-400 font-semibold mb-0.5">THINKING STREAM:</div>
              {{ item.lastThinkingSummary }}
            </div>

            <div class="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
              <span>Token 消耗: <strong class="text-slate-700 dark:text-slate-300">{{ item.tokenConsumption }}</strong></span>
              <span>耗时: {{ item.elapsedSeconds }}s</span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>

    <!-- Interactive AI Agent Playground -->
    <Card title="智能体推理沙箱与提示词调试" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
      <Row :gutter="[16, 16]">
        <Col :xs="24" :lg="12">
          <Form layout="vertical">
            <Form.Item label="输入空间推理指令 / 提示词 (Prompt)">
              <Input.TextArea v-model:value="userPrompt" :rows="4" />
            </Form.Item>

            <Button type="primary" block :loading="chatLoading" @click="handleTestChat">
              <template #icon><IconifyIcon icon="lucide:play" class="w-4 h-4 inline mr-1" /></template>
              运行 AI Agent 空间智能推理
            </Button>
          </Form>
        </Col>

        <Col :xs="24" :lg="12">
          <div class="space-y-3">
            <div v-if="chatThinking" class="p-3 bg-slate-900 text-slate-300 rounded-xl font-mono text-xs border border-slate-700">
              <div class="text-blue-400 font-bold flex items-center gap-1 mb-1">
                <IconifyIcon icon="lucide:brain-circuit" class="w-4 h-4" /> 智能体思考链 (Thinking Stream):
              </div>
              <pre class="whitespace-pre-wrap m-0 text-[11px] text-slate-400">{{ chatThinking }}</pre>
            </div>

            <div v-if="chatReply" class="p-3 bg-blue-500/10 border border-blue-500/20 text-slate-800 dark:text-slate-100 rounded-xl text-xs">
              <div class="text-emerald-500 font-bold flex items-center gap-1 mb-1">
                <IconifyIcon icon="lucide:check-circle-2" class="w-4 h-4" /> 推理生成结果:
              </div>
              <p class="m-0 whitespace-pre-wrap leading-relaxed">{{ chatReply }}</p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
