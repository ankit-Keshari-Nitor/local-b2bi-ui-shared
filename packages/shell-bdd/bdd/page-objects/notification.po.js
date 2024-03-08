import { expect } from '@playwright/test';

class Notification {
  constructor(page) {
    this.page = page;
  }

  async verifyNotificationMessage(notificationType, message, elementStatus) {
    const notification = await this.page.locator(`[role=status].sfg--page-notification.cds--inline-notification--${notificationType}`);
    if (elementStatus === 'visible') {
      await expect(notification).toBeVisible();
      const subtitle = await notification.locator(`.cds--inline-notification__text-wrapper`);
      await expect(subtitle).toBeVisible();
      const messageStr = await subtitle.textContent();
      await expect(messageStr).toContain(message);
    } else if (elementStatus === 'hidden') {
      await expect(notification).toBeHidden();
    }
  }

  async performNotificationAction(action) {
    const notificationAction = await this.page.locator(`[role=status].sfg--page-notification .cds--inline-notification__${action}-button`);
    await expect(notificationAction).toBeVisible();
    await notificationAction.click();
  }
}

const getNotification = function (parent) {
  return new Notification(parent);
};

export default Notification;

export { getNotification };
