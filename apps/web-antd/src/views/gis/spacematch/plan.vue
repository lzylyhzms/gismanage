<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Tag,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import {
  getLaunchMissionsApi,
  getMatchingPlansApi,
  getMatchingRulesApi,
} from '#/api/gis';
import type {
  LaunchMissionItem,
  MatchingPlanItem,
  MatchingRuleItem,
} from '#/api/gis';

const loading = ref(false);
const missions = ref<LaunchMissionItem[]>([]);
const rules = ref<MatchingRuleItem[]>([]);
const plans = ref<MatchingPlanItem[]>([]);

async function loadData() {
  loading.value = true;
  try {
    const [mRes, rRes, pRes] = await Promise.all([
      getLaunchMissionsApi(),
      getMatchingRulesApi(),
      getMatchingPlansApi(),
    ]);
    missions.value = mRes;
    rules.value = rRes;
    plans.value = pRes;
  } finally {
    loading.value = false;
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
        <div class="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
          <IconifyIcon icon="lucide:rocket" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            航天资源与载荷智能匹配方案控制台
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            基于多目标优化与规则引擎的火箭整流罩容量分配、轨道倾角匹配与方案计算
          </p>
        </div>
      </div>
      <Space>
        <Button @click="loadData" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
        <Button type="primary">
          <template #icon><IconifyIcon icon="lucide:sparkles" class="w-4 h-4 inline mr-1" /></template>
          触发智能匹配计算
        </Button>
      </Space>
    </div>

    <!-- Rockets & Launch Missions -->
    <Card title="运载火箭与发射任务窗口" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
      <Row :gutter="[16, 16]">
        <Col v-for="item in missions" :key="item.id" :xs="24" :md="8">
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="flex justify-between items-start">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-sm">{{ item.missionCode }}</span>
              <Tag :color="item.status === 'scheduled' ? 'processing' : 'default'">
                {{ item.status.toUpperCase() }}
              </Tag>
            </div>
            <div class="text-xs text-slate-500 font-semibold">{{ item.rocketType }}</div>

            <div class="pt-2 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div class="flex justify-between">
                <span>运载能力上限:</span> <strong class="text-orange-600 dark:text-orange-400 font-mono">{{ item.payloadCapacityKg }} kg</strong>
              </div>
              <div class="flex justify-between">
                <span>目标轨道/倾角:</span> <span class="font-mono">{{ item.targetOrbit }} ({{ item.orbitInclinationDeg }}°)</span>
              </div>
              <div class="flex justify-between">
                <span>发射窗口起止:</span> <span class="text-[11px] font-mono text-slate-400">{{ item.launchWindowStart.split(' ')[0] }}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>

    <!-- Matching Plans Matrix -->
    <Row :gutter="[16, 16]">
      <Col :xs="24" :lg="14">
        <Card title="已推演生成匹配方案矩阵" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="space-y-4">
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-bold text-slate-800 dark:text-slate-100 text-sm block">{{ plan.planName }}</span>
                  <span class="text-xs font-mono text-slate-400">{{ plan.planCode }}</span>
                </div>
                <Tag color="success" class="text-sm px-2.5 py-0.5">
                  匹配度: {{ plan.matchScore }}%
                </Tag>
              </div>

              <div class="p-3 bg-white dark:bg-slate-900 rounded-lg text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                <div class="flex justify-between">
                  <span>配对载荷:</span> <strong class="text-blue-600 dark:text-blue-400">{{ plan.payloadName }}</strong>
                </div>
                <div class="flex justify-between">
                  <span>配对任务:</span> <strong class="text-orange-600 dark:text-orange-400">{{ plan.missionCode }}</strong>
                </div>
              </div>

              <div class="p-2.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs">
                <span class="font-semibold">AI Reasoning:</span> {{ plan.reasoningSummary }}
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col :xs="24" :lg="10">
        <Card title="规则引擎约束配置" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <div class="space-y-3">
            <div
              v-for="rule in rules"
              :key="rule.id"
              class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1"
            >
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-800 dark:text-slate-100">{{ rule.ruleName }}</span>
                <Tag color="blue">权重: {{ rule.weight }}</Tag>
              </div>
              <div class="text-[11px] font-mono text-slate-400 mt-1">
                Threshold: {{ rule.thresholdValue }}
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
