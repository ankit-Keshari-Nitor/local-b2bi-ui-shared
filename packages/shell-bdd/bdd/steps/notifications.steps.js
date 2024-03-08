import { Given, When, Then } from '@cucumber/cucumber';
import { getNotification } from '../page-objects/notification.po.js';

Then('User verifies [{notificationType}] notification with message {string} is [{elementStatus}] [Notification]', async function (notificationType, message, elementStatus) {
  const notification = getNotification(this.page);
  await notification.verifyNotificationMessage(notificationType, message, elementStatus);
});

When('User clicks on {string} action in [Notification]', async function (action) {
  const notification = getNotification(this.page);
  await notification.performNotificationAction(action);
});
