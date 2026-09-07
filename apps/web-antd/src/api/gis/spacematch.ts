/**
 * ============================================================================
 * Space-Match 航天资源与载荷智能匹配业务 API
 * ============================================================================
 * 学习说明：
 * 本模块对接 gis-base 系统中的 `module-payload` 与 `space-match` 航天业务模块。
 * 覆盖卫星载荷传感器参数库、运载火箭发射任务窗口、智能匹配规则引擎以及 AI 推演生成的配对方案矩阵。
 */

import type {
  LaunchMissionItem,
  MatchingPlanItem,
  MatchingRuleItem,
  SatellitePayloadItem,
} from './types';

import { requestClient } from '#/api/request';

/**
 * 获取卫星载荷与传感器参数元数据列表 (光学、SAR雷达、热红外、高光谱)
 * @returns Promise<SatellitePayloadItem[]> 载荷数据数组
 */
export async function getSatellitePayloadsApi(): Promise<SatellitePayloadItem[]> {
  try {
    return await requestClient.get<SatellitePayloadItem[]>('/spacematch/payload/list');
  } catch {
    return [
      {
        id: 'payload-01',
        payloadCode: 'OPT-HR-001',
        payloadName: '0.5m高分辨率亚米级光学相机',
        payloadType: 'Optical',
        resolutionMeters: 0.5,
        swathWidthKm: 25,
        powerConsumptionW: 350,
        weightKg: 120,
        bandRange: '0.45-0.90 µm (可见光-近红外)',
        status: 'assigned',
      },
      {
        id: 'payload-02',
        payloadCode: 'SAR-C-BAND-002',
        payloadName: 'C波段合成孔径雷达 (SAR)',
        payloadType: 'SAR',
        resolutionMeters: 1.0,
        swathWidthKm: 50,
        powerConsumptionW: 1200,
        weightKg: 280,
        bandRange: 'C-Band (5.4 GHz)',
        status: 'available',
      },
      {
        id: 'payload-03',
        payloadCode: 'INFRA-THERM-003',
        payloadName: '热红外夜视遥感测温仪',
        payloadType: 'Infrared',
        resolutionMeters: 5.0,
        swathWidthKm: 120,
        powerConsumptionW: 240,
        weightKg: 85,
        bandRange: '8.0-12.5 µm (长波热红外)',
        status: 'available',
      },
      {
        id: 'payload-04',
        payloadCode: 'HYPER-SPEC-004',
        payloadName: '全光谱高光谱环境监测成像仪',
        payloadType: 'Hyperspectral',
        resolutionMeters: 10.0,
        swathWidthKm: 60,
        powerConsumptionW: 420,
        weightKg: 160,
        bandRange: '0.4-2.5 µm (256通道)',
        status: 'maintenance',
      },
    ];
  }
}

/**
 * 获取运载火箭发射任务与轨道倾角计划列表
 * @returns Promise<LaunchMissionItem[]> 发射任务数组
 */
export async function getLaunchMissionsApi(): Promise<LaunchMissionItem[]> {
  try {
    return await requestClient.get<LaunchMissionItem[]>('/spacematch/launch/list');
  } catch {
    return [
      {
        id: 'launch-01',
        missionCode: 'CZ-2D-2026-M03',
        rocketType: '长征二号丁 (CZ-2D)',
        payloadCapacityKg: 1300,
        targetOrbit: 'SSO 500km 太阳同步轨道',
        orbitInclinationDeg: 97.4,
        launchWindowStart: '2026-09-15 08:30:00',
        launchWindowEnd: '2026-09-15 10:00:00',
        assignedPayloadsCount: 2,
        status: 'scheduled',
      },
      {
        id: 'launch-02',
        missionCode: 'CZ-6A-2026-M08',
        rocketType: '长征六号改 (CZ-6A)',
        payloadCapacityKg: 4500,
        targetOrbit: 'SSO 700km',
        orbitInclinationDeg: 98.2,
        launchWindowStart: '2026-10-20 14:00:00',
        launchWindowEnd: '2026-10-20 16:30:00',
        assignedPayloadsCount: 1,
        status: 'planning',
      },
      {
        id: 'launch-03',
        missionCode: 'KZ-11-2026-M02',
        rocketType: '快舟十一号 (KZ-11)',
        payloadCapacityKg: 1000,
        targetOrbit: 'LEO 400km 近地轨道',
        orbitInclinationDeg: 42.0,
        launchWindowStart: '2026-11-05 06:00:00',
        launchWindowEnd: '2026-11-05 08:00:00',
        assignedPayloadsCount: 0,
        status: 'planning',
      },
    ];
  }
}

