import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import config from '../test.config.js';

Given('User navigates to the application', { timeout: 10 * 1000 }, async function () {
  //const browser = await chromium.launch({ headless: false });
  //const context = await browser.newContext();
  //this.page = await context.newPage();
  await this.page.goto(config.appUrl);
});

Given('User log into the application using {string} with password {string}', async function (userName, password) {
  await this.page.locator('[data-testid=userId]').click();
  await this.page.locator('[data-testid=userId]').fill(userName);
  await this.page.locator('[data-testid=continue]').click();
  await this.page.locator('[data-testid=password]').click();
  await this.page.locator('[data-testid=password]').fill(password);
  await this.page.locator('[data-testid=login]').click();
  await this.page.waitForTimeout(1000);
  const pageTitleEle = await this.page.locator('[data-testid=breadcrumb]');
  const pageTitle = await pageTitleEle.textContent();
  await expect(pageTitle).toContain('Dashboard');
});

Given('User logs into the application as [{appUser}] [Login]', { timeout: 10 * 1000 }, async function (appUser) {
  await this.page.locator('[data-testid=userId]').click();
  await this.page.locator('[data-testid=userId]').fill(appUser.userId);
  await this.page.locator('[data-testid=continue]').click();
  await this.page.locator('[data-testid=password]').click();
  await this.page.locator('[data-testid=password]').fill(appUser.password);
  await this.page.locator('[data-testid=login]').click();
  await this.page.waitForTimeout(1000);
  const pageTitleEle = await this.page.locator('[data-testid=breadcrumb]');
  await expect(pageTitleEle).toBeVisible({ timeout: 10000 });
  const pageTitle = await pageTitleEle.textContent();
  await expect(pageTitle).toContain('Dashboard');
  /*await this.page.evaluate(() => {
    window.sfgBackendBaseUrl = window.location.protocol + "//" + window.location.hostname + ":8180/mock";
  });*/
});

Given('User logs into the application as [{appUser}] and lands into {string} [Login]', { timeout: 10 * 1000 }, async function (appUser, landingPage) {
  await this.page.locator('[data-testid=userId]').click();
  await this.page.locator('[data-testid=userId]').fill(appUser.userId);
  await this.page.locator('[data-testid=continue]').click();
  await this.page.locator('[data-testid=password]').click();
  await this.page.locator('[data-testid=password]').fill(appUser.password);
  await this.page.locator('[data-testid=login]').click();
  await this.page.waitForTimeout(1000);
  const pageTitleEle = await this.page.locator('[data-testid=breadcrumb]');
  await expect(pageTitleEle).toBeVisible({ timeout: 10000 });
  const pageTitle = await pageTitleEle.textContent();
  await expect(pageTitle).toContain(landingPage);
  /*await this.page.evaluate(() => {
    window.sfgBackendBaseUrl = window.location.protocol + "//" + window.location.hostname + ":8180/mock";
  });*/
});

Given('User has logged into the application as {string} with password {string}', async function (userName, password) {

  await this.page.goto(config.appUrl);
  await this.page.locator('[data-testid=userId]').click();
  await this.page.locator('[data-testid=userId]').fill(userName);
  await this.page.locator('[data-testid=continue]').click();
  await this.page.locator('[data-testid=password]').click();
  await this.page.locator('[data-testid=password]').fill(password);
  await this.page.locator('[data-testid=login]').click();
  await this.page.waitForTimeout(1000);
  const pageTitleEle = await this.page.locator('[data-testid=breadcrumb]');
  const pageTitle = await pageTitleEle.textContent();
  await expect(pageTitle).toContain('Dashboard');
});

Then('Logout from the application', async function () {
  await this.page.locator('[alt="DropDown Button"]').click();
  await this.page.locator('[data-id="nav-dropdown-logout"]').click();
});
