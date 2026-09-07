<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import { getGisMapListApi, saveGisMapApi } from '#/api/gis';
import type { GisMapItem } from '#/api/gis';

const loading = ref(false);
const mapList = ref<GisMapItem[]>([]);
const selectedMap = ref<GisMapItem | null>(null);

const isModalVisible = ref(false);
const modalForm = ref<Partial<GisMapItem>>({
  mapCode: '',
  mapName: '',
  crs: 'EPSG:4326',
  centerLongitude: 108.95,
  centerLatitude: 34.27,
  zoomLevel: 5,
  isDefault: false,
  status: 'active',
});

const columns = [
  { title: '地图代码', dataIndex: 'mapCode', key: 'mapCode' },
  { title: '地图名称', dataIndex: 'mapName', key: 'mapName' },
  { title: '坐标系 (CRS)', dataIndex: 'crs', key: 'crs' },
  { title: '中心点 (经, 纬)', key: 'center' },
  { title: '缩放级别', dataIndex: 'zoomLevel', key: 'zoomLevel' },
  { title: '默认地图', key: 'isDefault' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' },
];

async function loadMapData() {
  loading.value = true;
  try {
    const res = await getGisMapListApi();
    mapList.value = res;
    if (res.length > 0 && !selectedMap.value) {
      selectedMap.value = res[0] ?? null;
    }
  } finally {
    loading.value = false;
  }
}

function handleSelectMap(record: any) {
  selectedMap.value = record as GisMapItem;
}

function handleAddMap() {
  modalForm.value = {
    mapCode: `MAP_${Date.now().toString().slice(-4)}`,
    mapName: '新建高精度空间地图',
    crs: 'EPSG:4326',
    centerLongitude: 116.4,
    centerLatitude: 39.9,
    zoomLevel: 6,
    isDefault: false,
    status: 'active',
  };
  isModalVisible.value = true;
}

function handleEditMap(record: any) {
  modalForm.value = { ...(record as GisMapItem) };
  isModalVisible.value = true;
}

async function handleSaveMap() {
  if (!modalForm.value.mapCode || !modalForm.value.mapName) {
    message.warning('请补全地图代码与地图名称');
    return;
  }
  await saveGisMapApi(modalForm.value);
  message.success('保存地图成功');
  isModalVisible.value = false;
  loadMapData();
}

onMounted(() => {
  loadMapData();
});
</script>

<template>
  <div class="p-5 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <IconifyIcon icon="lucide:globe" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            GIS 地图服务与空间数据管理
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            配置空间坐标系、控制视角缩放、关联几何矢量与栅格图层数据
          </p>
        </div>
      </div>
      <Space>
        <Button @click="loadMapData" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
        <Button type="primary" @click="handleAddMap">
          <template #icon><IconifyIcon icon="lucide:plus" class="w-4 h-4 inline mr-1" /></template>
          新建地图
        </Button>
      </Space>
    </div>

    <!-- Main Content Layout -->
    <Row :gutter="[16, 16]">
      <!-- Map List Table -->
      <Col :xs="24" :lg="13">
        <Card title="空间地图注册列表" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
          <Table
            :columns="columns"
            :data-source="mapList"
            :loading="loading"
            row-key="id"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'center'">
                <span class="font-mono text-xs">{{ (record as GisMapItem).centerLongitude }}, {{ (record as GisMapItem).centerLatitude }}</span>
              </template>

              <template v-if="column.key === 'isDefault'">
                <Tag v-if="(record as GisMapItem).isDefault" color="processing">主地图</Tag>
                <span v-else class="text-slate-400 text-xs">-</span>
              </template>

              <template v-if="column.key === 'status'">
                <Tag :color="(record as GisMapItem).status === 'active' ? 'success' : 'default'">
                  {{ (record as GisMapItem).status.toUpperCase() }}
                </Tag>
              </template>

              <template v-if="column.key === 'action'">
                <Space size="small">
                  <Button type="link" size="small" @click="handleSelectMap(record)">
                    <template #icon><IconifyIcon icon="lucide:eye" class="w-3.5 h-3.5 inline mr-0.5" /></template>预览
                  </Button>
                  <Button type="link" size="small" @click="handleEditMap(record)">
                    <template #icon><IconifyIcon icon="lucide:pen-line" class="w-3.5 h-3.5 inline mr-0.5" /></template>编辑
                  </Button>
                </Space>
              </template>
            </template>
          </Table>
        </Card>
      </Col>

      <!-- Interactive Map Preview Component -->
      <Col :xs="24" :lg="11">
        <Card title="地图交互在线预览" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm h-full">
          <template #extra>
            <Tag color="blue" class="font-mono" v-if="selectedMap">
              {{ selectedMap.crs }}
            </Tag>
          </template>

          <div v-if="selectedMap" class="space-y-3">
            <div class="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex flex-col justify-between p-4">
              <!-- Grid overlay graphic representing GIS map space -->
              <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <!-- Map overlays -->
              <div class="relative z-10 flex justify-between items-start">
                <div class="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200">
                  <div class="font-semibold flex items-center gap-1 text-blue-400">
                    <IconifyIcon icon="lucide:compass" class="w-4 h-4" /> {{ selectedMap.mapName }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    中心点: [{{ selectedMap.centerLongitude }}, {{ selectedMap.centerLatitude }}] | Zoom: {{ selectedMap.zoomLevel }}
                  </div>
                </div>

                <div class="bg-slate-800/80 backdrop-blur-md px-2 py-1 rounded border border-slate-700 text-[10px] text-emerald-400 font-mono">
                  LIVE GIS CANVAS
                </div>
              </div>

              <!-- Animated Spatial Marker Pin -->
              <div class="relative z-10 flex flex-col items-center justify-center my-auto">
                <div class="p-3 bg-blue-500/20 rounded-full animate-ping absolute w-12 h-12"></div>
                <div class="p-2.5 bg-blue-600 text-white rounded-full shadow-lg relative z-20">
                  <IconifyIcon icon="lucide:map-pin" class="w-6 h-6" />
                </div>
                <div class="mt-2 bg-slate-900/90 text-white px-2.5 py-1 rounded text-xs border border-slate-700 shadow-md">
                  空间中心点定位
                </div>
              </div>

              <!-- Map Footer Stats -->
              <div class="relative z-10 flex justify-between items-center bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <IconifyIcon icon="lucide:layers" class="w-4 h-4 text-purple-400" />
                  <span>已绑定图层: <strong class="text-white">{{ selectedMap.layerIds.length }}</strong> 层</span>
                </div>
                <span class="text-slate-400 text-[11px]">空间范围: [{{ selectedMap.bounds.join(', ') }}]</span>
              </div>
            </div>

            <!-- Map Metadata Card -->
            <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <div class="flex justify-between">
                <span>地图代码:</span> <strong class="font-mono text-slate-800 dark:text-slate-100">{{ selectedMap.mapCode }}</strong>
              </div>
              <div class="flex justify-between">
                <span>渲染引擎模式:</span> <Tag color="purple">WebGL Vector & Raster Layer</Tag>
              </div>
              <div class="flex justify-between">
                <span>更新时间:</span> <span>{{ selectedMap.updateTime }}</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- Modal Form for Edit/Create -->
    <Modal
      v-model:open="isModalVisible"
      title="配置空间地图元数据"
      @ok="handleSaveMap"
      ok-text="保存地图配置"
    >
      <Form layout="vertical" class="mt-3">
        <Form.Item label="地图代码" required>
          <Input v-model:value="modalForm.mapCode" placeholder="如 CHINA_BASE_MAP" />
        </Form.Item>
        <Form.Item label="地图名称" required>
          <Input v-model:value="modalForm.mapName" placeholder="如 全国高分辨率遥感基础地图" />
        </Form.Item>
        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="坐标参照系 (CRS)">
              <Select v-model:value="modalForm.crs">
                <Select.Option value="EPSG:4326">EPSG:4326 (WGS 84)</Select.Option>
                <Select.Option value="EPSG:3857">EPSG:3857 (Web Mercator)</Select.Option>
                <Select.Option value="CGCS2000">CGCS2000 国家大地坐标系</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="默认缩放级别 (Zoom)">
              <InputNumber v-model:value="modalForm.zoomLevel" :min="1" :max="20" class="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="中心点经度 (Longitude)">
              <InputNumber v-model:value="modalForm.centerLongitude" :step="0.01" class="w-full" />
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="中心点纬度 (Latitude)">
              <InputNumber v-model:value="modalForm.centerLatitude" :step="0.01" class="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="设为主默认地图">
          <Switch v-model:checked="modalForm.isDefault" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