/**
 * 获取智能匹配规则引擎的约束配置 (重量/能耗/轨道/时间窗口)
 * @returns Promise<MatchingRuleItem[]> 匹配规则数组
 */
export async function getMatchingRulesApi(): Promise<MatchingRuleItem[]> {
  try {
    return await requestClient.get<MatchingRuleItem[]>('/spacematch/rule/list');
  } catch {
    return [
      {
        id: 'rule-01',
        ruleCode: 'RULE_WEIGHT_CAPACITY',
        ruleName: '整流罩运载重量硬性上限约束',
        ruleCategory: 'Weight',
        weight: 0.3,
        thresholdValue: '<= Rocket.PayloadCapacityKg',
        isEnabled: true,
      },
      {
        id: 'rule-02',
        ruleCode: 'RULE_POWER_BUDGET',
        ruleName: '卫星平台电源能耗预算配比',
        ruleCategory: 'Power',
        weight: 0.25,
        thresholdValue: 'PowerSum <= Platform.MaxPower',
        isEnabled: true,
      },
      {
        id: 'rule-03',
        ruleCode: 'RULE_ORBIT_ALTITUDE',
        ruleName: '空间遥感分辨率与轨道高度衰减',
        ruleCategory: 'Orbit',
        weight: 0.25,
        thresholdValue: 'Altitude >= 400km AND Altitude <= 800km',
        isEnabled: true,
      },
      {
        id: 'rule-04',
        ruleCode: 'RULE_LAUNCH_WINDOW',
        ruleName: '发射时间窗口与载荷交接容限',
        ruleCategory: 'Schedule',
        weight: 0.2,
        thresholdValue: 'LeadTime >= 30 Days',
        isEnabled: true,
      },
    ];
  }
}

/**
 * 获取推演计算生成的配对方案矩阵列表
 * @returns Promise<MatchingPlanItem[]> 方案结果数组
 */
export async function getMatchingPlansApi(): Promise<MatchingPlanItem[]> {
  try {
    return await requestClient.get<MatchingPlanItem[]>('/spacematch/plan/list');
  } catch {
    return [
      {
        id: 'plan-101',
        planCode: 'PLAN-OPT-CZ2D-01',
        planName: '亚米级光学相机 + 长征二号丁 500km SSO 最优匹配',
        satellitePayloadId: 'payload-01',
        payloadName: '0.5m高分辨率亚米级光学相机',
        launchMissionId: 'launch-01',
        missionCode: 'CZ-2D-2026-M03',
        matchScore: 97.8,
        matchStatus: 'optimal',
        reasoningSummary: '重量包络余量 1180kg，电源供给充沛，降轨倾角97.4度完全符合亚米级相机光照覆盖要求。',
        createTime: '2026-08-11 15:40:00',
      },
      {
        id: 'plan-102',
        planCode: 'PLAN-SAR-CZ6A-02',
        planName: 'C波段SAR + 长征六号改 700km 匹配方案',
        satellitePayloadId: 'payload-02',
        payloadName: 'C波段合成孔径雷达 (SAR)',
        launchMissionId: 'launch-02',
        missionCode: 'CZ-6A-2026-M08',
        matchScore: 92.5,
        matchStatus: 'feasible',
        reasoningSummary: '满足SAR功耗1200W大功率需求，整流罩空间充裕，可作为主力载荷搭载。',
        createTime: '2026-08-12 10:20:00',
      },
    ];
  }
}
