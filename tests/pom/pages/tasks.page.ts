// pom/pages/tasks.page.ts

import { Page } from '@playwright/test';
import { TasksSelectors } from '../selectors/tasks.selectors';
import { BasePage } from './base.page/base.page';

export class TasksPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    // THAY ĐỔI: Không cần đăng nhập lại ở đây nữa.
    // Chỉ cần điều hướng thẳng đến trang quản lý task.
    await this.navigateTo('/tasks-list');
    
    // Mở form Add New
    await this.clickElement(TasksSelectors.addNewButton, { timeout: 10000 });
    // Đảm bảo form sẵn sàng
    await this.waitForElementVisible(TasksSelectors.titleInput, 10000);
  }

  // ... các hàm addTask, getSuccessMessage, getErrorMessage giữ nguyên ...
  async addTask(title: string, startDate: string, endDate: string, hours: string, project: string, summary: string, description: string) {
    await this.page.fill(TasksSelectors.titleInput, title);
    
    await this.page.evaluate(({ selector, dateValue }) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) element.value = dateValue;
    }, { selector: TasksSelectors.startDateInput, dateValue: startDate });

    await this.page.evaluate(({ selector, dateValue }) => {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) element.value = dateValue;
    }, { selector: TasksSelectors.endDateInput, dateValue: endDate });

    await this.fillElement(TasksSelectors.estimatedHourInput, hours);

    await this.clickElement(TasksSelectors.projectSelect);
    await this.page.locator('li.select2-results__option', { hasText: project }).click();

    await this.fillElement(TasksSelectors.summaryTextarea, summary);

    const editorIframeSelector = 'iframe[title="Editable area. Press F10 for toolbar."]';
    const editorFrame = this.page.frameLocator(editorIframeSelector);
    await editorFrame.locator(TasksSelectors.descriptionEditor).fill(description);

    await this.clickElement(TasksSelectors.saveButton);
  }

  async getSuccessMessage() {
    return await this.getElementText(TasksSelectors.successMessage);
  }

  async getErrorMessage() {
    return await this.getElementText(TasksSelectors.errorMessage);
  }
}