/**
 * ============================================================================
 * GIS-Base 系统管理与监控前端路由模块定义
 * ============================================================================
 * 学习说明：
 * 1. 本文件遵循 Vben Admin v5 动态路由模块规范，导出 `RouteRecordRaw[]` 结构。
 * 2. 核心架构可拓展性设计：
 *    - 父路由路径设为 `/gis`，下挂监控大屏、地图空间数据、图层GeoServer、Netty网络、AI Agent及Space-Match方案。
 *    - 页面采用 Component Dynamic Import (`() => import(...)`) 懒加载机制，只有在访问相应子菜单时才下载对应代码包，不增加首屏体积。
 *    - Meta 配置：
 *      - `icon`: 关联框架内置的 Iconify 图标名称 (如 `lucide:globe`)
 *      - `order`: 菜单排序优先级 (小值排在前面)
 *      - `affixTab`: 设为 `true` 表示该标签页固钉在顶部 Tab 栏不可随意关闭
 */

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:globe', // 主菜单栏左侧显示的全局球体图标
      order: 1,              // 侧边栏菜单中的排序编号
      title: 'GIS-Base 监控管理', // 侧边栏及面包屑父级标题
    },
    name: 'GisSystem',
    path: '/gis',
    children: [
      {
        name: 'GisMonitor',
        path: 'monitor',
        component: () => import('#/views/gis/monitor/index.vue'),
        meta: {
          affixTab: true,    // 默认固钉在页头 Tab 栏
          icon: 'lucide:activity',
          title: '服务运行大屏',
        },
      },
      {
        name: 'GisMap',
        path: 'map',
        component: () => import('#/views/gis/map/index.vue'),
        meta: {
          icon: 'lucide:map',
          title: '地图与空间数据',
        },
      },
      {
        name: 'GisLayer',
        path: 'layer',
        component: () => import('#/views/gis/layer/index.vue'),
        meta: {
          icon: 'lucide:layers',
          title: '图层与 GeoServer',
        },
      },
      {
        name: 'GisNetty',
        path: 'netty',
        component: () => import('#/views/gis/netty/index.vue'),
        meta: {
          icon: 'lucide:radio',
          title: 'Netty 通信控制台',
        },
      },
      {
        name: 'GisAiAgent',
        path: 'ai-agent',
        component: () => import('#/views/gis/ai-agent/index.vue'),
        meta: {
          icon: 'lucide:bot',
          title: 'AI 与智能体调度',
        },
      },
      {
        name: 'GisSpacePayload',
        path: 'payload',
        component: () => import('#/views/gis/spacematch/payload.vue'),
        meta: {
          icon: 'lucide:satellite',
          title: '卫星载荷管理',
        },
      },
      {
        name: 'GisSpacePlan',
        path: 'plan',
        component: () => import('#/views/gis/spacematch/plan.vue'),
        meta: {
          icon: 'lucide:rocket',
          title: '航天资源匹配方案',
        },
      },
    ],
  },
];

export default routes;
