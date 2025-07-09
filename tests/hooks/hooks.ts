// tests/hooks/hooks.ts

import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, AfterStep, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import { STORAGE_STATE } from '../../playwright.config'; // <-- THÊM DÒNG NÀY
import * as dotenv from 'dotenv';

// Tải biến môi trường từ file .env
dotenv.config();

let browser: Browser;
let context: BrowserContext; // <-- THÊM DÒNG NÀY
let page: Page;
// Tăng timeout mặc định
setDefaultTimeout(300 * 1000);

BeforeAll(async () => {
  const headlessEnv = process.env.HEADLESS_MODE;
  const headless = headlessEnv !== undefined ? headlessEnv.toLowerCase() === 'true' : true;
  const slowMoEnv = process.env.SLOW_MO;
  const slowMo = slowMoEnv ? parseInt(slowMoEnv, 10) : undefined;

  browser = await chromium.launch({
    headless: headless,
    slowMo: slowMo,
  });
});

// THAY ĐỔI QUAN TRỌNG Ở ĐÂY
Before(async (scenario: ITestCaseHookParameter) => {
  // Kiểm tra xem kịch bản có tag @no-auth hay không (sẽ giải thích ở dưới)
  const isNoAuthScenario = scenario.pickle.tags.some(tag => tag.name === '@no-auth');

  if (isNoAuthScenario) {
    // Nếu có tag @no-auth, tạo một context sạch không có trạng thái đăng nhập
    context = await browser.newContext();
  } else {
    // Đối với các kịch bản còn lại, tạo context với trạng thái đã đăng nhập
    context = await browser.newContext({
      storageState: STORAGE_STATE,
    });
  }

  page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(90000);
});

// Hook này sẽ chạy sau mỗi step
AfterStep(async function (this: any, { pickleStep, result }) {
  console.log(`[STEP] :: ${pickleStep.text} - Status: ${result.status}`);

  if (result.status === Status.FAILED) {
    try {
      const image = await page.screenshot();
      this.attach(image, 'image/png');
    } catch (error) {
      console.error("Không thể chụp ảnh màn hình hoặc đính kèm:", error);
    }
  }
});

// THAY ĐỔI Ở ĐÂY: Đóng context thay vì page
After(async () => {
  await context.close();
});

AfterAll(async () => {
  await browser.close();
});

export { page };