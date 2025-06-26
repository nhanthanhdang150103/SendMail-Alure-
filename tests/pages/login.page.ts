import { Page } from '@playwright/test';
import { LoginSelectors } from '../selectors/login.selectors';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.navigateTo('/login');
  }

  async enterUsername(username: string) {
    await this.fillElement(LoginSelectors.usernameInput, username);
  }

  async enterPassword(password: string) {
    await this.fillElement(LoginSelectors.passwordInput, password);
  }

  async clickLoginButton() {
    await this.clickElement(LoginSelectors.loginButton);
  }

  async getErrorMessage() {
    return await this.getElementText(LoginSelectors.errorMessage);
  }

  async getSuccessMessage() {
    return await this.getElementText(LoginSelectors.successMessage);
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    // Chờ cho đến khi URL chứa 'desk' để đảm bảo đã đăng nhập và chuyển trang thành công
    // Điều này giúp tránh race condition khi các bước tiếp theo thực thi trước khi trang dashboard tải xong
    await this.page.waitForURL('**/desk', { timeout: 30000 });
  }
}