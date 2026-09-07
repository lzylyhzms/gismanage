/**
 * ============================================================================
 * AI 大模型与 Space-Match 智能体 API 服务
 * ============================================================================
 * 学习说明：
 * 本模块对接 gis-base 内部包含的 AI Agent / LLM 模块。
 * 覆盖大模型提供商绑定 (DashScope/Qwen, DeepSeek, Gemini, OpenAI)、
 * 智能体多轮推理思考链 (Thinking Stream)、迭代步数监控与提示词沙箱测试。
 */

import type { AgentSessionItem, AiModelConfig } from './types';

import { requestClient } from '#/api/request';

/**
 * 获取系统当前绑定的 AI 大模型配置参数
 * @returns Promise<AiModelConfig> 模型服务配置
 */
export async function getAiModelConfigApi(): Promise<AiModelConfig> {
  try {
    return await requestClient.get<AiModelConfig>('/gis/ai/config');
  } catch {
    // 降级 Mock 数据：演示默认结合 DashScope 通义千问 qwen-plus 模型
    return {
      enabled: true,
      provider: 'DashScope',
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      modelName: 'qwen-plus',
      temperature: 0.7, // 采样温度 0.7 适合兼顾确定性与创造性
      maxTokens: 2000,
    };
  }
}

/**
 * 获取 Space-Match 智能体当前运行与历史推演会话列表及日志
 * @returns Promise<AgentSessionItem[]> 会话及日志数组
 */
export async function getAgentSessionsApi(): Promise<AgentSessionItem[]> {
  try {
    return await requestClient.get<AgentSessionItem[]>('/spacematch/agent/sessions');
  } catch {
    return [
      {
        sessionId: 'session-sm-901',
        sessionName: '光学载荷-低轨卫星轨道推演配对',
        model: 'dashscope:qwen-plus',
        status: 'running',
        currentIter: 4,
        maxIters: 12,
        tokenConsumption: 3420,
        elapsedSeconds: 24,
        lastThinkingSummary: '正在校验规则 Rule-003(分辨率阈值<=1m) 及 Rule-005(发射时间窗口匹配)...',
        startTime: '2026-08-12 16:15:00',
      },
      {
        sessionId: 'session-sm-898',
        sessionName: 'SAR合成孔径雷达窗口能耗规划',
        model: 'deepseek:deepseek-chat',
        status: 'completed',
        currentIter: 8,
        maxIters: 12,
        tokenConsumption: 5120,
        elapsedSeconds: 42,
        lastThinkingSummary: '得出最优解：分配至长征六号 CZ-6 任务 2026-09 窗口，匹配度 96.5分。',
        startTime: '2026-08-12 15:30:00',
      },
      {
        sessionId: 'session-sm-892',
        sessionName: '高光谱卫星多载荷组合容限优化',
        model: 'gemini:gemini-2.5-flash',
        status: 'completed',
        currentIter: 6,
        maxIters: 10,
        tokenConsumption: 4100,
        elapsedSeconds: 31,
        lastThinkingSummary: '已解决整流罩包络约束冲突，计算生成 2 套备选配对方案。',
        startTime: '2026-08-12 14:10:00',
      },
    ];
  }
}

/**
 * 执行 AI 空间智能推理与提示词测试
 * @param prompt 空间业务推演指令
 * @returns Promise<{ reply: string; thinking: string }> 包含思考链过程与最终生成回复
 */
export async function executeAiChatApi(prompt: string): Promise<{ reply: string; thinking: string }> {
  try {
    return await requestClient.post<{ reply: string; thinking: string }>('/ai/chat', { prompt });
  } catch {
    // 模拟 Agent 逐步思考链日志与推演输出
    return {
      thinking: 'Analysis query: ' + prompt + '\n- Step 1: Identifying spatial constraints & satellite payload parameters...\n- Step 2: Querying PostGIS layer boundary intersect table...\n- Step 3: Optimization complete.',
      reply: `[GIS-Base AI Agent Assistant Response]\n已接收指令：“${prompt}”。根据系统当前绑定的模型 (qwen-plus) 与空间规则引擎推演，该载荷与卫星轨道的匹配容限值为 95.8%，符合发射调度要求。`,
    };
  }
}
