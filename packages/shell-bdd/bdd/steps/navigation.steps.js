import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('User navigates to {string} under {string} [App-Nav]', async function (secondaryNav, primaryNav) {
  await this.page.locator('.cds--header__menu-bar li a').filter({ hasText: primaryNav }).click();
  // await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
  await this.page.locator('.cds--side-nav__item a .cds--side-nav__link-text').filter({ hasText: secondaryNav }).click();
  await this.page.locator('[data-testid="side-nav-toggle-button"]').click();
});
