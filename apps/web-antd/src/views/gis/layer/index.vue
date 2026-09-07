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
  Slider,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { IconifyIcon } from '@vben/icons';

import {
  getGeoServerInfoApi,
  getGisLayerListApi,
  saveGisLayerApi,
} from '#/api/gis';
import type { GeoServerInfo, GisLayerItem } from '#/api/gis';

const loading = ref(false);
const layerList = ref<GisLayerItem[]>([]);
const geoServerInfo = ref<GeoServerInfo>({
  url: 'http://localhost:8080/geoserver',
  connected: true,
  workspacesCount: 3,
  dataStoresCount: 5,
  layersCount: 18,
  connectionTimeoutMs: 5000,
  readTimeoutMs: 30000,
});

const isModalVisible = ref(false);
const modalForm = ref<Partial<GisLayerItem>>({
  layerCode: '',
  layerName: '',
  layerType: 'vector',
  sourceUrl: '',
  workspaceName: 'gis_workspace',
  storeName: 'postgis_ds',
  opacity: 1.0,
  visible: true,
  zIndex: 1,
  status: 'active',
});

const columns = [
  { title: '图层代码', dataIndex: 'layerCode', key: 'layerCode' },
  { title: '图层名称', dataIndex: 'layerName', key: 'layerName' },
  { title: '类型', key: 'layerType' },
  { title: 'GeoServer工作区', dataIndex: 'workspaceName', key: 'workspaceName' },
  { title: '不透明度', key: 'opacity' },
  { title: '显示', key: 'visible' },
  { title: '层级 (zIndex)', dataIndex: 'zIndex', key: 'zIndex' },
  { title: '操作', key: 'action' },
];

async function loadData() {
  loading.value = true;
  try {
    const [layers, geoInfo] = await Promise.all([
      getGisLayerListApi(),
      getGeoServerInfoApi(),
    ]);
    layerList.value = layers;
    geoServerInfo.value = geoInfo;
  } finally {
    loading.value = false;
  }
}

function handleAddLayer() {
  modalForm.value = {
    layerCode: `LAYER_${Date.now().toString().slice(-4)}`,
    layerName: '新建 GIS 空间数据图层',
    layerType: 'vector',
    sourceUrl: 'http://localhost:8080/geoserver/gis_workspace/wms',
    workspaceName: 'gis_workspace',
    storeName: 'postgis_ds',
    opacity: 1.0,
    visible: true,
    zIndex: 1,
    status: 'active',
  };
  isModalVisible.value = true;
}

function handleEditLayer(record: any) {
  modalForm.value = { ...(record as GisLayerItem) };
  isModalVisible.value = true;
}

async function handleSaveLayer() {
  if (!modalForm.value.layerCode || !modalForm.value.layerName) {
    message.warning('请填写图层代码与名称');
    return;
  }
  await saveGisLayerApi(modalForm.value);
  message.success('图层配置已保存');
  isModalVisible.value = false;
  loadData();
}

