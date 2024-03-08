import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('User verifies pill with label {string} is {elementStatus} in [Selected-Values][{string}]', async function (label, elementStatus, selectedValuesId) {
  const pill = await this.page.locator(`.sfg--selected-values[name="${selectedValuesId}"] .sfg--selected-values-pill-container .cds--tag--filter`).filter({ hasText: label });
  if (elementStatus === 'visible') {
    await expect(pill).toBeVisible();
  } else if (elementStatus === 'hidden') {
    await expect(pill).toBeHidden();
  }
});

When('User removes pill with label {string} in [Selected-Values][{string}]', async function (label, selectedValuesId) {
  const pill = await this.page.locator(`.sfg--selected-values[name="${selectedValuesId}"] .sfg--selected-values-pill-container .cds--tag--filter`).filter({ hasText: label });
  await expect(pill).toBeVisible();
  await pill.locator('button').click();
});
