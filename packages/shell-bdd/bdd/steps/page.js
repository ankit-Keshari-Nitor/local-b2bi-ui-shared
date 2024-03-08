import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';


Then('User verifies {string} page is displayed [Page][{string}]', async function (pageTitle, pageId) {
  const text = await this.page.locator(`.sfg--page--${pageId} .page-header-container .cds--data-table-header__title`).textContent();
  await expect(text).toBe(pageTitle);
});

When('User clicks on {string} action in [Page][{string}]', async function (actionId, pageId) {
  const pageFooter = await this.page.locator(`.sfg--page--${pageId} .sfg--page--actions`);
  await expect(pageFooter).toBeVisible();
  const actionBtn = await pageFooter.getByRole('button', { name: actionId });
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();
});