function toggleVisibility(record: any) {
  const item = record as GisLayerItem;
  item.visible = !item.visible;
  message.info(`图层 [${item.layerName}] 显隐状态已切换为: ${item.visible ? '显示' : '隐藏'}`);
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
        <div class="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
          <IconifyIcon icon="lucide:layers" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">
            GIS 图层与 GeoServer 服务控制
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
            矢量/栅格/WMS/WFS 数据源整合、GeoServer 工作区代理及透明度渲染管理
          </p>
        </div>
      </div>
      <Space>
        <Button @click="loadData" :loading="loading">
          <template #icon><IconifyIcon icon="lucide:rotate-cw" class="w-4 h-4 inline mr-1" /></template>
          刷新
        </Button>
        <Button type="primary" @click="handleAddLayer">
          <template #icon><IconifyIcon icon="lucide:plus" class="w-4 h-4 inline mr-1" /></template>
          新建图层
        </Button>
      </Space>
    </div>

    <!-- GeoServer Status Integration Card -->
    <Card class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center space-x-3">
          <div class="p-3 bg-purple-600 text-white rounded-xl shadow-md">
            <IconifyIcon icon="lucide:server" class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800 dark:text-slate-100 text-base">GeoServer 地图服务器</span>
              <Tag color="success" class="m-0">已连接</Tag>
            </div>
            <div class="text-xs text-slate-500 font-mono mt-1">
              服务代理根 URL: {{ geoServerInfo.url }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6 text-center">
          <div class="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div class="text-xs text-slate-500">工作区 (Workspaces)</div>
            <div class="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {{ geoServerInfo.workspacesCount }}
            </div>
          </div>
          <div class="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div class="text-xs text-slate-500">数据存储 (DataStores)</div>
            <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {{ geoServerInfo.dataStoresCount }}
            </div>
          </div>
          <div class="bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div class="text-xs text-slate-500">发布图层总数</div>
            <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {{ geoServerInfo.layersCount }}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- Layers Table -->
    <Card title="已配置 GIS 图层列表" class="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm">
      <Table
        :columns="columns"
        :data-source="layerList"
        :loading="loading"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'layerType'">
            <Tag :color="(record as GisLayerItem).layerType === 'vector' ? 'blue' : (record as GisLayerItem).layerType === 'raster' ? 'cyan' : 'purple'">
              {{ (record as GisLayerItem).layerType.toUpperCase() }}
            </Tag>
          </template>

          <template v-if="column.key === 'opacity'">
            <div class="flex items-center gap-2 w-32">
              <Slider v-model:value="(record as GisLayerItem).opacity" :min="0" :max="1" :step="0.1" class="flex-1" />
              <span class="text-xs font-mono w-8">{{ Math.round((record as GisLayerItem).opacity * 100) }}%</span>
            </div>
          </template>

          <template v-if="column.key === 'visible'">
            <Button type="text" size="small" @click="toggleVisibility(record)">
              <IconifyIcon :icon="(record as GisLayerItem).visible ? 'lucide:eye' : 'lucide:eye-off'" :class="(record as GisLayerItem).visible ? 'text-emerald-500' : 'text-slate-400'" class="w-4 h-4" />
            </Button>
          </template>

          <template v-if="column.key === 'action'">
            <Space size="small">
              <Button type="link" size="small" @click="handleEditLayer(record)">
                <template #icon><IconifyIcon icon="lucide:pen-line" class="w-3.5 h-3.5 inline mr-0.5" /></template>编辑
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <!-- Layer Edit Modal -->
    <Modal
      v-model:open="isModalVisible"
      title="配置 GIS 图层属性"
      @ok="handleSaveLayer"
      ok-text="保存图层"
    >
      <Form layout="vertical" class="mt-3">
        <Form.Item label="图层代码" required>
          <Input v-model:value="modalForm.layerCode" placeholder="如 VEC_PROVINCES" />
        </Form.Item>
        <Form.Item label="图层名称" required>
          <Input v-model:value="modalForm.layerName" placeholder="如 中国省级行政区划矢量界线" />
        </Form.Item>
        <Row :gutter="16">
          <Col :span="12">
            <Form.Item label="图层类型">
              <Select v-model:value="modalForm.layerType">
                <Select.Option value="vector">Vector 矢量图层</Select.Option>
                <Select.Option value="raster">Raster 栅格图层</Select.Option>
                <Select.Option value="wms">WMS 地图服务</Select.Option>
                <Select.Option value="wfs">WFS 要素服务</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="12">
            <Form.Item label="图层层级 (zIndex)">
              <InputNumber v-model:value="modalForm.zIndex" :min="1" :max="99" class="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="GeoServer 工作区">
          <Input v-model:value="modalForm.workspaceName" />
        </Form.Item>
        <Form.Item label="GeoServer 数据源 URL">
          <Input v-model:value="modalForm.sourceUrl" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
