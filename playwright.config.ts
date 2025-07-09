// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Đường dẫn đến file lưu trạng thái xác thực
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  // Timeout toàn cục cho mỗi test case, bao gồm cả hooks.
  timeout: 60000, 

  // Cấu hình các "projects" để tách biệt giai đoạn setup và test
  projects: [
    // Project 'setup' chỉ chạy file auth.setup.ts
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/, // Chỉ tìm và chạy file này
    },

    // Project chính để chạy test Cucumber, phụ thuộc vào 'setup'
    {
      name: 'cucumber-tests',
      testMatch: /features\.test\.ts/, // File giả để kích hoạt Playwright (sẽ giải thích ở dưới)
      use: {
        // Sử dụng trạng thái đã được chuẩn bị bởi project 'setup'
        storageState: STORAGE_STATE,
        headless: process.env.HEADLESS_MODE === 'true',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
      },
      // Đảm bảo project 'setup' chạy xong trước khi project này bắt đầu
      dependencies: ['setup'],
    },
  ],

  // Các cấu hình use toàn cục (sẽ được kế thừa bởi các projects)
  use: {
    actionTimeout: 30000,
    navigationTimeout: 90000,
  },
});