import { Given, When, Then } from '@cucumber/cucumber';
import { getNotification } from '../page-objects/notification.po.js';

Then('User verifies [{notificationType}] notification with message {string} is [{elementStatus}] [Notification]', async function (notificationType, message, elementStatus) {
  const notification = getNotification(this.page);
  await notification.verifyNotificationMessage('banner', notificationType, message, elementStatus);
});

Then(
  'User verifies [{notificationType}] notification with message {string} is [{elementStatus}] [Notification][{string}]',
  async function (notificationType, message, elementStatus, notificationKind) {
    const notification = getNotification(this.page);
    await notification.verifyNotificationMessage(notificationKind, notificationType, message, elementStatus);
  }
);

When('User clicks on {string} action in [Notification]', async function (action) {
  const notification = getNotification(this.page);
  await notification.performNotificationAction('banner',action);
});

When('User clicks on {string} action in [Notification][{string}]', async function (action, notificationKind) {
  const notification = getNotification(this.page);
  await notification.performNotificationAction(notificationKind, action);
});
