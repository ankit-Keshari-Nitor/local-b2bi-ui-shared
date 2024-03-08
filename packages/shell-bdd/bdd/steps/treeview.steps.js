import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('User clicks on tree item with label {string} in [Tree-View][{string}]', async function (label, treeViewId) {
  await this.page.locator(`.sfg--tree-view[name="${treeViewId}"] .cds--tree-node[name="${label}"]`).click();
});

When('User clicks on {string} action in [Tree-View][{string}]', async function (action, treeViewId) {
  const treeFooter = await this.page.locator(`.sfg--tree-view[name="${treeViewId}"] .sfg--tree-view-actions`);
  expect(treeFooter).toBeVisible();
  const actionBtn = await treeFooter.getByRole('button', { name: action });
  expect(actionBtn).toBeVisible();
  expect(actionBtn).toBeEnabled();
  await actionBtn.click();
});

Then('User verifies {string} action is {elementStatus} in [Tree-View][{string}]', async function (action, elementStatus, treeViewId) {
  const treeFooter = await this.page.locator(`.sfg--tree-view[name="${treeViewId}"] .sfg--tree-view-actions`);
  expect(treeFooter).toBeVisible();
  const actionBtn = await treeFooter.getByRole('button', { name: action });
  if (elementStatus === 'enabled') {
    expect(actionBtn).toBeEnabled();
  } else if (elementStatus === 'disabled') {
    expect(actionBtn).toBeDisabled();
  }
});
