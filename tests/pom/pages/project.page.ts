// pom/pages/project.page.ts

import { Page } from '@playwright/test';
import { ProjectSelectors } from '../selectors/project.selector';
import { BasePage } from './base.page/base.page';
export class ProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    // THAY ĐỔI: Không cần đăng nhập lại ở đây nữa.
    // Chỉ cần điều hướng thẳng đến trang quản lý project.
    await this.navigateTo('/projects-list');

    // Mở form Add New
    await this.clickElement(ProjectSelectors.addNewButton, { timeout: 10000 });
    // Đảm bảo form sẵn sàng
    await this.waitForElementVisible(ProjectSelectors.titleInput, 10000);
  }

  // ... các hàm addProject, getSuccessMessage, getErrorMessage giữ nguyên ...
  async addProject(title: string, client: string, hours: string, priority: string, startDate: string, endDate: string, summary: string, team: string) {
    // Điền tiêu đề nếu có
    if (title) {
        await this.fillElement(ProjectSelectors.titleInput, title);
    }

    // Chọn client
    await this.clickElement(ProjectSelectors.clientSelect);
    await this.page.locator('li.select2-results__option', { hasText: client }).first().click();

    // Điền giờ ước tính
    await this.fillElement(ProjectSelectors.hoursInput, hours);

    // Chọn mức độ ưu tiên
    await this.clickElement(ProjectSelectors.prioritySelect);
    await this.page.locator('li.select2-results__option', { hasText: priority }).first().click();

    // Điền ngày bắt đầu bằng JavaScript execution
    await this.page.evaluate(
      ({ selector, dateValue }) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) element.value = dateValue;
      },
      { selector: ProjectSelectors.startDateInput, dateValue: startDate }
    );

    // Điền ngày kết thúc bằng JavaScript execution
    await this.page.evaluate(
      ({ selector, dateValue }) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) element.value = dateValue;
      },
      { selector: ProjectSelectors.endDateInput, dateValue: endDate }
    );

    // Điền tóm tắt
    await this.fillElement(ProjectSelectors.summaryTextarea, summary);

    // Chọn team
    await this.clickElement(ProjectSelectors.teamSelect);
    await this.page.locator(ProjectSelectors.teamOption).click();

    // Nhấn nút Save
    await this.clickElement(ProjectSelectors.saveButton);
  }

  async getSuccessMessage() {
    return await this.getElementText(ProjectSelectors.successMessage);
  }

  async getErrorMessage() {
    return await this.getElementText(ProjectSelectors.titleErrorMessage);
  }
}