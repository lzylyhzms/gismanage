/**
 * ============================================================================
 * Vite 构建与打包应用配置文件 (apps/web-antd)
 * ============================================================================
 * 学习说明：
 * 1. 本文件通过扩展 Vben 封装的 `defineConfig` 函数进行项目个性化构建配置。
 * 2. 默认代理目标设为 Nitro Mock Server (http://localhost:5320/api)，
 *    确保无需先启动后端 gis-base 即可通过内置 Mock 正常登录与浏览全部页面。
 * 3. 当后台后端 gis-base (8080 端口) 启动后，可设置环境变量 VITE_PROXY_TARGET 为 http://localhost:8080 实现直连。
 */

import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    // Vben 框架层预置构建应用参数
    application: {
      // 开启 Gzip & Brotli 构建产物预压缩
      compress: true,
      compressTypes: ['brotli', 'gzip'],
    },
    // Vite 原生底层配置扩展
    vite: {
      esbuild: {
        // 生产打包时移除源码中的 console.log 与 debugger
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      },
      build: {
        rollupOptions: {
          output: {
            // 手动分包 (Manual Chunks 拆包策略)
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('ant-design-vue')) return 'vendor-antd';
                if (id.includes('@vben')) return 'vendor-vben';
                if (id.includes('vue') || id.includes('pinia')) return 'vendor-vue';
              }
            },
          },
        },
      },
      server: {
        // 配置接口反向代理 (Proxy)
        proxy: {
          '/api': {
            changeOrigin: true,
            // 剔除 URL 前缀中的 '/api' 字符串
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 代理目标：默认指向 Nitro Mock 服务端口 5320 (无需先开启 Java 后端即可顺利登录演示)
            target: process.env.VITE_PROXY_TARGET || 'http://localhost:5320/api',
            ws: true, // 开启 WebSocket 代理支持
          },
        },
      },
    },
  };
});
