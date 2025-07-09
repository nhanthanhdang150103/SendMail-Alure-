// tests/setup/auth.setup.ts

import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages/login.page';
import * as dotenv from 'dotenv';
import path from 'path';

// Tải biến môi trường từ file .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Đường dẫn đến file sẽ lưu trạng thái xác thực
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Khởi tạo trang LoginPage
  const loginPage = new LoginPage(page);
  
  // Lấy thông tin đăng nhập từ biến môi trường
  const username = process.env.LOGIN_USERNAME;
  const password = process.env.LOGIN_PASSWORD;

  if (!username || !password) {
    throw new Error('LOGIN_USERNAME hoặc LOGIN_PASSWORD không được định nghĩa trong file .env');
  }

  // Thực hiện các bước đăng nhập
  await loginPage.navigate();
  await loginPage.login(username, password);

  // Chờ đợi để đảm bảo đăng nhập thành công và trang đã ổn định
  // Ví dụ: chờ đến khi thấy thông báo thành công hoặc một element đặc trưng của trang dashboard
//   await expect(page.locator('.swal2-title')).toHaveText('Logged In Successfully.');
//   await expect(page.locator('a[href*="dashboard"]')).toBeVisible({ timeout: 10000 });
  
  // Lưu trạng thái xác thực (cookies, local storage) vào file authFile
  await page.context().storageState({ path: authFile });
});