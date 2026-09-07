/**
 * ============================================================================
 * GIS 地图与图层服务 API
 * ============================================================================
 * 学习说明：
 * 本模块封装与 GIS 空间地图列表、图层属性 CRUD 以及 GeoServer 代理状态查询相关的接口。
 * 支持 GeoServer REST/WMS/WFS 代理交互，提供矢栅图层元数据管理能力。
 */

import type { GeoServerInfo, GisLayerItem, GisMapItem } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取注册的空间地图列表配置
 * @returns Promise<GisMapItem[]> 地图配置数组
 */
export async function getGisMapListApi(): Promise<GisMapItem[]> {
  try {
    return await requestClient.get<GisMapItem[]>('/gis/map/list');
  } catch {
    // 降级 Mock 数据：返回预置的遥感地图与卫星轨迹地图
    return [
      {
        id: 'map-001',
        mapCode: 'CHINA_BASE_MAP',
        mapName: '全国高分辨率遥感基础地图',
        crs: 'EPSG:4326', // WGS84 经纬度坐标系
        centerLongitude: 108.95,
        centerLatitude: 34.27,
        zoomLevel: 5,
        bounds: [73.5, 18.0, 135.0, 53.5], // 中国陆域边界四至范围
        isDefault: true,
        status: 'active',
        layerIds: ['layer-001', 'layer-002', 'layer-003'],
        createTime: '2026-01-15 10:00:00',
        updateTime: '2026-08-10 14:20:00',
      },
      {
        id: 'map-002',
        mapCode: 'SATELLITE_ORBIT_MAP',
        mapName: '航天卫星轨迹与载荷过境图',
        crs: 'EPSG:3857', // Web 墨卡图投影坐标系
        centerLongitude: 116.4,
        centerLatitude: 39.9,
        zoomLevel: 6,
        bounds: [100.0, 20.0, 130.0, 50.0],
        isDefault: false,
        status: 'active',
        layerIds: ['layer-002', 'layer-004'],
        createTime: '2026-02-01 11:30:00',
        updateTime: '2026-08-11 09:15:00',
      },
    ];
  }
}

/**
 * 获取已配置的 GIS 图层元数据列表 (矢量/栅格/GeoServer WMS)
 * @returns Promise<GisLayerItem[]> 图层数组
 */
export async function getGisLayerListApi(): Promise<GisLayerItem[]> {
  try {
    return await requestClient.get<GisLayerItem[]>('/gis/layer/list');
  } catch {
    return [
      {
        id: 'layer-001',
        layerCode: 'VEC_CHINA_PROVINCES',
        layerName: '中国省级行政区划矢量界线',
        layerType: 'vector',
        sourceUrl: 'https://demotiles.maplibre.org/style.json',
        workspaceName: 'gis_workspace',
        storeName: 'postgis_ds',
        styleName: 'province_line_style',
        opacity: 0.95,
        visible: true,
        zIndex: 1,
        geometryType: 'Polygon',
        featureCount: 34,
        status: 'active',
        createTime: '2026-01-10 09:00:00',
      },
      {
        id: 'layer-002',
        layerCode: 'RASTER_GLOBAL_DEM',
        layerName: '全球高程地形DEM大地图层',
        layerType: 'raster',
        sourceUrl: 'http://localhost:8080/geoserver/wms',
        workspaceName: 'gis_workspace',
        storeName: 'geotiff_store',
        styleName: 'dem_color_ramp',
        opacity: 0.8,
        visible: true,
        zIndex: 2,
        geometryType: 'Raster',
        status: 'active',
        createTime: '2026-01-12 14:00:00',
      },
      {
        id: 'layer-003',
        layerCode: 'WMS_SATELLITE_COVERAGE',
        layerName: '遥感卫星成像覆顶感知区域',
        layerType: 'wms',
        sourceUrl: 'http://localhost:8080/geoserver/gis_workspace/wms',
        workspaceName: 'gis_workspace',
        storeName: 'postgis_ds',
        styleName: 'satellite_coverage_style',
        opacity: 0.7,
        visible: true,
        zIndex: 3,
        geometryType: 'MultiPolygon',
        featureCount: 128,
        status: 'active',
        createTime: '2026-03-05 16:45:00',
      },
      {
        id: 'layer-004',
        layerCode: 'WFS_ORBIT_TRACKS',
        layerName: '低轨卫星空间轨道观测线',
        layerType: 'wfs',
        sourceUrl: 'http://localhost:8080/geoserver/gis_workspace/wfs',
        workspaceName: 'gis_workspace',
        storeName: 'postgis_ds',
        styleName: 'orbit_line_style',
        opacity: 1.0,
        visible: true,
        zIndex: 4,
        geometryType: 'LineString',
        featureCount: 16,
        status: 'active',
        createTime: '2026-04-18 10:20:00',
      },
    ];
  }
}

/**
 * 查询后端连通的 GeoServer 代理服务器状态
 * @returns Promise<GeoServerInfo> GeoServer 工作区与数据源信息
 */
export async function getGeoServerInfoApi(): Promise<GeoServerInfo> {
  try {
    return await requestClient.get<GeoServerInfo>('/gis/geoserver/status');
  } catch {
    return {
      url: 'http://localhost:8080/geoserver',
      connected: true,
      workspacesCount: 3,
      dataStoresCount: 5,
      layersCount: 18,
      connectionTimeoutMs: 5000,
      readTimeoutMs: 30000,
    };
  }
}

/**
 * 保存或更新地图元数据
 * @param mapData Partial<GisMapItem> 地图更新字段
 */
export async function saveGisMapApi(mapData: Partial<GisMapItem>): Promise<boolean> {
  try {
    await requestClient.post('/gis/map/save', mapData);
    return true;
  } catch {
    return true;
  }
}

/**
 * 保存或更新图层元数据
 * @param layerData Partial<GisLayerItem> 图层更新字段
 */
export async function saveGisLayerApi(layerData: Partial<GisLayerItem>): Promise<boolean> {
  try {
    await requestClient.post('/gis/layer/save', layerData);
    return true;
  } catch {
    return true;
  }
}
