import { useApplication, useNotification } from '../providers';
import { useTranslation } from 'react-i18next';

const role = {
  success: 'status',
  error: 'alert',
  warning: 'alert',
  info: 'log'
};

const title = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information'
};
// role = 'alert' 'log' 'status'
// kind = 'error' 'info' 'info-square' 'success' 'warning' 'warning-alt'

const NotificationUtil = () => {
  const { setNotificationMessage } = useApplication();
  const { showToastMessage } = useNotification();
  const { t } = useTranslation();

  const showNotificationMessage = (type, kind, message) => {
    const notificationConfig = {
      id: Date.now() + type + kind + message,
      kind: kind,
      role: role[kind],
      title: t(`shell:notification.type.${kind}`),
      subtitle: message
    };

    if (type === 'banner') {
      setNotificationMessage(notificationConfig);
    } else if (type === 'toast') {
      showToastMessage(notificationConfig);
    } else {
      console.log('Please pass valid notification type banner|toast');
    }
  };

  return {
    showNotificationMessage
  };
};

export { NotificationUtil };
