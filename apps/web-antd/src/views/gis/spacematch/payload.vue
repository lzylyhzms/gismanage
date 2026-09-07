<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import { getSatellitePayloadsApi } from '#/api/gis';
import type { SatellitePayloadItem } from '#/api/gis';

const loading = ref(false);
const payloadList = ref<SatellitePayloadItem[]>([]);

const columns = [
  { title: '载荷代码', dataIndex: 'payloadCode', key: 'payloadCode' },
  { title: '载荷名称', dataIndex: 'payloadName', key: 'payloadName' },
  { title: '传感器类型', key: 'payloadType' },
  { title: '空间分辨率', key: 'resolution' },
  { title: '幅宽 (Swath)', key: 'swath' },
  { title: '功耗', key: 'power' },
  { title: '重量', key: 'weight' },
  { title: '状态', key: 'status' },
];

async function loadData() {
  loading.value = true;
  try {
    payloadList.value = await getSatellitePayloadsApi();
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
        <div class="p-2.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg">
          <IconifyIcon icon="lucide:satellite" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            Space-Match 卫星载荷与传感器参数库
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            光学、SAR 合成孔径雷达、热红外及全光谱载荷空间分辨率与能耗配比管理
          </p>
        </div>
      </div>
      <Space>
        <Button @click="loadData" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
        <Button type="primary">
          <template #icon><IconifyIcon icon="lucide:plus" class="w-4 h-4 inline mr-1" /></template>
          登记新载荷
        </Button>
      </Space>
    </div>

    <!-- Payload Grid List -->
    <Row :gutter="[16, 16]">
      <Col v-for="item in payloadList" :key="item.id" :xs="24" :md="12" :lg="6">
        <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-3">
            <Tag :color="item.payloadType === 'Optical' ? 'blue' : item.payloadType === 'SAR' ? 'purple' : item.payloadType === 'Infrared' ? 'orange' : 'cyan'">
              {{ item.payloadType }}
            </Tag>
            <Tag :color="item.status === 'assigned' ? 'processing' : item.status === 'available' ? 'success' : 'warning'">
              {{ item.status.toUpperCase() }}
            </Tag>
          </div>

          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm m-0 line-clamp-1">
            {{ item.payloadName }}
          </h3>
          <div class="text-[11px] font-mono text-slate-400 mt-0.5">{{ item.payloadCode }}</div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div class="flex justify-between">
              <span>空间分辨率:</span> <strong class="text-blue-600 dark:text-blue-400 font-mono">{{ item.resolutionMeters }} m</strong>
            </div>
            <div class="flex justify-between">
              <span>成像是幅宽:</span> <span class="font-mono">{{ item.swathWidthKm }} km</span>
            </div>
            <div class="flex justify-between">
              <span>功耗预算:</span> <span class="font-mono">{{ item.powerConsumptionW }} W</span>
            </div>
            <div class="flex justify-between">
              <span>载荷重量:</span> <span class="font-mono">{{ item.weightKg }} kg</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- Detailed Table -->
    <Card title="卫星载荷规格明细" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
      <Table :columns="columns" :data-source="payloadList" :loading="loading" row-key="id" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'payloadType'">
            <Tag color="blue">{{ (record as SatellitePayloadItem).payloadType }}</Tag>
          </template>

          <template v-if="column.key === 'resolution'">
            <span class="font-bold text-blue-600 font-mono">{{ (record as SatellitePayloadItem).resolutionMeters }} 米</span>
          </template>

          <template v-if="column.key === 'swath'">
            <span class="font-mono">{{ (record as SatellitePayloadItem).swathWidthKm }} km</span>
          </template>

          <template v-if="column.key === 'power'">
            <span class="font-mono">{{ (record as SatellitePayloadItem).powerConsumptionW }} W</span>
          </template>

          <template v-if="column.key === 'weight'">
            <span class="font-mono">{{ (record as SatellitePayloadItem).weightKg }} kg</span>
          </template>

          <template v-if="column.key === 'status'">
            <Tag :color="(record as SatellitePayloadItem).status === 'assigned' ? 'processing' : (record as SatellitePayloadItem).status === 'available' ? 'success' : 'warning'">
              {{ (record as SatellitePayloadItem).status.toUpperCase() }}
            </Tag>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
