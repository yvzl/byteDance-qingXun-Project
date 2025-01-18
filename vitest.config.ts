import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // 使用 Node.js 环境
    setupFiles: ['./vite.config.ts'], // 如果你有全局设置文件
    deps: {
      inline: ['util'], // 确保 util 模块被内联
    },
  },
});